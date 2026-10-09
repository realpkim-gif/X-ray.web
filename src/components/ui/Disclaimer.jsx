import { ShieldAlert } from 'lucide-react'

export const DISCLAIMER_TEXT =
  'This tool is an AI-assisted research prototype and is not intended to diagnose medical conditions or replace evaluation by a qualified medical professional.'

/**
 * The one disclaimer string used everywhere in the app. Keeping it in one
 * component means the wording can never drift between pages.
 */
export default function Disclaimer({ compact = false, className = '' }) {
  if (compact) {
    return (
      <p className={`flex items-start gap-2 text-xs text-ink-500 ${className}`}>
        <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
        <span>{DISCLAIMER_TEXT}</span>
      </p>
    )
  }

  return (
    <div
      role="note"
      className={`flex items-start gap-3 rounded-2xl border border-brand-200 bg-brand-50 p-4 text-sm text-ink-700 ${className}`}
    >
      <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
      <p>
        <span className="font-semibold text-ink-900">Not a medical diagnosis. </span>
        {DISCLAIMER_TEXT}
      </p>
    </div>
  )
}
