import { ArrowLeft, GraduationCap, PawPrint, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import DogIllustration from '../components/DogIllustration'
import AnalysisLoader from '../components/xray/AnalysisLoader'
import DogLegXray from '../components/xray/illustrations/DogLegXray'
import ResultsPanel from '../components/xray/ResultsPanel'
import XrayViewer from '../components/xray/XrayViewer'
import Button from '../components/ui/Button'
import { analyzeXray } from '../lib/xrayService'

/** intro -> analyzing -> done */
export default function DogDemo() {
  const [stage, setStage] = useState('intro')
  const [activeStage, setActiveStage] = useState(0)
  const [result, setResult] = useState(null)

  const run = async () => {
    setStage('analyzing')
    setActiveStage(0)
    const res = await analyzeXray({
      imageUrl: 'dog-leg-demo',
      mode: 'finding',
      onStage: (i) => setActiveStage(i),
    })
    setResult(res)
    setStage('done')
  }

  const reset = () => setStage('intro')

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Button to="/demo" variant="ghost" icon={<ArrowLeft className="h-4 w-4" />} className="text-ink-500">
        Back to demo cases
      </Button>

      <div className="mt-4 rounded-xl border border-brand-200 bg-brand-50 p-4 text-center sm:text-left">
        <p className="flex items-center justify-center gap-2 font-semibold text-brand-700 sm:justify-start">
          <GraduationCap className="h-5 w-5" /> Educational demonstration only
        </p>
        <p className="mt-1 text-sm text-brand-800/80">
          This section is not a veterinary diagnostic tool and should never be used to make
          real decisions about an animal's health. It exists to show how the same
          highlight-and-review interface could generalize beyond human radiology.
        </p>
      </div>

      {stage === 'intro' && (
        <div className="mt-10 flex flex-col items-center text-center">
          <DogIllustration className="h-48 w-48 sm:h-56 sm:w-56" />
          <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">
            <PawPrint className="h-3.5 w-3.5" /> Veterinary demo
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold text-ink-900 sm:text-4xl">
            Explore the Veterinary Demo
          </h1>
          <p className="mx-auto mt-3 max-w-md text-ink-600">
            See a stylized X-ray of a dog's leg and a highlighted region representing a
            demonstration possible bone abnormality.
          </p>
          <Button size="lg" className="mt-7" onClick={run}>
            View dog X-ray demo
          </Button>
        </div>
      )}

      {stage === 'analyzing' && (
        <div className="mx-auto mt-10 max-w-2xl">
          <AnalysisLoader activeStage={activeStage} />
        </div>
      )}

      {stage === 'done' && result && (
        <div className="mt-10 grid grid-cols-1 animate-fade-up gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <XrayViewer
            ImageComponent={DogLegXray}
            region={result.region}
            overlayLabel="Demonstration: possible abnormality"
          />
          <div className="flex flex-col gap-4">
            <ResultsPanel result={result} />
            <p className="rounded-xl border border-ink-200 bg-white p-4 text-xs text-ink-500">
              Not a veterinary diagnostic tool. This case uses an illustrative image and
              simulated output for demonstration purposes only.
            </p>
            <Button variant="secondary" onClick={reset} icon={<RotateCcw className="h-4 w-4" />}>
              Restart demo
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
