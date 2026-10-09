import { animate } from 'animejs'
import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const MAX_TILT_DEG = 6

function isCoarsePointer() {
  return typeof window !== 'undefined' && window.matchMedia?.('(pointer: coarse)').matches === true
}

/**
 * Subtle cursor-based 3D tilt for a "product preview" panel. Disabled on
 * touch devices and when the user prefers reduced motion. The element needs
 * an ancestor with a CSS `perspective` for the rotation to read as depth
 * rather than a flat skew.
 */
export function useTilt() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    const zone = el?.parentElement
    if (!el || !zone || prefersReducedMotion() || isCoarsePointer()) return undefined

    let frame = null

    const onMove = (e) => {
      const rect = zone.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width - 0.5
      const py = (e.clientY - rect.top) / rect.height - 0.5
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        animate(el, {
          rotateY: px * MAX_TILT_DEG * 2,
          rotateX: py * -MAX_TILT_DEG * 2,
          duration: 400,
          ease: 'outQuad',
        })
      })
    }

    const onLeave = () => {
      if (frame) cancelAnimationFrame(frame)
      animate(el, { rotateX: 0, rotateY: 0, duration: 600, ease: 'outExpo' })
    }

    zone.addEventListener('mousemove', onMove)
    zone.addEventListener('mouseleave', onLeave)
    return () => {
      zone.removeEventListener('mousemove', onMove)
      zone.removeEventListener('mouseleave', onLeave)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return ref
}
