import { Eye, EyeOff } from 'lucide-react'
import { useId, useState } from 'react'

export default function FormField({ label, type = 'text', error, className = '', ...props }) {
  const id = useId()
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink-700">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`h-11 w-full rounded-xl border bg-white px-3.5 text-base text-ink-900 placeholder:text-ink-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 disabled:cursor-not-allowed disabled:bg-ink-50 disabled:text-ink-400 sm:text-sm ${
            isPassword ? 'pr-11' : ''
          } ${error ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-ink-200'}`}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-ink-500 hover:text-ink-700"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
