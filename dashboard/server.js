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

loadModules();
pollHealth();
setInterval(pollHealth, POLL_INTERVAL_MS);

app.listen(PORT, () => {
  console.log(`Admin dashboard listening on port ${PORT}`);
});
