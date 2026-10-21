export default function VantaEmblem({ size = 56 }: { size?: number }) {
  return (
    <div
      aria-hidden="true"
      className="vanta-emblem select-none"
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} className="overflow-visible">
        {/* ground shadow */}
        <ellipse cx="50" cy="90" rx="20" ry="5" fill="black" opacity="0.35" />
        <g className="vanta-bob">
          {/* corona halo */}
          <circle cx="50" cy="50" r="34" fill="none" stroke="#8B7CFF" strokeWidth="1.5" opacity="0.35" className="vanta-corona" />
          <circle cx="50" cy="50" r="34" fill="none" stroke="#D9F99D" strokeWidth="0.8" opacity="0.25" className="vanta-corona-delay" />
          {/* dark body — the black disc */}
          <circle cx="50" cy="50" r="26" fill="#05060A" stroke="#283047" strokeWidth="1.5" />
          {/* rim light — crescent edge */}
          <path d="M 50 24 A 26 26 0 0 1 76 50 A 20 26 0 0 0 50 24 Z" fill="#8B7CFF" opacity="0.9" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="url(#vanta-rim)" strokeWidth="2" />
          {/* eye glints — two thin crescent eyes */}
          <g className="vanta-eyes">
            <path d="M 36 44 Q 40 40 44 44 Q 40 46 36 44 Z" fill="#D9F99D" />
            <path d="M 56 44 Q 60 40 64 44 Q 60 46 56 44 Z" fill="#D9F99D" />
          </g>
          <defs>
            <linearGradient id="vanta-rim" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#8B7CFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#283047" stopOpacity="0.2" />
            </linearGradient>
          </defs>
        </g>
      </svg>
      <style>{`
        .vanta-bob { animation: vantaBob 3s ease-in-out infinite; transform-origin: 50% 50%; }
        .vanta-corona { animation: coronaPulse 5s ease-in-out infinite; transform-origin: 50px 50px; }
        .vanta-corona-delay { animation: coronaPulse 5s ease-in-out 1.2s infinite; transform-origin: 50px 50px; }
        .vanta-eyes { animation: vantaBlink 4.5s ease-in-out infinite; transform-origin: 50px 44px; }
        @keyframes vantaBob { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-4px) } }
        @keyframes vantaBlink { 0%,92%,100% { transform: scaleY(1) } 96% { transform: scaleY(0.1) } }
        @media (prefers-reduced-motion: reduce) {
          .vanta-bob, .vanta-corona, .vanta-corona-delay, .vanta-eyes { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
