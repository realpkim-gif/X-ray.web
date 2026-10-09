import { forwardRef } from 'react'
import { Link } from 'react-router-dom'

const variants = {
  primary:
    'bg-brand-500 text-white shadow-[var(--shadow-soft)] hover:bg-brand-600 hover:shadow-[var(--shadow-lift)] hover:-translate-y-px active:translate-y-0 active:bg-brand-700 active:shadow-[var(--shadow-soft)] disabled:bg-ink-200 disabled:text-ink-400 disabled:shadow-none disabled:translate-y-0',
  secondary:
    'bg-white text-ink-800 border border-ink-200 hover:border-ink-300 hover:bg-ink-50 hover:-translate-y-px hover:shadow-[var(--shadow-soft)] active:translate-y-0 active:bg-ink-100 disabled:text-ink-300 disabled:translate-y-0',
  ghost:
    'bg-transparent text-ink-700 hover:bg-ink-100 active:bg-ink-200 disabled:text-ink-300',
  dangerGhost:
    'bg-transparent text-red-600 hover:bg-red-50 active:bg-red-100',
}

const sizes = {
  sm: 'h-9 px-3.5 text-sm gap-1.5 rounded-lg',
  md: 'h-11 px-5 text-sm gap-2 rounded-xl',
  lg: 'h-[52px] px-7 text-base gap-2.5 rounded-xl',
}

/**
 * Shared button. Renders a <Link> when `to` is passed, an <a> when `href` is
 * passed, otherwise a <button>. Keeps every CTA in the app visually and
 * behaviorally consistent, including hover/press/focus/disabled states.
 */
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', to, href, className = '', children, icon, ...props },
  ref,
) {
  const classes = `group/btn inline-flex items-center justify-center font-semibold transition-all duration-150 ease-out whitespace-nowrap select-none disabled:cursor-not-allowed disabled:pointer-events-none disabled:hover:translate-y-0 active:scale-[0.98] ${sizes[size]} ${variants[variant]} ${className}`

  const content = (
    <>
      {icon && (
        <span className="inline-flex shrink-0 transition-transform duration-150 ease-out group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
      {children}
    </>
  )

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} {...props}>
        {content}
      </Link>
    )
  }
  if (href) {
    return (
      <a ref={ref} href={href} className={classes} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} className={classes} {...props}>
      {content}
    </button>
  )
})

export default Button
