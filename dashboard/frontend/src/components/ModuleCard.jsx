export default function ModuleCard({ mod, actions }) {
  const initial = mod.name.trim().charAt(0).toUpperCase();

  return (
    <div className="overview-card">
      <div className="overview-card-top">
        <div className="overview-avatar">{initial}</div>
        <span className={`overview-pill pill-${mod.status}`}>{mod.status}</span>
      </div>
      <h2 className="overview-card-title">{mod.name}</h2>
      <p className="overview-card-route">{mod.route}</p>
      <div className="overview-card-footer">
        <span className="overview-team">Team {mod.team}</span>
        {actions}
      </div>
    </div>
  );
}
