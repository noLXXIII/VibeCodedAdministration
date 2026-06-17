import { useState } from 'react';
import NavBar from '../components/NavBar.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import AddModuleModal from '../components/AddModuleModal.jsx';
import DeployLogModal from '../components/DeployLogModal.jsx';
import useModules from '../hooks/useModules.js';
import '../styles/status.css';
import '../styles/app.css';

export default function Admin() {
  const { modules, reload } = useModules();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [deployLogModule, setDeployLogModule] = useState(null);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(mod) {
    if (!window.confirm(`Modul "${mod.name}" wirklich löschen?`)) return;
    setDeleting(mod.route);
    try {
      await fetch(`/api/modules${mod.route}`, { method: 'DELETE' });
      reload();
    } finally {
      setDeleting(null);
    }
  }

  return (
    <>
      <NavBar />
      <header className="overview-header">
        <div className="overview-header-inner">
          <div>
            <p className="overview-eyebrow">Collaboration &amp; Planning Platform</p>
            <h1 className="overview-title">Admin Dashboard</h1>
          </div>
        </div>
      </header>
      <main className="overview-main">
        <div className="admin-toolbar">
          <button className="admin-add-btn" type="button" onClick={() => setShowAddModal(true)}>
            + Modul hinzufügen
          </button>
        </div>
        <div className="overview-grid">
          {modules.map((mod) => (
            <ModuleCard
              mod={mod}
              key={mod.route}
              actions={
                <div className="overview-card-actions">
                  <a className="btn" href={mod.route}>Öffnen</a>
                  <a className="btn" href={mod.docsUrl} target="_blank" rel="noopener noreferrer">API-Doku</a>
                  {mod.adminUrl && (
                    <a className="btn" href={mod.adminUrl} target="_blank" rel="noopener noreferrer">Admin</a>
                  )}
                  {mod.deployStatus && (
                    <button className="btn btn-secondary" type="button" onClick={() => setDeployLogModule(mod)}>
                      Deploy-Log
                    </button>
                  )}
                  <button className="btn btn-secondary" type="button" onClick={() => setEditingModule(mod)}>
                    Bearbeiten
                  </button>
                  <button
                    className="btn btn-secondary"
                    type="button"
                    disabled={deleting === mod.route}
                    onClick={() => handleDelete(mod)}
                  >
                    Löschen
                  </button>
                </div>
              }
            />
          ))}
        </div>
      </main>

      {showAddModal && (
        <AddModuleModal
          modules={modules}
          onClose={() => setShowAddModal(false)}
          onCreated={() => {
            setShowAddModal(false);
            reload();
          }}
        />
      )}

      {editingModule && (
        <AddModuleModal
          modules={modules}
          editingModule={editingModule}
          onClose={() => setEditingModule(null)}
          onCreated={() => {
            setEditingModule(null);
            reload();
          }}
        />
      )}

      {deployLogModule && (
        <DeployLogModal mod={deployLogModule} onClose={() => setDeployLogModule(null)} />
      )}
    </>
  );
}
