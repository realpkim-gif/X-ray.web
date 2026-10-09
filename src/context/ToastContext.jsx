import { CheckCircle2, Info, TriangleAlert, X, XCircle } from 'lucide-react'
import { createContext, use, useCallback, useEffect, useState } from 'react'

const ToastContext = createContext(null)
const EXIT_DURATION = 180

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  warning: TriangleAlert,
  info: Info,
}

const ACCENTS = {
  success: 'text-green-600 bg-green-50 border-green-200',
  error: 'text-red-600 bg-red-50 border-red-200',
  warning: 'text-brand-600 bg-brand-50 border-brand-200',
  info: 'text-ink-600 bg-ink-50 border-ink-200',
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismiss = useCallback(
    (id) => {
      setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)))
      setTimeout(() => remove(id), EXIT_DURATION)
    },
    [remove],
  )

  const toast = useCallback(
    (message, { type = 'info', duration = 4000 } = {}) => {
      const id = Math.random().toString(36).slice(2)
      setToasts((prev) => [...prev, { id, message, type, leaving: false }])
      if (duration > 0) {
        setTimeout(() => dismiss(id), duration)
      }
      return id
    },
    [dismiss],
  )

  return (
    <ToastContext value={{ toast, dismiss }}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex flex-col items-center gap-2 px-4"
        aria-live="polite"
        aria-atomic="false"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext>
  )
}

function ToastItem({ toast: t, onDismiss }) {
  const [entered, setEntered] = useState(false)
  const Icon = ICONS[t.type] ?? Info

  useEffect(() => {
    const frame = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  const visible = entered && !t.leaving

  return (
    <div
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-2.5 rounded-xl border bg-white p-3.5 pr-2.5 shadow-[var(--shadow-lift)] transition-all duration-[180ms] ease-out ${ACCENTS[t.type]} ${
        visible ? 'translate-y-0 scale-100 opacity-100' : '-translate-y-2 scale-95 opacity-0'
      }`}
      role="status"
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium text-ink-800">{t.message}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="rounded-md p-1 text-ink-500 hover:bg-ink-100 hover:text-ink-700"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a ToastProvider')
  return ctx
}
