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
        ${mod.adminUrl ? `<a class="btn" href="${mod.adminUrl}" target="_blank" rel="noopener">Admin</a>` : ''}
      </p>
    </div>
  `;
}

loadModules();
setInterval(loadModules, 30000);

const themeToggle = document.getElementById('theme-toggle');
function applyThemeIcon() {
  themeToggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
}
applyThemeIcon();
themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  applyThemeIcon();
});
