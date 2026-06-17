const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3000;
const MODULES_CONFIG = process.env.MODULES_CONFIG || path.join(__dirname, '..', 'modules.json');
const REPOS_DIR = process.env.REPOS_DIR || path.join(__dirname, 'repos');
const DEPLOY_NETWORK = process.env.DEPLOY_NETWORK || 'cpp-edge';
const POLL_INTERVAL_MS = 30000;
const DEPLOY_POLL_INTERVAL_MS = 60000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(process.env.STYLES_DIR || path.join(__dirname, '..', 'styles')));

let modules = [];
let repos = [];
let statusByName = {};
let deployedShaByRepoId = {};

function loadModules() {
  const raw = fs.readFileSync(MODULES_CONFIG, 'utf-8');
  const parsed = JSON.parse(raw);
  modules = parsed.modules || [];
  repos = parsed.repos || [];
}

function saveModules() {
  fs.writeFileSync(MODULES_CONFIG, JSON.stringify({ repos, modules }, null, 2));
}

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    execFile(cmd, args, { timeout: 5 * 60 * 1000, ...opts }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      resolve(stdout.trim());
    });
  });
}

async function checkHealth(mod) {
  try {
    const res = await fetch(mod.healthCheck, { signal: AbortSignal.timeout(5000) });
    return res.ok ? 'up' : 'down';
  } catch {
    return 'down';
  }
}

async function pollHealth() {
  for (const mod of modules) {
    statusByName[mod.name] = await checkHealth(mod);
  }
}

async function deployRepo(repo) {
  const repoPath = path.join(REPOS_DIR, repo.id);
  const branch = repo.branch || 'main';
  try {
    if (!fs.existsSync(path.join(repoPath, '.git'))) {
      fs.mkdirSync(REPOS_DIR, { recursive: true });
      await run('git', ['clone', '--branch', branch, '--single-branch', repo.repoUrl, repoPath]);
    } else {
      await run('git', ['fetch', 'origin', branch], { cwd: repoPath });
      await run('git', ['checkout', branch], { cwd: repoPath });
      await run('git', ['reset', '--hard', `origin/${branch}`], { cwd: repoPath });
    }
    const sha = await run('git', ['rev-parse', 'HEAD'], { cwd: repoPath });
    if (deployedShaByRepoId[repo.id] === sha) return;

    await run('docker', ['compose', '-p', repo.id, 'up', '-d', '--build'], { cwd: repoPath });
    deployedShaByRepoId[repo.id] = sha;
    console.log(`Deployed ${repo.id} at ${sha}`);
  } catch (err) {
    console.error(`Deploy failed for ${repo.id}:`, err.message);
  }
}

async function pollDeploys() {
  for (const repo of repos) {
    await deployRepo(repo);
  }
}

app.get('/api/modules', (req, res) => {
  const result = modules.map((mod) => ({
    ...mod,
    status: statusByName[mod.name] || 'unknown',
  }));
  res.json(result);
});

app.post('/api/modules', (req, res) => {
  const { name, team, route, healthCheck, docsUrl, adminUrl, repoId, repoUrl, branch } = req.body || {};

  if (!name || !team || !route || !healthCheck || !docsUrl) {
    return res.status(400).json({ error: 'name, team, route, healthCheck und docsUrl sind Pflichtfelder' });
  }
  if (!route.startsWith('/')) {
    return res.status(400).json({ error: 'route muss mit / beginnen' });
  }
  if (modules.some((mod) => mod.route === route)) {
    return res.status(409).json({ error: `Pfad ${route} ist bereits vergeben` });
  }

  let resolvedRepoId = repoId;
  if (repoUrl && !repos.some((repo) => repo.repoUrl === repoUrl)) {
    resolvedRepoId = resolvedRepoId || route.replace(/^\//, '').replace(/\//g, '-');
    if (repos.some((repo) => repo.id === resolvedRepoId)) {
      return res.status(409).json({ error: `repoId ${resolvedRepoId} ist bereits vergeben` });
    }
    repos.push({ id: resolvedRepoId, repoUrl, branch: branch || 'main' });
  }

  const newModule = { name, team, route, healthCheck, docsUrl };
  if (adminUrl) newModule.adminUrl = adminUrl;
  if (resolvedRepoId) newModule.repoId = resolvedRepoId;

  modules.push(newModule);
  saveModules();
  res.status(201).json(newModule);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'landing.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.get('/status', (req, res) => {
  const upCount = modules.filter((mod) => statusByName[mod.name] === 'up').length;
  const cards = modules
    .map((mod) => {
      const status = statusByName[mod.name] || 'unknown';
      const statusClass = `pill-${status}`;
      const initial = mod.name.trim().charAt(0).toUpperCase();
      return `
        <div class="overview-card">
          <div class="overview-card-top">
            <div class="overview-avatar">${initial}</div>
            <span class="overview-pill ${statusClass}">${status}</span>
          </div>
          <h2 class="overview-card-title">${mod.name}</h2>
          <p class="overview-card-route">${mod.route}</p>
          <div class="overview-card-footer">
            <span class="overview-team">Team ${mod.team}</span>
          </div>
        </div>`;
    })
    .join('\n');
  res.send(`<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <title>Modul-Übersicht</title>
  <link rel="stylesheet" href="/styles/Stylesheet.css" />
  <link rel="stylesheet" href="/status.css" />
  <script>
    (function () {
      var saved = localStorage.getItem('theme');
      if (saved === 'dark') document.documentElement.setAttribute('data-theme', 'dark');
    })();
  </script>
</head>
<body>
  <header class="overview-header">
    <div class="overview-header-inner">
      <div>
        <p class="overview-eyebrow">Collaboration &amp; Planning Platform</p>
        <h1 class="overview-title">Modul-Übersicht</h1>
      </div>
      <div class="overview-header-actions">
        <div class="overview-summary">
          <span class="overview-summary-count">${upCount}/${modules.length}</span>
          <span class="overview-summary-label">Module online</span>
        </div>
        <button id="theme-toggle" class="theme-toggle" type="button" aria-label="Theme umschalten">
          <span class="theme-toggle-icon">🌙</span>
        </button>
      </div>
    </div>
  </header>
  <main class="overview-main">
    <div class="overview-grid">
      ${cards}
    </div>
  </main>
  <script>
    var btn = document.getElementById('theme-toggle');
    var icon = btn.querySelector('.theme-toggle-icon');
    function applyIcon() {
      icon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
    }
    applyIcon();
    btn.addEventListener('click', function () {
      var isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
      }
      applyIcon();
    });
  </script>
</body>
</html>`);
});

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);
pollDeploys();
setInterval(pollDeploys, DEPLOY_POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
