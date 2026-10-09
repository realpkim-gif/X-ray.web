import { Highlighter, ScanSearch, ShieldCheck, Upload } from 'lucide-react'
import Button from '../components/ui/Button'
import Disclaimer from '../components/ui/Disclaimer'
import { useReveal, useRevealGroup } from '../hooks/useReveal'

const STEPS = [
  {
    icon: Upload,
    title: 'Upload',
    text: "Add an X-ray image — drag and drop it in, or choose a file from your computer. Nothing is sent anywhere until you're ready.",
  },
  {
    icon: ScanSearch,
    title: 'Analyze',
    text: 'The AI-assisted system examines the image, working through the same kind of image it was trained to recognize patterns in.',
  },
  {
    icon: Highlighter,
    title: 'Highlight',
    text: 'If the system identifies a region that stands out, it draws an orange highlight directly on the image, along with a confidence score.',
  },
  {
    icon: ShieldCheck,
    title: 'Review',
    text: 'The result is meant to be a starting point for a conversation — reviewed and confirmed by a qualified medical professional, never a final answer on its own.',
  },
]

export default function HowItWorks() {
  const listRef = useRevealGroup({ staggerMs: 100 })
  const infoRef = useReveal()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">How Radiant works</h1>
        <p className="mx-auto mt-4 max-w-xl text-ink-600">
          A beginner-friendly walkthrough of what happens between uploading an image and
          seeing a result — no machine learning background required.
        </p>
      </div>

      <div ref={listRef} className="mt-14 flex flex-col gap-6">
        {STEPS.map((step, i) => (
          <div
            key={step.title}
            className="flex gap-5 rounded-xl border border-ink-200 bg-white p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex flex-col items-center">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
                <step.icon className="h-6 w-6" />
              </span>
              {i < STEPS.length - 1 && <span className="mt-2 h-full w-px flex-1 bg-ink-200" />}
            </div>
            <div className="pb-2">
              <p className="font-display text-sm font-bold text-brand-400">Step 0{i + 1}</p>
              <h2 className="mt-0.5 text-lg font-semibold text-ink-900">{step.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{step.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div ref={infoRef} className="mt-12 rounded-xl border border-ink-200 bg-white p-6">
        <h2 className="font-semibold text-ink-900">What "AI-assisted" actually means here</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          The model behind Radiant looks at patterns of light and shadow in an image and
          compares them to patterns it has seen before. When it finds a region that looks
          statistically unusual, it flags that region and reports how confident it is in
          that judgment. It does not know a patient's history, symptoms, or context — and
          it can be wrong. That's why every result is framed as a possible area for
          review, not a diagnosis.
        </p>
      </div>

      <Disclaimer className="mt-8" />

      <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
        <Button to="/demo" size="lg">
          Try a Demo
        </Button>
        <Button to="/about" variant="secondary" size="lg">
          Read about the project
        </Button>
      </div>
    </div>
  )
}
