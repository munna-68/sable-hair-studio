/**
 * StudioMap — a self-contained, dependency-free neighbourhood plate.
 *
 * Replaces the previous Google Maps embed, which depended on an API key that
 * is not present in this project and therefore rendered as a permanently
 * blank box. This version always draws, works offline, and matches the
 * Chromatic Cut palette: porcelain base, hairline-blue streets, cobalt mark.
 */

const STREETS = {
  horizontal: [
    { y: 96, label: "PINE ST", major: true },
    { y: 208, label: "PIKE ST" },
    { y: 322, label: "UNION ST" },
    { y: 436, label: "MADISON ST" },
  ],
  vertical: [
    { x: 118, label: "1ST AVE" },
    { x: 286, label: "2ND AVE", major: true },
    { x: 452, label: "3RD AVE" },
    { x: 616, label: "4TH AVE" },
  ],
};

const STUDIO = { x: 286, y: 96 };

export function StudioMap({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `studio-map ${className}` : "studio-map"}
      viewBox="0 0 760 520"
      role="img"
      aria-label="Map showing Sable Hair Studio at 118 Pine Street, Seattle, between 1st and 2nd Avenue."
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="map-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f6fb" />
          <stop offset="100%" stopColor="#e4ecf6" />
        </linearGradient>
        <filter id="marker-shadow" x="-60%" y="-60%" width="220%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#172133" floodOpacity="0.28" />
        </filter>
      </defs>

      <rect width="760" height="520" fill="url(#map-sheen)" />

      {/* City blocks */}
      <g fill="#dfe8f3" stroke="#d0dae7" strokeWidth="1">
        <rect x="20" y="20" width="86" height="64" />
        <rect x="130" y="20" width="140" height="64" />
        <rect x="298" y="20" width="138" height="64" />
        <rect x="464" y="20" width="136" height="64" />
        <rect x="628" y="20" width="112" height="64" />
        <rect x="20" y="108" width="86" height="88" />
        <rect x="130" y="108" width="140" height="88" />
        <rect x="298" y="108" width="138" height="88" />
        <rect x="464" y="108" width="136" height="88" />
        <rect x="628" y="108" width="112" height="88" />
        <rect x="20" y="220" width="86" height="90" />
        <rect x="130" y="220" width="140" height="90" />
        <rect x="298" y="220" width="138" height="90" />
        <rect x="628" y="220" width="112" height="90" />
        <rect x="20" y="334" width="86" height="90" />
        <rect x="130" y="334" width="140" height="90" />
        <rect x="298" y="334" width="138" height="90" />
        <rect x="464" y="334" width="136" height="90" />
        <rect x="628" y="334" width="112" height="90" />
        <rect x="20" y="448" width="86" height="56" />
        <rect x="130" y="448" width="140" height="56" />
        <rect x="298" y="448" width="138" height="56" />
        <rect x="464" y="448" width="136" height="56" />
        <rect x="628" y="448" width="112" height="56" />
      </g>

      {/* Green space — a small downtown park, drawn in the muted eucalyptus note */}
      <g>
        <rect x="464" y="220" width="136" height="90" fill="#d9ece4" stroke="#c2ddd1" strokeWidth="1" />
        <g fill="#b9d6c8">
          <circle cx="492" cy="252" r="11" />
          <circle cx="524" cy="278" r="14" />
          <circle cx="566" cy="248" r="9" />
          <circle cx="560" cy="288" r="12" />
        </g>
        <text x="532" y="305" textAnchor="middle" className="studio-map-park-label">
          WESTLAKE GREEN
        </text>
      </g>

      {/* Streets */}
      <g strokeLinecap="square">
        {STREETS.horizontal.map((street) => (
          <g key={street.label}>
            <line x1="0" y1={street.y} x2="760" y2={street.y} stroke="#cfd9e6" strokeWidth={street.major ? 22 : 16} />
            <line x1="0" y1={street.y} x2="760" y2={street.y} stroke="#ffffff" strokeWidth={street.major ? 18 : 12} />
          </g>
        ))}
        {STREETS.vertical.map((street) => (
          <g key={street.label}>
            <line x1={street.x} y1="0" x2={street.x} y2="520" stroke="#cfd9e6" strokeWidth={street.major ? 22 : 16} />
            <line x1={street.x} y1="0" x2={street.x} y2="520" stroke="#ffffff" strokeWidth={street.major ? 18 : 12} />
          </g>
        ))}
      </g>

      {/* Centre line on the two arterials */}
      <g stroke="#dbe4ef" strokeWidth="2" strokeDasharray="10 12">
        <line x1="286" y1="0" x2="286" y2="520" />
        <line x1="0" y1="96" x2="760" y2="96" />
      </g>

      {/* Street labels */}
      <g className="studio-map-street-labels">
        {STREETS.horizontal.map((street) => (
          <text key={street.label} x="18" y={street.y - 11}>
            {street.label}
          </text>
        ))}
        {STREETS.vertical.map((street) => (
          <text
            key={street.label}
            x={street.x - 11}
            y="502"
            transform={`rotate(-90 ${street.x - 11} 502)`}
          >
            {street.label}
          </text>
        ))}
      </g>

      {/* Walking route hint from Westlake light rail */}
      <path
        d="M 560 264 L 452 264 L 452 96 L 300 96"
        fill="none"
        stroke="#2a5bff"
        strokeWidth="2.5"
        strokeDasharray="7 7"
        opacity="0.55"
      />
      <text x="470" y="188" className="studio-map-route-label">
        6 min walk from Westlake
      </text>

      {/* The studio mark */}
      <g transform={`translate(${STUDIO.x} ${STUDIO.y})`}>
        <circle className="studio-map-pulse" r="17" fill="#2a5bff" opacity="0.18" />
        <circle r="15" fill="#2a5bff" filter="url(#marker-shadow)" />
        <circle r="6" fill="#ffffff" />
      </g>

      {/* Callout */}
      <g transform="translate(60 132)">
        <rect x="0" y="0" width="228" height="66" fill="#172133" />
        <rect x="0" y="0" width="4" height="66" fill="#2a5bff" />
        <text x="18" y="26" className="studio-map-callout-title">
          SABLE HAIR STUDIO
        </text>
        <text x="18" y="46" className="studio-map-callout-body">
          118 Pine Street · Seattle, WA
        </text>
        <text x="18" y="59" className="studio-map-callout-body">
          Between 1st and 2nd Avenue
        </text>
      </g>
      <line x1="288" y1="165" x2="286" y2="112" stroke="#172133" strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Compass + scale plate */}
      <g transform="translate(688 44)">
        <circle r="22" fill="#ffffff" stroke="#cfd9e6" strokeWidth="1" />
        <path d="M0 -13 L5 6 L0 2 L-5 6 Z" fill="#2a5bff" />
        <text x="0" y="-26" textAnchor="middle" className="studio-map-compass">
          N
        </text>
      </g>
      <g transform="translate(628 486)">
        <line x1="0" y1="0" x2="104" y2="0" stroke="#172133" strokeWidth="2" />
        <line x1="0" y1="-5" x2="0" y2="5" stroke="#172133" strokeWidth="2" />
        <line x1="104" y1="-5" x2="104" y2="5" stroke="#172133" strokeWidth="2" />
        <text x="52" y="-9" textAnchor="middle" className="studio-map-scale">
          200 m
        </text>
      </g>
    </svg>
  );
}
