/**
 * Radiant's mark: a stylized bone crossed by a dashed scan line with a
 * focus point, reading as "X-ray + AI detection" at a glance.
 */
export function LogoMark({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="#F2650F" />
      <line x1="13" y1="27" x2="27" y2="13" stroke="white" strokeWidth="4.5" strokeLinecap="round" />
      <circle cx="10.5" cy="24.5" r="3.4" fill="white" />
      <circle cx="15.5" cy="29.5" r="3.4" fill="white" />
      <circle cx="24.5" cy="10.5" r="3.4" fill="white" />
      <circle cx="29.5" cy="15.5" r="3.4" fill="white" />
      <line
        x1="8"
        y1="19.5"
        x2="32"
        y2="19.5"
        stroke="white"
        strokeWidth="1.4"
        strokeDasharray="1.5 2.4"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="20" cy="19.5" r="2.2" fill="#1A1714" stroke="white" strokeWidth="1.2" />
    </svg>
  )
}

export default function Logo({ size = 36, className = '', wordmarkClassName = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark size={size} />
      <span className={`font-display font-bold tracking-tight text-ink-900 ${wordmarkClassName}`} style={{ fontSize: size * 0.62 }}>
        Radiant
      </span>
    </span>
  )
}
