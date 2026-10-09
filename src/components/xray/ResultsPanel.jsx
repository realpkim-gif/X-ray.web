import { CircleAlert, CircleCheck } from 'lucide-react'
import { useCountUp } from '../../hooks/useCountUp'
import { useRevealGroup } from '../../hooks/useReveal'
import Disclaimer from '../ui/Disclaimer'

/**
 * The results dashboard for a completed analysis. Consumes the
 * `AnalysisResult` shape produced by lib/xrayService.js.
 */
export default function ResultsPanel({ result }) {
  const { hasFinding, finding, confidence, explanation } = result
  const confidencePct = Math.round(confidence * 100)
  const confidenceRef = useCountUp(confidencePct, { duration: 900, format: (v) => `${Math.round(v)}%` })
  const listRef = useRevealGroup({ staggerMs: 70, y: 10, duration: 400 })

  return (
    <div ref={listRef} className="flex flex-col gap-3">
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          hasFinding ? 'border-brand-200 bg-brand-50' : 'border-green-200 bg-green-50'
        }`}
      >
        {hasFinding ? (
          <CircleAlert className="mt-0.5 h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
        ) : (
          <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
        )}
        <div>
          <p className="text-xs text-ink-500">Analysis summary</p>
          <p className="mt-0.5 font-semibold text-ink-900">{finding}</p>
        </div>
      </div>

      <div className="rounded-xl border border-ink-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-ink-600">Model confidence</p>
          <p ref={confidenceRef} className="text-sm font-semibold text-ink-900">
            0%
          </p>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-100">
          <div
            className="h-full rounded-full bg-brand-500 transition-all duration-700 ease-out"
            style={{ width: `${confidencePct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-ink-500">
          Confidence is a model output, not a measure of medical certainty.
        </p>
      </div>

      {hasFinding && (
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <p className="text-sm font-semibold text-ink-900">Area for additional review</p>
          <p className="mt-1 text-sm text-ink-600">
            Highlighted directly on the image in the viewer, marked in orange.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-ink-200 bg-white p-4">
        <p className="text-sm font-semibold text-ink-900">Explanation</p>
        <p className="mt-1 text-sm text-ink-600">{explanation}</p>
      </div>

      <Disclaimer />
    </div>
  )
}
