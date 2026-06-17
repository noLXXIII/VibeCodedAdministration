import { useEffect, useState } from 'react';

function normalizeRoute(raw) {
  let route = raw.trim().toLowerCase().replace(/[^a-z0-9/-]/g, '-');
  if (!route.startsWith('/')) route = `/${route}`;
  return route.replace(/\/+$/, '') || '/';
}

export default function AddModuleModal({ modules, editingModule, onClose, onCreated }) {
  const isEditing = Boolean(editingModule);
  const [name, setName] = useState(editingModule?.name || '');
  const [team, setTeam] = useState(editingModule?.team || '');
  const [route, setRoute] = useState(editingModule?.route || '');
  const [healthCheck, setHealthCheck] = useState(editingModule?.healthCheck || '');
  const [docsUrl, setDocsUrl] = useState(editingModule?.docsUrl || '');
  const [adminUrl, setAdminUrl] = useState(editingModule?.adminUrl || '');
  const [repoMode, setRepoMode] = useState('new');
  const [repoId, setRepoId] = useState(editingModule?.repoId || '');
  const [repoUrl, setRepoUrl] = useState('');
  const [repos, setRepos] = useState([]);
  const [hint, setHint] = useState({ text: '', kind: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch('/api/repos')
      .then((res) => res.json())
      .then(setRepos)
      .catch(() => setRepos([]));
  }, []);

  const normalizedRoute = isEditing ? route : normalizeRoute(route);
  const taken = modules.some((mod) => mod.route === normalizedRoute && mod.route !== editingModule?.route);

  function handleRouteChange(value) {
    setRoute(value);
    const nextRoute = normalizeRoute(value);
    const nextTaken = modules.some((mod) => mod.route === nextRoute && mod.route !== editingModule?.route);
    if (nextTaken) {
      setHint({ text: `Pfad ${nextRoute} ist bereits vergeben`, kind: 'error' });
    } else if (value.trim().length > 0) {
      setHint({ text: `Erreichbar unter ${nextRoute}`, kind: 'ok' });
    } else {
      setHint({ text: '', kind: '' });
    }
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (taken) {
      setHint({ text: `Pfad ${normalizedRoute} ist bereits vergeben`, kind: 'error' });
      return;
    }

    const payload = {
      name: name.trim(),
      team: team.trim(),
      route: normalizedRoute,
      healthCheck: healthCheck.trim(),
      docsUrl: docsUrl.trim(),
      adminUrl: adminUrl.trim() || undefined,
    };
    if (!isEditing) {
      if (repoMode === 'existing') payload.repoId = repoId || undefined;
      if (repoMode === 'new') payload.repoUrl = repoUrl.trim() || undefined;
    }

    setSubmitting(true);
    try {
      const url = isEditing ? `/api/modules${editingModule.route}` : '/api/modules';
      const method = isEditing ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Modul konnte nicht gespeichert werden');
      }
      onCreated();
    } catch (err) {
      setHint({ text: err.message, kind: 'error' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal">
        <h2>{isEditing ? 'Modul bearbeiten' : 'Neues Modul registrieren'}</h2>
        <p className="admin-modal-subtitle">
          Gemäß TEAM-CONVENTIONS.md: Health-Check, API-Doku und ein freier URL-Pfad sind Pflicht.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="admin-form-group span-2">
              <label htmlFor="field-name">Modulname</label>
              <input
                id="field-name"
                className="input-field"
                type="text"
                required
                placeholder="z. B. Kommunikation"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="field-team">Team</label>
              <input
                id="field-team"
                className="input-field"
                type="text"
                required
                placeholder="z. B. 1"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="field-route">URL-Pfad</label>
              <input
                id="field-route"
                className="input-field"
                type="text"
                required
                placeholder="/mein-modul"
                value={route}
                onChange={(e) => handleRouteChange(e.target.value)}
              />
            </div>
            <div className="admin-form-group span-2">
              <p className={`admin-route-hint ${hint.kind}`}>{hint.text}</p>
            </div>
            <div className="admin-form-group span-2">
              <label htmlFor="field-health">
                Health-Check-URL <span className="admin-field-optional">(optional, sonst automatisch aus Pfad)</span>
              </label>
              <input
                id="field-health"
                className="input-field"
                type="text"
                placeholder="wird automatisch aus dem URL-Pfad abgeleitet"
                value={healthCheck}
                onChange={(e) => setHealthCheck(e.target.value)}
              />
            </div>
            <div className="admin-form-group span-2">
              <label htmlFor="field-docs">
                API-Doku-URL <span className="admin-field-optional">(optional, sonst automatisch aus Pfad)</span>
              </label>
              <input
                id="field-docs"
                className="input-field"
                type="text"
                placeholder="wird automatisch aus dem URL-Pfad abgeleitet"
                value={docsUrl}
                onChange={(e) => setDocsUrl(e.target.value)}
              />
            </div>
            <div className="admin-form-group span-2">
              <label htmlFor="field-admin">
                Admin-URL <span className="admin-field-optional">(optional)</span>
              </label>
              <input
                id="field-admin"
                className="input-field"
                type="text"
                placeholder="http://service:port/admin"
                value={adminUrl}
                onChange={(e) => setAdminUrl(e.target.value)}
              />
            </div>
            {!isEditing && (
              <>
                <div className="admin-form-group span-2">
                  <label htmlFor="field-repo-mode">
                    Git-Repo <span className="admin-field-optional">(optional, für Auto-Deploy)</span>
                  </label>
                  <select
                    id="field-repo-mode"
                    className="input-field"
                    value={repoMode}
                    onChange={(e) => setRepoMode(e.target.value)}
                  >
                    <option value="new">Neues Repo</option>
                    <option value="existing" disabled={repos.length === 0}>
                      Bestehendes Repo wiederverwenden (mehrere Services pro Repo)
                    </option>
                    <option value="none">Kein Repo (manuell verwaltet)</option>
                  </select>
                </div>
                {repoMode === 'new' && (
                  <div className="admin-form-group span-2">
                    <input
                      className="input-field"
                      type="text"
                      placeholder="https://github.com/org/repo.git"
                      value={repoUrl}
                      onChange={(e) => setRepoUrl(e.target.value)}
                    />
                  </div>
                )}
                {repoMode === 'existing' && (
                  <div className="admin-form-group span-2">
                    <select
                      className="input-field"
                      value={repoId}
                      onChange={(e) => setRepoId(e.target.value)}
                    >
                      <option value="">Repo auswählen…</option>
                      {repos.map((repo) => (
                        <option value={repo.id} key={repo.id}>
                          {repo.id} ({repo.repoUrl})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="admin-modal-actions">
            <button className="btn btn-secondary" type="button" onClick={onClose}>Abbrechen</button>
            <button className="btn" type="submit" disabled={submitting}>
              {isEditing ? 'Speichern' : 'Modul anlegen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
