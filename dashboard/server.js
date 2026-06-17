const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MODULES_CONFIG = process.env.MODULES_CONFIG || path.join(__dirname, '..', 'modules.json');
const POLL_INTERVAL_MS = 30000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(process.env.STYLES_DIR || path.join(__dirname, '..', 'styles')));

let modules = [];
let statusByName = {};

function loadModules() {
  const raw = fs.readFileSync(MODULES_CONFIG, 'utf-8');
  modules = JSON.parse(raw).modules;
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

app.get('/api/modules', (req, res) => {
  const result = modules.map((mod) => ({
    ...mod,
    status: statusByName[mod.name] || 'unknown',
  }));
  res.json(result);
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/overview', (req, res) => {
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
  <link rel="stylesheet" href="/overview.css" />
</head>
<body>
  <header class="overview-header">
    <div class="overview-header-inner">
      <div>
        <p class="overview-eyebrow">Collaboration &amp; Planning Platform</p>
        <h1 class="overview-title">Modul-Übersicht</h1>
      </div>
      <div class="overview-summary">
        <span class="overview-summary-count">${upCount}/${modules.length}</span>
        <span class="overview-summary-label">Module online</span>
      </div>
    </div>
  </header>
  <main class="overview-main">
    <div class="overview-grid">
      ${cards}
    </div>
  </main>
</body>
</html>`);
});

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
