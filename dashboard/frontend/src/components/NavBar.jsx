import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';
import '../styles/navbar.css';

const NAV_LINKS = [
  { to: '/status', label: 'Status' },
  { to: '/admin', label: 'Admin' },
];

export default function NavBar({ variant = 'app' }) {
  const isLanding = variant === 'landing';

  return (
    <nav className={`cpp-nav cpp-nav-${variant}`}>
      <NavLink to="/" className="cpp-nav-logo" end>
        <img className="cpp-nav-logo-mark" src="/styles/logo1.3.svg" alt="CPP Logo" />
        <span>CPP</span>
      </NavLink>

      <div className="cpp-nav-links">
        {isLanding ? (
          <NavLink to="/about" className={({ isActive }) => `cpp-nav-link${isActive ? ' is-active' : ''}`}>
            Über uns
          </NavLink>
        ) : (
          NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `cpp-nav-link${isActive ? ' is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))
        )}
      </div>

      <div className="cpp-nav-actions">
        {isLanding ? (
          <>
            <ThemeToggle className="cpp-nav-icon-btn" />
            <a className="cpp-nav-login-btn" href="/auth/">Login</a>
          </>
        ) : (
          <>
            <button className="cpp-nav-icon-btn" type="button" title="Chat (bald verfügbar)" aria-label="Chat" disabled>
              💬
            </button>
            <ThemeToggle className="cpp-nav-icon-btn" />
            <button className="cpp-nav-profile" type="button" title="Profil (bald verfügbar)" aria-label="Profil" disabled>
              <span className="cpp-nav-profile-avatar">?</span>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
