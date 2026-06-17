const NODES = [
  { label: 'Auth', x: 60, y: 60, delay: '0s' },
  { label: 'Chat', x: 340, y: 50, delay: '0.4s' },
  { label: 'Dateien', x: 380, y: 200, delay: '0.8s' },
  { label: 'Planung', x: 220, y: 230, delay: '1.2s' },
  { label: 'Users', x: 40, y: 190, delay: '1.6s' },
];
const CENTER = { x: 210, y: 130 };

export default function HeroOrbit() {
  return (
    <svg className="lp-orbit" viewBox="0 0 420 260" fill="none" aria-hidden="true">
      {NODES.map((n) => (
        <line
          key={`line-${n.label}`}
          className="lp-orbit-line"
          x1={CENTER.x}
          y1={CENTER.y}
          x2={n.x}
          y2={n.y}
          style={{ animationDelay: n.delay }}
        />
      ))}
      <circle className="lp-orbit-core" cx={CENTER.x} cy={CENTER.y} r="14" />
      <circle className="lp-orbit-core-ring" cx={CENTER.x} cy={CENTER.y} r="14" />
      {NODES.map((n) => (
        <g key={n.label} className="lp-orbit-node" style={{ animationDelay: n.delay }}>
          <circle className="lp-orbit-node-pulse" cx={n.x} cy={n.y} r="9" />
          <circle className="lp-orbit-node-dot" cx={n.x} cy={n.y} r="6" />
          <text className="lp-orbit-label" x={n.x} y={n.y - 16} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
