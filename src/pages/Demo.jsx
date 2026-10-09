import { ArrowLeft, PawPrint, PlayCircle, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import AnalysisLoader from '../components/xray/AnalysisLoader'
import ResultsPanel from '../components/xray/ResultsPanel'
import XrayViewer from '../components/xray/XrayViewer'
import Button from '../components/ui/Button'
import { useRevealGroup } from '../hooks/useReveal'
import { DEMO_CASES, getDemoCase } from '../lib/demoCases'
import { analyzeXray } from '../lib/xrayService'

/** picking -> analyzing -> done */
export default function Demo() {
  const [activeCase, setActiveCase] = useState(null)
  const [stage, setStage] = useState('picking')
  const [activeStage, setActiveStage] = useState(0)
  const [result, setResult] = useState(null)
  const gridRef = useRevealGroup({ staggerMs: 70 })
  const location = useLocation()
  const autoRunId = location.state?.caseId
  const hasAutoRun = useRef(false)

  const runCase = async (demoCase) => {
    setActiveCase(demoCase)
    setStage('analyzing')
    setActiveStage(0)
    const res = await analyzeXray({
      imageUrl: demoCase.id,
      mode: demoCase.mode,
      onStage: (i) => setActiveStage(i),
    })
    // Real demo images have a real (or deliberately chosen) region, rather
    // than the mock service's generic one for arbitrary uploads.
    setResult(demoCase.region ? { ...res, region: demoCase.region } : res)
    setStage('done')
  }

  // Landing page "sample X-ray" cards deep-link here with a case id in nav
  // state, so the picker is skipped and the real analysis flow runs directly.
  useEffect(() => {
    if (autoRunId && !hasAutoRun.current) {
      hasAutoRun.current = true
      runCase(getDemoCase(autoRunId))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRunId])

  const reset = () => {
    setActiveCase(null)
    setStage('picking')
    setResult(null)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">Try a Demo</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-600">
          No upload needed. Pick a prepared case below to see the full analysis flow,
          exactly as it would run on a real upload.
        </p>
      </div>

      {stage === 'picking' && (
        <>
          <div ref={gridRef} className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {DEMO_CASES.map((demoCase) => (
              <DemoCard key={demoCase.id} demoCase={demoCase} onRun={() => runCase(demoCase)} />
            ))}
          </div>

          <div className="mx-auto mt-6 flex max-w-4xl justify-center">
            <Button
              to="/demo/dog"
              variant="ghost"
              icon={<PawPrint className="h-4 w-4" />}
              className="text-ink-500"
            >
              Looking for the veterinary demo?
            </Button>
          </div>
        </>
      )}

      {stage === 'analyzing' && (
        <div className="mx-auto mt-10 max-w-2xl">
          <AnalysisLoader activeStage={activeStage} />
        </div>
      )}

      {stage === 'done' && result && activeCase && (
        <div className="mt-10 animate-fade-up">
          <button
            type="button"
            onClick={reset}
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-800"
          >
            <ArrowLeft className="h-4 w-4" /> Back to demo cases
          </button>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
            <XrayViewer image={activeCase.image} alt={activeCase.alt} region={result.region} />
            <div className="flex flex-col gap-4">
              <ResultsPanel result={result} />
              <Button variant="secondary" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
                Try another case
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DemoCard({ demoCase, onRun }) {
  return (
    <button
      type="button"
      onClick={onRun}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-[var(--shadow-soft)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative overflow-hidden bg-ink-900">
        <img
          src={demoCase.image}
          alt={demoCase.alt}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-200 ease-out group-hover:bg-ink-900/30 group-hover:opacity-100">
          <PlayCircle className="h-10 w-10 text-white" />
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink-900 transition-colors duration-150 group-hover:text-brand-600">{demoCase.title}</p>
        <p className="mt-1 text-sm text-ink-500">{demoCase.description}</p>
      </div>
    </button>
  )
}
