const express = require('express');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = process.env.PORT || 3000;
const MODULES_CONFIG = process.env.MODULES_CONFIG || path.join(__dirname, '..', 'modules.json');
const REPOS_DIR = process.env.REPOS_DIR || path.join(__dirname, 'repos');
const DEPLOY_NETWORK = process.env.DEPLOY_NETWORK || 'cpp-edge';
const PUBLIC_DOMAIN = process.env.PUBLIC_DOMAIN || 'hackathon.amogusdrip.de';
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
let deployState = {};

const COMPOSE_FILENAMES = ['docker-compose.yml', 'docker-compose.yaml', 'compose.yml', 'compose.yaml'];
const RESERVED_ROUTES = ['/auth', '/admin', '/status', '/api', '/health', '/styles', '/'];

function isReservedRoute(route) {
  return RESERVED_ROUTES.some((reserved) => route === reserved || route.startsWith(`${reserved}/`));
}

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

function logDeploy(repoId, status, message) {
  if (!deployState[repoId]) deployState[repoId] = { status: 'pending', log: [] };
  deployState[repoId].status = status;
  deployState[repoId].log.push({ ts: new Date().toISOString(), message });
  if (deployState[repoId].log.length > 50) deployState[repoId].log.shift();
  console.log(`[deploy:${repoId}] ${status} — ${message}`);
}

