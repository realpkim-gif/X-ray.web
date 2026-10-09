import { LogOut, Save } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import FormField from '../components/ui/FormField'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Profile() {
  const { user, logout } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [name, setName] = useState(user.name)
  const [saving, setSaving] = useState(false)

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSaving(false)
    toast('Profile updated.', { type: 'success' })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500 text-lg font-bold text-white">
          {user.name?.[0]?.toUpperCase() ?? 'U'}
        </span>
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">{user.name}</h1>
          <p className="text-sm text-ink-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="mt-8 flex flex-col gap-4 rounded-xl border border-ink-200 bg-white p-6">
        <h2 className="font-semibold text-ink-900">Account details</h2>
        <FormField label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
        <FormField label="Email" type="email" value={user.email} disabled />
        <div>
          <Button type="submit" disabled={saving} icon={<Save className="h-4 w-4" />}>
            {saving ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>

      <div className="mt-6 rounded-xl border border-ink-200 bg-white p-6">
        <h2 className="font-semibold text-ink-900">Session</h2>
        <p className="mt-1 text-sm text-ink-500">
          You're using a demo account. Logging out clears this local session.
        </p>
        <Button
          variant="dangerGhost"
          className="mt-3"
          icon={<LogOut className="h-4 w-4" />}
          onClick={() => {
            logout()
            navigate('/')
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
