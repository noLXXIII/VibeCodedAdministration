import { useState } from 'react';
import '../styles/cookiebanner.css';

const STORAGE_KEY = 'cookie-consent';

function loadConsent() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function saveConsent(consent) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...consent, decidedAt: new Date().toISOString() }));
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !loadConsent());
  const [expanded, setExpanded] = useState(false);
  const [functional, setFunctional] = useState(true);
  const [statistics, setStatistics] = useState(false);

  function acceptAll() {
    saveConsent({ necessary: true, functional: true, statistics: true });
    setVisible(false);
  }

  function acceptNecessaryOnly() {
    saveConsent({ necessary: true, functional: false, statistics: false });
    setVisible(false);
  }

  function saveSelection() {
    saveConsent({ necessary: true, functional, statistics });
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie-Einstellungen">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          Wir verwenden Cookies, um die Plattform bereitzustellen und optional die Nutzung zu
          verbessern. Notwendige Cookies sind immer aktiv. Details findest du in der{' '}
          <a href="/datenschutz">Datenschutzerklärung</a>.
        </p>

        {expanded && (
          <div className="cookie-banner-categories">
            <label className="cookie-category">
              <input type="checkbox" checked disabled />
              <span>
                <strong>Notwendig</strong>
                <small>Für den Betrieb der Plattform erforderlich, nicht abwählbar.</small>
              </span>
            </label>
            <label className="cookie-category">
              <input
                type="checkbox"
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
              />
              <span>
                <strong>Funktional</strong>
                <small>Speichert z. B. deine Theme-Einstellung.</small>
              </span>
            </label>
            <label className="cookie-category">
              <input
                type="checkbox"
                checked={statistics}
                onChange={(e) => setStatistics(e.target.checked)}
              />
              <span>
                <strong>Statistik</strong>
                <small>Aktuell ungenutzt — kein Tracking auf dieser Plattform aktiv.</small>
              </span>
            </label>
          </div>
        )}

        <div className="cookie-banner-actions">
          {!expanded && (
            <button className="cookie-btn cookie-btn-ghost" type="button" onClick={() => setExpanded(true)}>
              Auswahl anpassen
            </button>
          )}
          {expanded && (
            <button className="cookie-btn cookie-btn-ghost" type="button" onClick={saveSelection}>
              Auswahl speichern
            </button>
          )}
          <button className="cookie-btn cookie-btn-secondary" type="button" onClick={acceptNecessaryOnly}>
            Nur notwendige
          </button>
          <button className="cookie-btn cookie-btn-primary" type="button" onClick={acceptAll}>
            Alle akzeptieren
          </button>
        </div>
      </div>
    </div>
  );
}
