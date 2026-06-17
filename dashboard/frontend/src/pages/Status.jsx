import NavBar from '../components/NavBar.jsx';
import ModuleCard from '../components/ModuleCard.jsx';
import useModules from '../hooks/useModules.js';
import '../styles/status.css';

export default function Status() {
  const { modules } = useModules();
  const upCount = modules.filter((mod) => mod.status === 'up').length;

  return (
    <>
      <NavBar />
      <header className="overview-header">
        <div className="overview-header-inner">
          <div>
            <p className="overview-eyebrow">Collaboration &amp; Planning Platform</p>
            <h1 className="overview-title">Modul-Übersicht</h1>
          </div>
          <div className="overview-header-actions">
            <div className="overview-summary">
              <span className="overview-summary-count">{upCount}/{modules.length}</span>
              <span className="overview-summary-label">Module online</span>
            </div>
          </div>
        </div>
      </header>
      <main className="overview-main">
        <div className="overview-grid">
          {modules.map((mod) => (
            <ModuleCard mod={mod} key={mod.route} />
          ))}
        </div>
      </main>
    </>
  );
}
