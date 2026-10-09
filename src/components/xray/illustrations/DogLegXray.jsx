import XrayFilm from './XrayFilm'

export default function DogLegXray({ className = '' }) {
  return (
    <XrayFilm className={className} viewBox="0 0 400 420">
      {/* hip joint */}
      <circle cx="196" cy="46" r="22" strokeWidth="5" opacity="0.85" />
      {/* femur */}
      <path d="M188 62 C182 120, 182 160, 192 196" strokeWidth="16" opacity="0.85" />
      {/* knee joint */}
      <circle cx="194" cy="204" r="16" strokeWidth="4.5" opacity="0.8" />
      {/* tibia + fibula */}
      <path d="M186 216 C178 260, 176 300, 182 336" strokeWidth="11" opacity="0.85" />
      <path d="M204 216 C210 258, 210 296, 202 332" strokeWidth="7" opacity="0.7" />
      {/* hock joint */}
      <circle cx="190" cy="344" r="13" strokeWidth="4" opacity="0.8" />
      {/* metatarsals + toes */}
      {[
        { x: 168, rot: -12 },
        { x: 182, rot: -4 },
        { x: 198, rot: 4 },
        { x: 212, rot: 12 },
      ].map((t, i) => (
        <g key={i} transform={`rotate(${t.rot} ${t.x} 358)`}>
          <path d={`M${t.x} 358 L${t.x} 392`} strokeWidth="5.5" />
          <path d={`M${t.x} 392 L${t.x} 410`} strokeWidth="4" opacity="0.85" />
        </g>
      ))}
    </XrayFilm>
  )
}
