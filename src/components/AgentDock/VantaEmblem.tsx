export default function VantaEmblem({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="vanta-emblem select-none"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        {/* shadow */}
        <ellipse cx="50" cy="88" rx="22" ry="6" fill="black" opacity="0.25" />
        {/* body bob group */}
        <g className="vanta-bob">
          {/* dark eclipse body */}
          <circle cx="50" cy="52" r="38" fill="#131A24" stroke="#8B7CFF" strokeWidth="3" />
          {/* crescent cut — the eclipse */}
          <path
            d="M 50 14 A 38 38 0 1 0 50 90 A 30 30 0 1 1 50 14 Z"
            fill="#05060A"
            stroke="none"
          />
          {/* rim glow */}
          <circle cx="50" cy="52" r="38" fill="none" stroke="#8B7CFF" strokeWidth="1.5" opacity="0.4" />
          {/* eyes — calm and knowing */}
          <g className="vanta-eyes">
            <ellipse cx="38" cy="46" rx="4" ry="7" fill="#D9F99D" />
            <ellipse cx="62" cy="46" rx="4" ry="7" fill="#D9F99D" />
            <circle cx="39.5" cy="43.5" r="1.4" fill="#05060A" />
            <circle cx="63.5" cy="43.5" r="1.4" fill="#05060A" />
          </g>
          {/* subtle smile */}
          <path
            d="M 38 62 Q 50 70 62 62"
            fill="none"
            stroke="#D9F99D"
            strokeWidth="2.5"
            strokeLinecap="round"
            opacity="0.85"
          />
          {/* little hands waving */}
          <g className="vanta-hand">
            <ellipse cx="12" cy="54" rx="5" ry="7" fill="#131A24" stroke="#8B7CFF" strokeWidth="2" />
            <ellipse cx="88" cy="50" rx="5" ry="7" fill="#131A24" stroke="#8B7CFF" strokeWidth="2" />
          </g>
        </g>
      </svg>
      <style>{`
        .vanta-bob { animation: vantaBob 2s ease-in-out infinite; transform-origin: 50% 50%; }
        .vanta-hand { animation: vantaWave 1.6s ease-in-out infinite; transform-origin: 90px 50px; }
        @keyframes vantaBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes vantaWave { 0%,100% { transform: rotate(-6deg) } 50% { transform: rotate(10deg) } }
        @media (prefers-reduced-motion: reduce) { .vanta-bob, .vanta-hand { animation: none !important; } }
      `}</style>
    </div>
  );
}
