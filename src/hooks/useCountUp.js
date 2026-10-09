import { animate } from 'animejs'
import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const defaultFormat = (v) => Math.round(v).toString()

/**
 * Attach to a <span>/<p>; animates its text content counting up to `value`.
 * `format` doesn't need to be stable across renders — the latest one is
 * always used, without retriggering the animation.
 */
export function useCountUp(value, { duration = 900, delay = 0, format } = {}) {
  const ref = useRef(null)
  const formatRef = useRef(format || defaultFormat)

  useEffect(() => {
    formatRef.current = format || defaultFormat
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined

    if (prefersReducedMotion()) {
      el.textContent = formatRef.current(value)
      return undefined
    }

    const counter = { value: 0 }
    const animation = animate(counter, {
      value,
      duration,
      delay,
      ease: 'outExpo',
      onUpdate: () => {
        el.textContent = formatRef.current(counter.value)
      },
    })

    return () => animation.revert()
  }, [value, duration, delay])

  return ref
}
