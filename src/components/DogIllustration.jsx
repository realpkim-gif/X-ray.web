/**
 * A lightweight, "3D-looking" illustrated dog mascot for the veterinary demo
 * teaser. Built from soft gradient shapes rather than a real 3D model — a
 * simpler, faster, and more reliable approach for a one-month timeline.
 */
export default function DogIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 320 300" className={className} role="img" aria-label="Illustration of a friendly cartoon dog">
      <defs>
        <linearGradient id="dogBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFA05C" />
          <stop offset="100%" stopColor="#F2650F" />
        </linearGradient>
        <linearGradient id="dogEar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D9500A" />
          <stop offset="100%" stopColor="#B43F0A" />
        </linearGradient>
        <radialGradient id="dogShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1A1714" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#1A1714" stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="160" cy="272" rx="105" ry="16" fill="url(#dogShadow)" />

      {/* tail */}
      <path d="M248 190 C280 178, 292 148, 278 122" stroke="url(#dogBody)" strokeWidth="22" strokeLinecap="round" fill="none" />

      {/* back legs */}
      <rect x="98" y="210" width="26" height="58" rx="13" fill="#D9500A" />
      <rect x="196" y="210" width="26" height="58" rx="13" fill="#D9500A" />

      {/* body */}
      <ellipse cx="160" cy="196" rx="92" ry="62" fill="url(#dogBody)" />
      {/* belly patch */}
      <ellipse cx="160" cy="222" rx="52" ry="30" fill="#FFF4EC" />

      {/* front legs */}
      <rect x="112" y="222" width="24" height="52" rx="12" fill="url(#dogBody)" />
      <rect x="186" y="222" width="24" height="52" rx="12" fill="url(#dogBody)" />
      <rect x="112" y="260" width="24" height="14" rx="7" fill="#FFF4EC" />
      <rect x="186" y="260" width="24" height="14" rx="7" fill="#FFF4EC" />

      {/* head */}
      <g>
        <ellipse cx="112" cy="118" rx="15" ry="26" fill="url(#dogEar)" transform="rotate(-24 112 118)" />
        <ellipse cx="66" cy="130" rx="15" ry="26" fill="url(#dogEar)" transform="rotate(24 66 130)" />
        <circle cx="90" cy="130" r="54" fill="url(#dogBody)" />
        {/* snout */}
        <ellipse cx="72" cy="150" rx="26" ry="20" fill="#FFF4EC" />
        <ellipse cx="60" cy="148" rx="6.5" ry="5" fill="#1A1714" />
        {/* eyes */}
        <circle cx="78" cy="118" r="5.5" fill="#1A1714" />
        <circle cx="106" cy="116" r="5.5" fill="#1A1714" />
        <circle cx="76.5" cy="116" r="1.6" fill="white" />
        <circle cx="104.5" cy="114" r="1.6" fill="white" />
        {/* mouth */}
        <path d="M62 160 Q72 168 82 160" stroke="#1A1714" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  )
}
