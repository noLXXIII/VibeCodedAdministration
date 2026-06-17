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
  const rows = modules
    .map((mod) => {
      const status = statusByName[mod.name] || 'unknown';
      return `<tr><td>${mod.name}</td><td>${status}</td></tr>`;
    })
    .join('\n');
  res.send(`<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><title>Modul-Übersicht</title></head>
<body>
  <h1>Modul-Übersicht</h1>
  <table border="1" cellpadding="6">
    <tr><th>Name</th><th>Status</th></tr>
    ${rows}
  </table>
</body>
</html>`);
});

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
