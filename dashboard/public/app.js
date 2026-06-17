async function loadModules() {
  const res = await fetch('/api/modules');
  const modules = await res.json();
  const container = document.getElementById('modules');
  container.innerHTML = modules.map(renderCard).join('');
}

function renderCard(mod) {
  const statusClass = `status-${mod.status}`;
  return `
    <div class="module-card">
      <h2>${mod.name}</h2>
      <p class="text-main">Team ${mod.team}</p>
      <span class="status-badge ${statusClass}">${mod.status}</span>
      <p class="mt-2">
        <a class="btn" href="${mod.route}">Öffnen</a>
        <a class="btn" href="${mod.docsUrl}" target="_blank" rel="noopener">API-Doku</a>
      </p>
    </div>
  `;
}

loadModules();
setInterval(loadModules, 30000);
