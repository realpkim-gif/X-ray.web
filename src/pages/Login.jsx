import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!email.includes('@')) nextErrors.email = 'Enter a valid email address.'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await login({ email })
    setSubmitting(false)
    toast('Welcome back!', { type: 'success' })
    navigate(location.state?.from ?? '/dashboard')
  }

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to view your dashboard and recent analyses."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="font-semibold text-brand-600 hover:text-brand-700">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <div>
          <FormField
            label="Password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <Link to="/forgot-password" className="mt-1.5 inline-block text-xs font-medium text-brand-600 hover:text-brand-700">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="mt-2" disabled={submitting} icon={<LogIn className="h-4 w-4" />}>
          {submitting ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
      <p className="mt-5 rounded-lg bg-ink-50 px-3 py-2.5 text-xs text-ink-500">
        Demo mode: this creates a local session only — no real account or password is
        created or stored.
      </p>
    </AuthCard>
  )
}
