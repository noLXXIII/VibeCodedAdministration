const COLUMNS = [
  { x: 14, label: 'To-do' },
  { x: 124, label: 'Doing' },
  { x: 234, label: 'Done' },
];

export default function PlanningAnimation() {
  return (
    <svg className="feat-plan" viewBox="0 0 340 230" fill="none" aria-hidden="true">
      {COLUMNS.map((c) => (
        <g key={c.label}>
          <rect className="feat-plan-col" x={c.x} y="10" width="100" height="200" rx="10" />
          <text className="feat-plan-col-label" x={c.x + 50} y="28" textAnchor="middle">
            {c.label}
          </text>
        </g>
      ))}

      <rect className="feat-plan-card feat-plan-card-static" x="26" y="46" width="76" height="30" rx="6" />
      <rect className="feat-plan-card feat-plan-card-static" x="246" y="46" width="76" height="30" rx="6" />

      <g className="feat-plan-card feat-plan-card-moving">
        <rect x="26" y="46" width="76" height="30" rx="6" />
        <path className="feat-plan-check" d="M38,61 l6,6 l14,-14" />
        <animateMotion
          path="M0,0 H110 H220"
          keyPoints="0;0.5;1"
          keyTimes="0;0.5;1"
          dur="4s"
          repeatCount="indefinite"
          calcMode="linear"
        />
      </g>
    </svg>
  );
}
