import { UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const { signup } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (name.trim().length < 2) nextErrors.name = 'Enter your name.'
    if (!email.includes('@')) nextErrors.email = 'Enter a valid email address.'
    if (password.length < 6) nextErrors.password = 'Password must be at least 6 characters.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setSubmitting(true)
    await signup({ name: name.trim(), email })
    setSubmitting(false)
    toast('Account created — welcome to Radiant!', { type: 'success' })
    navigate('/dashboard')
  }

  return (
    <AuthCard
      title="Create your account"
      subtitle="Set up a demo account to save your analyses."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FormField
          label="Name"
          autoComplete="name"
          placeholder="Ada Lovelace"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
        <FormField
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <FormField
          label="Password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <Button type="submit" size="lg" className="mt-2" disabled={submitting} icon={<UserPlus className="h-4 w-4" />}>
          {submitting ? 'Creating account…' : 'Sign up'}
        </Button>
      </form>
      <p className="mt-5 rounded-lg bg-ink-50 px-3 py-2.5 text-xs text-ink-500">
        Demo mode: this creates a local session only — no real account or password is
        created or stored.
      </p>
    </AuthCard>
  )
}
