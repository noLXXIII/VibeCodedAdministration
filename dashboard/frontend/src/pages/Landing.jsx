import { useEffect, useRef } from 'react';
import NavBar from '../components/NavBar.jsx';
import HeroOrbit from '../components/HeroOrbit.jsx';
import '../styles/landing.css';

function Reveal({ children, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`reveal ${className}`.trim()}>
      {children}
    </section>
  );
}

export default function Landing() {
  return (
    <>
      <NavBar variant="landing" />

      <div className="lp-hero-wrap">
        <div className="lp-bg-grid"></div>
        <div className="lp-glow lp-glow-1"></div>
        <div className="lp-glow lp-glow-2"></div>
        <section className="lp-hero">
          <span className="lp-eyebrow fade-up">Für moderne Teams gebaut</span>
          <h1 className="fade-up" style={{ animationDelay: '0.08s' }}>
            Eine Plattform für <span className="accent">Kommunikation, Dateien, Planung &amp; Userverwaltung</span>
          </h1>
          <p className="fade-up" style={{ animationDelay: '0.16s' }}>
            CPP bringt alle Module deiner Organisation unter einem Dach zusammen — ein Login, ein Dashboard, null Reibungsverluste.
          </p>
          <div className="lp-hero-actions fade-up" style={{ animationDelay: '0.24s' }}>
            <a className="btn btn-gradient" href="/auth/">Jetzt starten</a>
            <a className="btn btn-ghost" href="/status">Live-Status ansehen</a>
          </div>

          <HeroOrbit />

          <div className="lp-mock fade-up" style={{ animationDelay: '0.32s' }}>
            <div className="lp-mock-bar">
              <span className="lp-mock-dot" style={{ background: '#FF6B6B' }}></span>
              <span className="lp-mock-dot" style={{ background: '#FFD700' }}></span>
              <span className="lp-mock-dot" style={{ background: '#6BCF7F' }}></span>
              <span className="lp-mock-url">hackathon.amogusdrip.de/status</span>
            </div>
            <div className="lp-mock-body">
              <div className="lp-mock-card">
                <div className="lp-mock-card-top">
                  <div className="lp-mock-avatar">A</div>
                  <span className="lp-mock-pill pill-up">up</span>
                </div>
                <p className="lp-mock-card-title">Auth (Authentik)</p>
              </div>
              <div className="lp-mock-card">
                <div className="lp-mock-card-top">
                  <div className="lp-mock-avatar">K</div>
                  <span className="lp-mock-pill pill-up">up</span>
                </div>
                <p className="lp-mock-card-title">Kommunikation</p>
              </div>
              <div className="lp-mock-card">
                <div className="lp-mock-card-top">
                  <div className="lp-mock-avatar">D</div>
                  <span className="lp-mock-pill pill-up">up</span>
                </div>
                <p className="lp-mock-card-title">Dateimanagement</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Reveal className="lp-stats">
        <div className="lp-stat">
          <span className="lp-stat-number">5</span>
          <span className="lp-stat-label">Module vereint</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">1</span>
          <span className="lp-stat-label">Login für alles</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">24/7</span>
          <span className="lp-stat-label">Live-Monitoring</span>
        </div>
        <div className="lp-stat">
          <span className="lp-stat-number">100%</span>
          <span className="lp-stat-label">HTTPS-verschlüsselt</span>
        </div>
      </Reveal>

      <Reveal className="lp-section">
        <h2 className="lp-section-title">Fakten, die zählen</h2>
        <p className="lp-section-subtitle">Eine zentrale Schicht, die alle Module deiner Organisation nahtlos verbindet.</p>
        <div className="lp-facts-grid">
          <div className="lp-fact-card">
            <div className="lp-fact-icon">🔒</div>
            <h3>Ein Login für alles</h3>
            <p>Zentrale Authentifizierung — ein Konto für sämtliche Module.</p>
          </div>
          <div className="lp-fact-card">
            <div className="lp-fact-icon">⚡</div>
            <h3>Live-Health-Monitoring</h3>
            <p>Jedes Modul meldet seinen Status in Echtzeit — transparent für alle Beteiligten.</p>
          </div>
          <div className="lp-fact-card">
            <div className="lp-fact-icon">🧩</div>
            <h3>Mehrere Module, 1 Plattform</h3>
            <p>Kommunikation, Dateimanagement, Projektplanung, Userverwaltung und Auth — nahtlos verzahnt.</p>
          </div>
          <div className="lp-fact-card">
            <div className="lp-fact-icon">🔐</div>
            <h3>HTTPS by default</h3>
            <p>Verschlüsselte Verbindung auf jeder Route der Plattform.</p>
          </div>
        </div>
      </Reveal>

      <Reveal className="lp-section">
        <h2 className="lp-section-title">Alle Module auf einen Blick</h2>
        <p className="lp-section-subtitle">Jeder Bereich bringt seinen eigenen Microservice mit — CPP führt sie zu einer Plattform zusammen.</p>
        <div className="lp-modules-strip">
          {['Kommunikation', 'Dateimanagement', 'Projektplanung', 'Userverwaltung', 'Auth'].map((name) => (
            <div className="lp-module-chip" key={name}>
              <span className="lp-module-chip-dot"></span>
              <span>{name}</span>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="lp-section">
        <h2 className="lp-section-title">Was als Nächstes kommt</h2>
        <p className="lp-section-subtitle">Die Roadmap für die nächsten Ausbaustufen der Plattform.</p>
        <div className="lp-facts-grid">
          {[
            { icon: '📅', title: 'Kalender-Integration', text: 'Termine aus der Projektplanung direkt mit externen Kalendern synchronisieren.' },
            { icon: '🔔', title: 'Benachrichtigungs-Center', text: 'Push- und E-Mail-Benachrichtigungen über alle Module hinweg, zentral konfigurierbar.' },
            { icon: '📱', title: 'Mobile App', text: 'Native Apps für iOS und Android mit Offline-Zugriff auf Dateien und Nachrichten.' },
            { icon: '🔌', title: 'Öffentliche API & Webhooks', text: 'Eigene Integrationen bauen und Events in Echtzeit an externe Systeme weiterleiten.' },
          ].map((item) => (
            <div className="lp-fact-card lp-fact-card-soon" key={item.title}>
              <span className="lp-soon-badge">Geplant</span>
              <div className="lp-fact-icon">{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="lp-section">
        <h2 className="lp-section-title">Was Nutzer sagen</h2>
        <p className="lp-section-subtitle">Stimmen von Teams, die täglich mit CPP arbeiten.</p>
        <div className="lp-testimonials-grid">
          {[
            { quote: 'Endlich müssen wir uns nicht mehr um eigene Auth-Logik kümmern — ein Login reicht für alles.', name: 'Nina K.', role: 'Userverwaltung', initial: 'N' },
            { quote: 'Das Health-Dashboard zeigt uns sofort, wenn ein Modul down ist — kein Rätselraten mehr.', name: 'Karim S.', role: 'Projektplanung', initial: 'K' },
            { quote: 'Onboarding neuer Module dauert dank klarer Konventionen nur noch Minuten.', name: 'Jana T.', role: 'Dateimanagement', initial: 'J' },
          ].map((t) => (
            <div className="lp-testimonial-card" key={t.name}>
              <p className="lp-testimonial-quote">{t.quote}</p>
              <div className="lp-testimonial-author">
                <div className="lp-testimonial-avatar">{t.initial}</div>
                <div>
                  <p className="lp-testimonial-author-name">{t.name}</p>
                  <p className="lp-testimonial-author-role">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Reveal>

      <Reveal className="lp-cta">
        <h2>Bereit, dich anzumelden?</h2>
        <p>Ein Klick zu allen Modulen der Collaboration &amp; Planning Platform.</p>
        <a className="btn" href="/auth/">Jetzt einloggen</a>
      </Reveal>

      <footer className="lp-footer">CPP — Collaboration &amp; Planning Platform</footer>
    </>
  );
}
