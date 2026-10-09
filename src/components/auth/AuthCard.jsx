import { Link } from 'react-router-dom'
import Logo from '../Logo'

export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-1px)] max-w-md flex-col items-center justify-center px-4 py-14">
      <Link to="/" aria-label="Radiant home">
        <Logo size={34} />
      </Link>
      <div className="mt-7 w-full animate-fade-up rounded-2xl border border-ink-200 bg-white p-7 shadow-[var(--shadow-soft)] sm:p-8">
        <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-ink-500">{subtitle}</p>}
        <div className="mt-6">{children}</div>
      </div>
      {footer && <p className="mt-5 text-sm text-ink-500">{footer}</p>}
    </div>
  )
}
