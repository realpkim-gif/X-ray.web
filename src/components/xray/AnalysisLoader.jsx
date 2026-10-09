import { Check, ScanLine } from 'lucide-react'
import { ANALYSIS_STAGES } from '../../lib/xrayService'

/**
 * Staged "analyzing" screen. `activeStage` is the index into ANALYSIS_STAGES
 * currently in progress (stages before it are complete).
 */
export default function AnalysisLoader({ activeStage }) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-ink-200 bg-white px-6 py-12 text-center shadow-[var(--shadow-soft)] sm:py-14">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-500 text-white">
        <ScanLine className="h-5 w-5" />
      </span>

      <h2 className="mt-5 text-lg font-semibold text-ink-900">Analyzing X-ray&hellip;</h2>
      <p className="mt-1.5 max-w-sm text-sm text-ink-500">
        This is a simulated demo analysis. Your friend's model will replace this step later.
      </p>

      <ol className="mt-7 flex w-full max-w-xs flex-col gap-3 text-left">
        {ANALYSIS_STAGES.map((stage, i) => {
          const isDone = i < activeStage
          const isActive = i === activeStage
          return (
            <li key={stage} className="flex items-center gap-3">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                  isDone
                    ? 'border-brand-500 bg-brand-500 text-white'
                    : isActive
                      ? 'border-brand-500 text-brand-500'
                      : 'border-ink-200 text-ink-300'
                }`}
              >
                {isDone ? <Check key={i} className="h-3.5 w-3.5 animate-pop" /> : i + 1}
              </span>
              <span
                className={`text-sm font-medium transition-colors ${
                  isDone ? 'text-ink-400 line-through decoration-ink-300' : isActive ? 'text-ink-900' : 'text-ink-500'
                }`}
              >
                {stage}
              </span>
              {isActive && <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-brand-500" />}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
