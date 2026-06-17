const EXISTING_NODES = [
  { x: 60, y: 50 },
  { x: 60, y: 170 },
  { x: 170, y: 190 },
];
const CENTER = { x: 170, y: 110 };
const NEW_NODE = { x: 280, y: 60 };

export default function ModuleAddAnimation() {
  return (
    <svg className="feat-module" viewBox="0 0 340 230" fill="none" aria-hidden="true">
      {EXISTING_NODES.map((n, i) => (
        <line key={i} className="feat-module-line" x1={CENTER.x} y1={CENTER.y} x2={n.x} y2={n.y} />
      ))}
      <line className="feat-module-line feat-module-line-new" x1={CENTER.x} y1={CENTER.y} x2={NEW_NODE.x} y2={NEW_NODE.y} />

      <circle className="feat-module-core" cx={CENTER.x} cy={CENTER.y} r="13" />

      {EXISTING_NODES.map((n, i) => (
        <circle key={i} className="feat-module-node" cx={n.x} cy={n.y} r="9" />
      ))}

      <g className="feat-module-new-node">
        <circle className="feat-module-node-pulse" cx={NEW_NODE.x} cy={NEW_NODE.y} r="9" />
        <circle className="feat-module-node feat-module-node-new" cx={NEW_NODE.x} cy={NEW_NODE.y} r="9" />
        <path className="feat-module-plus" d={`M${NEW_NODE.x - 4},${NEW_NODE.y} h8 M${NEW_NODE.x},${NEW_NODE.y - 4} v8`} />
      </g>
    </svg>
  );
}
