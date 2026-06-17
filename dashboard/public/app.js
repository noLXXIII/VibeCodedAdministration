let currentModules = [];

async function loadModules() {
  const res = await fetch('/api/modules');
  currentModules = await res.json();
  const container = document.getElementById('modules');
  container.innerHTML = currentModules.map(renderCard).join('');
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
        <div class="overview-card-actions">
          <a class="btn" href="${mod.route}">Öffnen</a>
          <a class="btn" href="${mod.docsUrl}" target="_blank" rel="noopener">API-Doku</a>
          ${mod.adminUrl ? `<a class="btn" href="${mod.adminUrl}" target="_blank" rel="noopener">Admin</a>` : ''}
        </div>
      </div>
    </div>
  `;
}

loadModules();
setInterval(loadModules, 30000);

const addBtn = document.getElementById('add-module-btn');
const modalOverlay = document.getElementById('add-module-modal');
const addForm = document.getElementById('add-module-form');
const routeInput = document.getElementById('field-route');
const routeHint = document.getElementById('route-hint');
const cancelBtn = document.getElementById('add-module-cancel');
const submitBtn = document.getElementById('add-module-submit');

function openModal() {
  addForm.reset();
  routeHint.textContent = '';
  routeHint.classList.remove('error');
  modalOverlay.classList.remove('hidden');
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

addBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});

function normalizeRoute(raw) {
  let route = raw.trim().toLowerCase().replace(/[^a-z0-9/-]/g, '-');
  if (!route.startsWith('/')) route = `/${route}`;
  return route.replace(/\/+$/, '') || '/';
}

routeInput.addEventListener('input', () => {
  const route = normalizeRoute(routeInput.value);
  const taken = currentModules.some((mod) => mod.route === route);
  routeHint.textContent = taken
    ? `Pfad ${route} ist bereits vergeben`
    : `Erreichbar unter ${route}`;
  routeHint.classList.toggle('error', taken);
});

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const route = normalizeRoute(routeInput.value);
  if (currentModules.some((mod) => mod.route === route)) {
    routeHint.textContent = `Pfad ${route} ist bereits vergeben`;
    routeHint.classList.add('error');
    return;
  }

  const payload = {
    name: document.getElementById('field-name').value.trim(),
    team: document.getElementById('field-team').value.trim(),
    route,
    healthCheck: document.getElementById('field-health').value.trim(),
    docsUrl: document.getElementById('field-docs').value.trim(),
    adminUrl: document.getElementById('field-admin').value.trim() || undefined,
    repoUrl: document.getElementById('field-repo').value.trim() || undefined,
  };

  submitBtn.disabled = true;
  try {
    const res = await fetch('/api/modules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Modul konnte nicht angelegt werden');
    }
    closeModal();
    await loadModules();
  } catch (err) {
    routeHint.textContent = err.message;
    routeHint.classList.add('error');
  } finally {
    submitBtn.disabled = false;
  }
});

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
