import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

/**
 * Subtle scroll parallax: the element drifts a few pixels relative to its
 * own scroll position, independent of surrounding content. GPU-friendly
 * (transform only, rAF-throttled). Disabled when reduced motion is on.
 */
export function useParallax({ strength = 0.06 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined

    let ticking = false
    const update = () => {
      ticking = false
      const rect = el.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elCenter = rect.top + rect.height / 2
      const offset = (elCenter - viewportCenter) * strength
      el.style.transform = `translateY(${offset}px)`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      el.style.transform = ''
    }
  }, [strength])

  return ref
}
