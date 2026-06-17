const BUBBLES = [
  { side: 'left', y: 30, width: 130, delay: '0s' },
  { side: 'right', y: 90, width: 110, delay: '1.1s' },
  { side: 'left', y: 150, width: 150, delay: '2.2s' },
];

export default function ChatAnimation() {
  return (
    <svg className="feat-chat" viewBox="0 0 340 230" fill="none" aria-hidden="true">
      <rect className="feat-chat-frame" x="4" y="4" width="332" height="222" rx="18" />
      {BUBBLES.map((b, i) => (
        <g key={i} className={`feat-chat-bubble feat-chat-bubble-${b.side}`} style={{ animationDelay: b.delay }}>
          <rect
            x={b.side === 'left' ? 26 : 340 - 26 - b.width}
            y={b.y}
            width={b.width}
            height="34"
            rx="14"
          />
        </g>
      ))}
      <g className="feat-chat-typing" style={{ animationDelay: '3.3s' }}>
        <rect x="26" y="180" width="64" height="28" rx="14" />
        <circle className="feat-chat-dot" cx="44" cy="194" r="3" style={{ animationDelay: '0s' }} />
        <circle className="feat-chat-dot" cx="56" cy="194" r="3" style={{ animationDelay: '0.2s' }} />
        <circle className="feat-chat-dot" cx="68" cy="194" r="3" style={{ animationDelay: '0.4s' }} />
      </g>
    </svg>
  );
}
