import { useState } from 'react';
import useDeployLog from '../hooks/useDeployLog.js';

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('de-DE');
}

export default function DeployLogModal({ mod, onClose }) {
  const { status, log, reload } = useDeployLog(mod.route, true);
  const [redeploying, setRedeploying] = useState(false);

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  async function handleRedeploy() {
    setRedeploying(true);
    try {
      await fetch(`/api/modules${mod.route}/redeploy`, { method: 'POST' });
      await reload();
    } finally {
      setRedeploying(false);
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal">
        <h2 id="deploy-log-title">Deploy-Log — {mod.name}</h2>
        {status && <span className={`overview-pill pill-${status === 'deployed' ? 'up' : status === 'error' ? 'down' : 'unknown'}`}>{status}</span>}
        <div className="admin-deploy-log">
          {log.length === 0 && <p className="admin-route-hint">Noch keine Deploy-Aktivität.</p>}
          {log.map((entry, i) => (
            <p className="admin-deploy-log-line" key={i}>
              <span className="admin-deploy-log-ts">{formatTime(entry.ts)}</span> {entry.message}
            </p>
          ))}
        </div>
        <div className="admin-modal-actions">
          <button className="btn btn-secondary" type="button" onClick={handleRedeploy} disabled={redeploying}>
            {redeploying ? 'Redeploy läuft…' : 'Redeploy'}
          </button>
          <button className="btn" type="button" onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>
  );
}
