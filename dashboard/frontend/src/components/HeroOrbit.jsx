const ICONS = {
  lock: (
    <path d="M-3.5,-0.5 V-3 a3.5,3.5 0 0 1 7,0 v2.5 M-4.5,-0.5 h9 v6 h-9 z" />
  ),
  chat: (
    <path d="M-4.5,-3.5 h9 v5.5 h-5 l-2.2,2.2 v-2.2 h-1.8 z" />
  ),
  folder: (
    <path d="M-4.5,-2.5 h3.2 l1,1.2 h4.8 v4.8 h-9 z" />
  ),
  calendar: (
    <path d="M-4.5,-3 h9 v7.5 h-9 z M-4.5,-0.8 h9 M-2.2,-4 v2 M2.2,-4 v2" />
  ),
  users: (
    <path d="M-3,-1 a2,2 0 1 0 0.01,0 M-5,4 c0,-2.4 1.6,-3.4 3,-3.4 s3,1 3,3.4 M2.6,-1.6 a1.6,1.6 0 1 0 0.01,0 M0.6,3.6 c0.2,-1.8 1.4,-2.6 2.4,-2.6 s2.1,0.7 2.4,2.4" />
  ),
};

const NODES = [
  { label: 'Auth', icon: 'lock', x: 60, y: 60, delay: '0s' },
  { label: 'Chat', icon: 'chat', x: 340, y: 50, delay: '0.4s' },
  { label: 'Dateien', icon: 'folder', x: 380, y: 200, delay: '0.8s' },
  { label: 'Planung', icon: 'calendar', x: 220, y: 230, delay: '1.2s' },
  { label: 'Users', icon: 'users', x: 40, y: 190, delay: '1.6s' },
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
          <circle className="lp-orbit-node-dot" cx={n.x} cy={n.y} r="11" />
          <g className="lp-orbit-icon" transform={`translate(${n.x}, ${n.y})`} strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {ICONS[n.icon]}
          </g>
          <text className="lp-orbit-label" x={n.x} y={n.y - 20} textAnchor="middle">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
