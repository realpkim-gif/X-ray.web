import { CircleAlert, CircleCheck, ImagePlus, PawPrint, Settings, Upload, User } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { useCountUp } from '../hooks/useCountUp'
import { useRevealGroup } from '../hooks/useReveal'
import { DASHBOARD_STATS, RECENT_ANALYSES } from '../lib/mockDashboard'

export default function Dashboard() {
  const { user } = useAuth()
  const statsRef = useRevealGroup({ staggerMs: 80, duration: 450 })

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink-900">Welcome, {user.name}</h1>
        <p className="text-ink-600">Here's what's been happening with your analyses.</p>
      </div>

      <div ref={statsRef} className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {DASHBOARD_STATS.map((stat) => (
          <StatCard key={stat.label} label={stat.label} value={stat.value} />
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-xl border border-ink-200 bg-white p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-ink-900">Recent analyses</h2>
            <Button to="/analyze" size="sm" variant="ghost" icon={<Upload className="h-3.5 w-3.5" />}>
              New
            </Button>
          </div>

          {RECENT_ANALYSES.length === 0 ? (
            <EmptyState />
          ) : (
            <ul className="mt-4 flex flex-col divide-y divide-ink-100">
              {RECENT_ANALYSES.map((item) => (
                <li key={item.id} className="flex items-center gap-3 py-3.5">
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      item.hasFinding ? 'bg-brand-50 text-brand-600' : 'bg-green-50 text-green-600'
                    }`}
                  >
                    {item.hasFinding ? <CircleAlert className="h-4 w-4" /> : <CircleCheck className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink-900">{item.title}</p>
                    <p className="text-xs text-ink-500">{item.date}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold tabular-nums text-ink-600">
                    {Math.round(item.confidence * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-ink-200 bg-white p-5">
            <h2 className="font-semibold text-ink-900">Quick actions</h2>
            <div className="mt-3 flex flex-col gap-2">
              <Button to="/analyze" variant="secondary" icon={<ImagePlus className="h-4 w-4" />} className="justify-start">
                Upload new X-ray
              </Button>
              <Button to="/demo" variant="secondary" icon={<Upload className="h-4 w-4" />} className="justify-start">
                Demo cases
              </Button>
              <Button to="/demo/dog" variant="secondary" icon={<PawPrint className="h-4 w-4" />} className="justify-start">
                Veterinary demo
              </Button>
              <Button to="/profile" variant="secondary" icon={<User className="h-4 w-4" />} className="justify-start">
                Profile
              </Button>
              <Button variant="secondary" icon={<Settings className="h-4 w-4" />} className="justify-start" disabled>
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value }) {
  const ref = useCountUp(value, { duration: 800 })
  return (
    <div className="rounded-xl border border-ink-200 bg-white p-5">
      <p ref={ref} className="font-display text-3xl font-bold text-ink-900">
        0
      </p>
      <p className="mt-1 text-sm text-ink-500">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 rounded-xl border border-dashed border-ink-200 py-10 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-ink-100 text-ink-500">
        <ImagePlus className="h-5 w-5" />
      </span>
      <p className="text-sm font-medium text-ink-600">No analyses yet</p>
      <Button to="/analyze" size="sm">
        Upload your first X-ray
      </Button>
    </div>
  )
}
