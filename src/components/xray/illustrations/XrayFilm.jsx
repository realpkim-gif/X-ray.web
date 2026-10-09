import { useId } from 'react'

/**
 * Shared "film" backdrop for the stylized X-ray illustrations used in demo
 * mode. These are original vector illustrations, not real medical images —
 * they exist so judges can see the product working without us needing
 * licensed radiographs. Swap `children` per body part.
 */
export default function XrayFilm({ children, viewBox = '0 0 400 400', className = '' }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg
      viewBox={viewBox}
      className={className}
      role="img"
      aria-label="Stylized illustrative X-ray image"
    >
      <defs>
        <radialGradient id={`vignette-${id}`} cx="50%" cy="42%" r="75%">
          <stop offset="0%" stopColor="#1b2430" />
          <stop offset="70%" stopColor="#0d1218" />
          <stop offset="100%" stopColor="#040608" />
        </radialGradient>
        <filter id={`glow-${id}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="0" y="0" width="100%" height="100%" fill={`url(#vignette-${id})`} />
      <g filter={`url(#glow-${id})`} stroke="#dce7f2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {children}
      </g>
    </svg>
  )
}