function findComposeFile(repoPath) {
  return COMPOSE_FILENAMES.find((f) => fs.existsSync(path.join(repoPath, f)));
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

async function deployRepo(repo, { force = false } = {}) {
  const repoPath = path.join(REPOS_DIR, repo.id);
  const branch = repo.branch || 'main';
  try {
    if (!fs.existsSync(path.join(repoPath, '.git'))) {
      fs.mkdirSync(REPOS_DIR, { recursive: true });
      logDeploy(repo.id, 'cloning', `Klone ${repo.repoUrl} (Branch ${branch})...`);
      await run('git', ['clone', '--branch', branch, '--single-branch', repo.repoUrl, repoPath]);
      logDeploy(repo.id, 'cloning', 'Repository erfolgreich geklont');
    } else {
      logDeploy(repo.id, 'pulling', 'Prüfe auf neue Commits...');
      await run('git', ['fetch', 'origin', branch], { cwd: repoPath });
      await run('git', ['checkout', branch], { cwd: repoPath });
      await run('git', ['reset', '--hard', `origin/${branch}`], { cwd: repoPath });
    }
    const sha = await run('git', ['rev-parse', 'HEAD'], { cwd: repoPath });
    if (!force && deployedShaByRepoId[repo.id] === sha) {
      deployState[repo.id] = deployState[repo.id] || { status: 'deployed', log: [] };
      deployState[repo.id].status = 'deployed';
      return;
    }

    const composeFile = findComposeFile(repoPath);
    if (!composeFile) {
      logDeploy(repo.id, 'error', `Keine ${COMPOSE_FILENAMES.join('/')} im Repo-Root (${repoPath}) gefunden — Deployment abgebrochen`);
      return;
    }

    logDeploy(repo.id, 'building', `${composeFile} gefunden, starte docker compose up --build...`);
    await run('docker', ['compose', '-f', composeFile, '-p', repo.id, 'up', '-d', '--build'], { cwd: repoPath });
    deployedShaByRepoId[repo.id] = sha;
    repo.lastDeployedAt = new Date().toISOString();
    repo.lastDeployedSha = sha;
    saveModules();
    logDeploy(repo.id, 'deployed', `Deployment erfolgreich (Commit ${sha.slice(0, 7)})`);
  } catch (err) {
    logDeploy(repo.id, 'error', `Deployment fehlgeschlagen: ${err.message}`);
  }
}

async function undeployRepo(repo) {
  const repoPath = path.join(REPOS_DIR, repo.id);
  const composeFile = findComposeFile(repoPath);
  if (composeFile) {
    try {
      await run('docker', ['compose', '-f', composeFile, '-p', repo.id, 'down', '-v'], { cwd: repoPath });
    } catch (err) {
      console.error(`Undeploy failed for ${repo.id}:`, err.message);
    }
  }
  fs.rmSync(repoPath, { recursive: true, force: true });
  delete deployState[repo.id];
  delete deployedShaByRepoId[repo.id];
}

async function pollDeploys() {
  for (const repo of repos) {
    await deployRepo(repo);
  }
}

function deriveUrls(route) {
  const base = `https://${PUBLIC_DOMAIN}${route}`;
  return {
    healthCheck: `${base}/health`,
    docsUrl: `${base}/openapi.json`,
  };
}

function repoForModule(mod) {
  return mod.repoId ? repos.find((repo) => repo.id === mod.repoId) : undefined;
}

function serializeModule(mod) {
  const repo = repoForModule(mod);
  return {
    ...mod,
    status: statusByName[mod.name] || 'unknown',
    lastDeployedAt: repo ? repo.lastDeployedAt || null : null,
    deployStatus: repo ? (deployState[repo.id] || { status: 'pending', log: [] }).status : null,
  };
}

app.get('/api/modules', (req, res) => {
  res.json(modules.map(serializeModule));
});

app.get('/api/repos', (req, res) => {
  res.json(repos.map((repo) => ({ id: repo.id, repoUrl: repo.repoUrl, branch: repo.branch || 'main' })));
});

app.get('/api/modules/:route(.*)/deploy-log', (req, res) => {
  const route = `/${req.params.route}`;
  const mod = modules.find((m) => m.route === route);
  if (!mod) return res.status(404).json({ error: 'Modul nicht gefunden' });
  const repo = repoForModule(mod);
  if (!repo) return res.json({ status: null, log: [] });
  res.json(deployState[repo.id] || { status: 'pending', log: [] });
});

app.post('/api/modules', (req, res) => {
  const { name, team, route, healthCheck, docsUrl, adminUrl, repoId, repoUrl, branch } = req.body || {};

  if (!name || !team || !route) {
    return res.status(400).json({ error: 'name, team und route sind Pflichtfelder' });
  }
  if (!route.startsWith('/')) {
    return res.status(400).json({ error: 'route muss mit / beginnen' });
  }
  if (isReservedRoute(route)) {
    return res.status(409).json({ error: `Pfad ${route} ist reserviert (Gateway/Auth/Admin)` });
  }
  if (modules.some((mod) => mod.route === route)) {
    return res.status(409).json({ error: `Pfad ${route} ist bereits vergeben` });
  }

  const derived = deriveUrls(route);

  let resolvedRepoId = repoId;
  if (repoUrl && !repos.some((repo) => repo.repoUrl === repoUrl)) {
    resolvedRepoId = resolvedRepoId || route.replace(/^\//, '').replace(/\//g, '-');
    if (repos.some((repo) => repo.id === resolvedRepoId)) {
      return res.status(409).json({ error: `repoId ${resolvedRepoId} ist bereits vergeben` });
    }
    repos.push({ id: resolvedRepoId, repoUrl, branch: branch || 'main' });
  }

  const newModule = {
    name,
    team,
    route,
    healthCheck: healthCheck || derived.healthCheck,
    docsUrl: docsUrl || derived.docsUrl,
  };
  if (adminUrl) newModule.adminUrl = adminUrl;
  if (resolvedRepoId) newModule.repoId = resolvedRepoId;

  modules.push(newModule);
  saveModules();

  const repo = repoForModule(newModule);
  if (repo) deployRepo(repo);

  res.status(201).json(serializeModule(newModule));
});

app.put('/api/modules/:route(.*)', (req, res) => {
  const route = `/${req.params.route}`;
  const mod = modules.find((m) => m.route === route);
  if (!mod) return res.status(404).json({ error: 'Modul nicht gefunden' });

  const { name, team, route: newRoute, healthCheck, docsUrl, adminUrl } = req.body || {};
  if (!name || !team || !newRoute) {
    return res.status(400).json({ error: 'name, team und route sind Pflichtfelder' });
  }
  if (!newRoute.startsWith('/')) {
    return res.status(400).json({ error: 'route muss mit / beginnen' });
  }
  if (newRoute !== route && isReservedRoute(newRoute)) {
    return res.status(409).json({ error: `Pfad ${newRoute} ist reserviert (Gateway/Auth/Admin)` });
  }
  if (newRoute !== route && modules.some((m) => m.route === newRoute)) {
    return res.status(409).json({ error: `Pfad ${newRoute} ist bereits vergeben` });
  }

  const derived = deriveUrls(newRoute);
  mod.name = name;
  mod.team = team;
  mod.route = newRoute;
  mod.healthCheck = healthCheck || derived.healthCheck;
  mod.docsUrl = docsUrl || derived.docsUrl;
  if (adminUrl) mod.adminUrl = adminUrl;
  else delete mod.adminUrl;

  saveModules();
  res.json(serializeModule(mod));
});

app.delete('/api/modules/:route(.*)', async (req, res) => {
  const route = `/${req.params.route}`;
  const index = modules.findIndex((m) => m.route === route);
  if (index === -1) return res.status(404).json({ error: 'Modul nicht gefunden' });

  const mod = modules[index];
  const repo = repoForModule(mod);
  const stillUsesRepo = repo && modules.some((m, i) => i !== index && m.repoId === repo.id);

  modules.splice(index, 1);
  if (repo && !stillUsesRepo) {
    repos = repos.filter((r) => r.id !== repo.id);
    await undeployRepo(repo);
  }
  saveModules();
  res.status(204).end();
});

app.post('/api/modules/:route(.*)/redeploy', (req, res) => {
  const route = `/${req.params.route}`;
  const mod = modules.find((m) => m.route === route);
  if (!mod) return res.status(404).json({ error: 'Modul nicht gefunden' });
  const repo = repoForModule(mod);
  if (!repo) return res.status(400).json({ error: 'Dieses Modul hat kein verknüpftes Git-Repo' });

  deployRepo(repo, { force: true });
  res.status(202).json({ status: 'redeploy gestartet' });
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

const FRONTEND_ROUTES = ['/', '/admin', '/status', '/impressum', '/datenschutz', '/about', '/planning', '/planning/*'];
app.get(FRONTEND_ROUTES, (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);
pollDeploys();
setInterval(pollDeploys, DEPLOY_POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
