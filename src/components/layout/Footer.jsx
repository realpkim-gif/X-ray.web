import { Link } from 'react-router-dom'
import Logo from '../Logo'
import Disclaimer from '../ui/Disclaimer'

export default function Footer() {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
          <div className="max-w-sm">
            <Logo size={28} />
            <p className="mt-3 text-sm text-ink-500">
              A student-built AI-assisted X-ray research prototype, created for the Congressional
              App Challenge.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <FooterColumn
              title="Product"
              links={[
                { to: '/analyze', label: 'Analyze' },
                { to: '/demo', label: 'Try a Demo' },
                { to: '/how-it-works', label: 'How It Works' },
              ]}
            />
            <FooterColumn
              title="Project"
              links={[
                { to: '/about', label: 'About' },
                { to: '/login', label: 'Log in' },
                { to: '/signup', label: 'Sign up' },
              ]}
            />
          </div>
        </div>

        <div className="mt-10 border-t border-ink-100 pt-6">
          <Disclaimer compact />
          <div className="mt-4 text-xs text-ink-500">
            <p>&copy; {new Date().getFullYear()} Radiant. Built by two students for the Congressional App Challenge.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-900">{title}</p>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className="text-sm text-ink-600 underline decoration-transparent underline-offset-4 transition-colors duration-150 hover:text-brand-600 hover:decoration-brand-300"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
