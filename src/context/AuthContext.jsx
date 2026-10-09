import { createContext, use, useCallback, useMemo, useState } from 'react'

const AuthContext = createContext(null)

const SESSION_KEY = 'radiant.demoSession'

/**
 * Mock, frontend-only authentication. There is no real backend yet, so this
 * only ever stores a display name/email in localStorage — never a password.
 * When real auth is wired up, replace `login`/`signup` with real API calls
 * and keep the same `user` shape so the rest of the app doesn't change.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  const persist = useCallback((nextUser) => {
    setUser(nextUser)
    try {
      if (nextUser) localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
      else localStorage.removeItem(SESSION_KEY)
    } catch {
      // localStorage unavailable (private browsing, etc) — session just won't persist
    }
  }, [])

  const login = useCallback(
    async ({ name, email }) => {
      await wait(500)
      persist({ name: name || email.split('@')[0], email })
    },
    [persist],
  )

  const signup = useCallback(
    async ({ name, email }) => {
      await wait(500)
      persist({ name, email })
    },
    [persist],
  )

  const logout = useCallback(() => persist(null), [persist])

  const value = useMemo(() => ({ user, login, signup, logout }), [user, login, signup, logout])

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const ctx = use(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
