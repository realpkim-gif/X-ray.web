import { LayoutDashboard, LogOut, Menu, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Logo from '../Logo'
import Button from '../ui/Button'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/demo', label: 'Demo' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/about', label: 'About' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const closeMenu = () => setOpen(false)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <NavLink to="/" className="shrink-0" onClick={closeMenu} aria-label="Radiant home">
          <Logo size={32} />
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `group relative rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-brand-600' : 'text-ink-600 hover:text-ink-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <span
                    className={`pointer-events-none absolute inset-x-3 -bottom-0.5 h-0.5 origin-left rounded-full bg-brand-500 transition-transform duration-200 ease-out ${
                      isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <UserMenu user={user} onLogout={() => { logout(); navigate('/') }} />
          ) : (
            <Button to="/login" variant="ghost" size="sm">
              Log in
            </Button>
          )}
          <Button to="/analyze" size="sm">
            Analyze X-ray
          </Button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-700 transition-colors duration-150 hover:bg-ink-100 active:scale-90 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <nav
        className={`grid overflow-hidden border-t border-ink-200 bg-white transition-[grid-template-rows] duration-[220ms] ease-out md:hidden ${
          open ? 'grid-rows-[1fr] border-t-1' : 'grid-rows-[0fr] border-t-0'
        }`}
        aria-label="Primary"
        inert={!open}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-1 px-4 py-3">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
                    isActive ? 'bg-brand-50 text-brand-600' : 'text-ink-700 hover:bg-ink-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-ink-100 pt-3">
              {user ? (
                <>
                  <Button to="/dashboard" variant="secondary" size="sm" onClick={closeMenu}>
                    Dashboard
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      logout()
                      closeMenu()
                      navigate('/')
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Button to="/login" variant="secondary" size="sm" onClick={closeMenu}>
                  Log in
                </Button>
              )}
              <Button to="/analyze" size="sm" onClick={closeMenu}>
                Analyze X-ray
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

function UserMenu({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const menuRef = useRef(null)

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!open) return undefined
    // A click-outside listener (rather than a full-screen overlay) so a
    // click on another nav item both closes the menu AND still navigates —
    // an overlay would swallow that first click and require a second one.
    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-2 rounded-lg border border-ink-200 pl-1.5 pr-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:border-ink-300 hover:bg-ink-50"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-500 text-xs font-bold text-white">
          {user.name?.[0]?.toUpperCase() ?? 'U'}
        </span>
        {user.name}
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-20 mt-2 w-44 overflow-hidden rounded-xl border border-ink-200 bg-white py-1 shadow-[var(--shadow-lift)]"
        >
          <NavLink
            to="/dashboard"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
          >
            <LayoutDashboard className="h-4 w-4" /> Dashboard
          </NavLink>
          <NavLink
            to="/profile"
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-ink-700 hover:bg-ink-50"
          >
            <User className="h-4 w-4" /> Profile
          </NavLink>
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false)
              onLogout()
            }}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      )}
    </div>
  )
}
