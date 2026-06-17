import { useState } from 'react';

export default function ThemeToggle({ className, lightIcon = '🌙', darkIcon = '☀️' }) {
  const [isDark, setIsDark] = useState(document.documentElement.getAttribute('data-theme') === 'dark');

  function toggle() {
    const next = !isDark;
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
    setIsDark(next);
  }

  return (
    <button className={className} type="button" aria-label="Theme umschalten" onClick={toggle}>
      <span className="theme-toggle-icon">{isDark ? darkIcon : lightIcon}</span>
    </button>
  );
}
