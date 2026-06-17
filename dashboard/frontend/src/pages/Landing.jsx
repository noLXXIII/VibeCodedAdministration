import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import HeroOrbit from '../components/HeroOrbit.jsx';
import FeatureSection from '../components/features/FeatureSection.jsx';
import ChatAnimation from '../components/features/ChatAnimation.jsx';
import FileUploadAnimation from '../components/features/FileUploadAnimation.jsx';
import PlanningAnimation from '../components/features/PlanningAnimation.jsx';
import ModuleAddAnimation from '../components/features/ModuleAddAnimation.jsx';
import '../styles/landing.css';
import '../styles/features.css';

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

      <section className="feat-section">
        <Reveal>
          <h2 className="lp-section-title">Die Module im Detail</h2>
          <p className="lp-section-subtitle">Vier Bausteine, die zusammen den Arbeitsalltag deines Teams tragen.</p>
        </Reveal>

        <FeatureSection
          eyebrow="Kommunikation"
          title="Chat ohne Kontextwechsel"
          text="Nachrichten, Threads und Benachrichtigungen direkt neben Dateien und Aufgaben — kein Wechsel zwischen Tools mehr nötig."
          bullets={['Echtzeit-Nachrichten', 'Team- & Direktnachrichten', 'Tippindikator & Lesebestätigung']}
          animation={<ChatAnimation />}
        />

        <FeatureSection
          eyebrow="Dateimanagement"
          title="Dateien landen, wo sie hingehören"
          text="Hochladen, ablegen, freigeben — mit klarer Ordnerstruktur und sofortigem Zugriff für alle Berechtigten."
          bullets={['Drag & Drop Upload', 'Versionierung', 'Granulare Freigaben']}
          animation={<FileUploadAnimation />}
          reverse
        />

        <FeatureSection
          eyebrow="Projektplanung"
          title="Vom To-do bis Done sichtbar"
          text="Kanban-Boards zeigen jederzeit, woran gerade gearbeitet wird und was als Nächstes ansteht."
          bullets={['Drag-and-Drop-Boards', 'Fälligkeitsdaten & Prioritäten', 'Fortschritt in Echtzeit']}
          animation={<PlanningAnimation />}
        />

        <FeatureSection
          eyebrow="Modulerweiterung"
          title="Neue Module in Minuten andocken"
          text="Über das Admin-Dashboard wird ein neues Modul registriert, gebaut und deployt — automatisch eingebunden in die Plattform."
          bullets={['Repo verknüpfen & deployen', 'Live-Deploy-Log', 'Sofort im Status-Dashboard sichtbar']}
          animation={<ModuleAddAnimation />}
          reverse
        />
      </section>

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

      <footer className="lp-footer">
        <span>CPP — Collaboration &amp; Planning Platform</span>
        <nav className="lp-footer-links">
          <Link to="/about">Über uns</Link>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </nav>
      </footer>
    </>
  );
}
