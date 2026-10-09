import { Home } from 'lucide-react'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <p className="font-display text-5xl font-bold text-brand-500">404</p>
      <h1 className="mt-3 text-lg font-semibold text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Button to="/" className="mt-6" icon={<Home className="h-4 w-4" />}>
        Back to home
      </Button>
    </div>
  )
}
