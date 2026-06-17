const express = require('express');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const MODULES_CONFIG = process.env.MODULES_CONFIG || path.join(__dirname, '..', 'modules.json');
const POLL_INTERVAL_MS = 30000;

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, '..', 'styles')));

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
  const cards = modules
    .map((mod) => {
      const status = statusByName[mod.name] || 'unknown';
      const feedbackClass =
        status === 'up' ? 'feedback-success' : status === 'down' ? 'feedback-error' : 'feedback-in-progress';
      const dotColor =
        status === 'up' ? 'var(--success-color)' : status === 'down' ? 'var(--error-color)' : 'var(--in-progress-color)';
      return `
        <div class="overview-card rounded">
          <div class="overview-card-header">
            <span class="overview-dot" style="background:${dotColor}"></span>
            <h2 class="overview-card-title">${mod.name}</h2>
          </div>
          <p class="text-main ${feedbackClass} overview-status">${status}</p>
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
  <div class="container">
    <h1 class="title-l mt-3">Modul-Übersicht</h1>
    <p class="text-main mb-3">Aktueller Status aller Module der Collaboration &amp; Planning Platform</p>
    <div class="overview-grid">
      ${cards}
    </div>
  </div>
</body>
</html>`);
});

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
