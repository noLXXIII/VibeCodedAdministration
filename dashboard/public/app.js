async function loadModules() {
  const res = await fetch('/api/modules');
  const modules = await res.json();
  const container = document.getElementById('modules');
  container.innerHTML = modules.map(renderCard).join('');
}

function renderCard(mod) {
  const statusClass = `pill-${mod.status}`;
  const initial = mod.name.trim().charAt(0).toUpperCase();
  return `
    <div class="overview-card">
      <div class="overview-card-top">
        <div class="overview-avatar">${initial}</div>
        <span class="overview-pill ${statusClass}">${mod.status}</span>
      </div>
      <h2 class="overview-card-title">${mod.name}</h2>
      <p class="overview-card-route">${mod.route}</p>
      <div class="overview-card-footer">
        <span class="overview-team">Team ${mod.team}</span>
        <p class="mt-2">
          <a class="btn" href="${mod.route}">Öffnen</a>
          <a class="btn" href="${mod.docsUrl}" target="_blank" rel="noopener">API-Doku</a>
          ${mod.adminUrl ? `<a class="btn" href="${mod.adminUrl}" target="_blank" rel="noopener">Admin</a>` : ''}
        </p>
      </div>
    </div>
  `;
}

loadModules();
setInterval(loadModules, 30000);

const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('.theme-toggle-icon') || themeToggle;
function applyThemeIcon() {
  themeIcon.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
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
