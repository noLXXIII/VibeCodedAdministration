import { useEffect, useRef } from 'react';

export default function FeatureSection({ eyebrow, title, text, bullets = [], animation, reverse = false }) {
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
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className={`feat-row reveal${reverse ? ' feat-row-reverse' : ''}`}>
      <div className="feat-row-text">
        <span className="feat-eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
        <p>{text}</p>
        {bullets.length > 0 && (
          <ul className="feat-bullets">
            {bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="feat-row-animation">{animation}</div>
    </section>
  );
}
