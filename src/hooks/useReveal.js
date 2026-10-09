import { animate, stagger as staggerFn } from 'animejs'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { prefersReducedMotion } from '../lib/motion'

const OBSERVER_OPTIONS = { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }

/**
 * Attach to a single element. It fades/slides in the first time it scrolls
 * into view, then leaves it alone. Respects prefers-reduced-motion.
 */
export function useReveal({ delay = 0, y = 16, duration = 600 } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    el.style.opacity = '0'
    el.style.transform = `translateY(${y}px)`
  }, [y])

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined

    let animation
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animation = animate(el, {
          opacity: [0, 1],
          translateY: [y, 0],
          duration,
          delay,
          ease: 'outExpo',
        })
        observer.unobserve(el)
      }
    }, OBSERVER_OPTIONS)
    observer.observe(el)

    return () => {
      observer.disconnect()
      animation?.revert()
    }
  }, [delay, duration, y])

  return ref
}

/**
 * Attach to a container. Its direct children fade/slide in with a stagger
 * the first time the container scrolls into view.
 */
export function useRevealGroup({ staggerMs = 80, y = 16, duration = 600 } = {}) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return
    Array.from(el.children).forEach((child) => {
      child.style.opacity = '0'
      child.style.transform = `translateY(${y}px)`
    })
  }, [y])

  useEffect(() => {
    const el = ref.current
    if (!el || prefersReducedMotion()) return undefined

    let animation
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        animation = animate(el.children, {
          opacity: [0, 1],
          translateY: [y, 0],
          duration,
          delay: staggerFn(staggerMs),
          ease: 'outExpo',
        })
        observer.unobserve(el)
      }
    }, OBSERVER_OPTIONS)
    observer.observe(el)

    return () => {
      observer.disconnect()
      animation?.revert()
    }
  }, [staggerMs, duration, y])

  return ref
}
