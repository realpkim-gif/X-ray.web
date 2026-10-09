import { CircleCheck, Send } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import AuthCard from '../components/auth/AuthCard'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    setError('')
    setSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSubmitting(false)
    setSent(true)
  }

  return (
    <AuthCard
      title="Reset your password"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <>
          Remembered it?{' '}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600">
            <CircleCheck className="h-6 w-6" />
          </span>
          <p className="font-semibold text-ink-900">Check your email</p>
          <p className="max-w-xs text-sm text-ink-500">
            In this demo, no email is actually sent — in the finished product, a reset link
            would arrive at <span className="font-medium text-ink-700">{email}</span>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormField
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
          />
          <Button type="submit" size="lg" className="mt-2" disabled={submitting} icon={<Send className="h-4 w-4" />}>
            {submitting ? 'Sending…' : 'Send reset link'}
          </Button>
        </form>
      )}
    </AuthCard>
  )
}
