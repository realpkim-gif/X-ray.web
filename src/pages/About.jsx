import { CircleCheck, CircleX } from 'lucide-react'
import Disclaimer from '../components/ui/Disclaimer'
import { useReveal } from '../hooks/useReveal'

const CAN = [
  'Accept an uploaded X-ray image for demonstration purposes',
  'Simulate an AI analysis pipeline with a clear, staged process',
  'Visually highlight a region of interest with a confidence score',
  'Show what a real AI-assisted review workflow could look like',
]

const CANNOT = [
  'Diagnose a medical condition',
  'Replace evaluation by a doctor or qualified professional',
  'Guarantee the accuracy of any highlighted region',
  'Be used for real clinical or veterinary decision-making',
]

export default function About() {
  const whoRef = useReveal()
  const problemRef = useReveal()
  const howRef = useReveal()
  const gridRef = useReveal()
  const disclaimerRef = useReveal()

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="text-center">
        <span className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
          Congressional App Challenge
        </span>
        <h1 className="mt-4 font-display text-3xl font-bold text-ink-900 sm:text-4xl">About Radiant</h1>
      </div>

      <div className="mt-10 flex flex-col gap-8 text-ink-700">
        <section ref={whoRef}>
          <h2 className="text-lg font-semibold text-ink-900">Who we are</h2>
          <p className="mt-2 leading-relaxed">
            We're two high school students building Radiant for the Congressional App
            Challenge. One of us is focused on the AI, machine learning, image processing,
            and backend; the other is focused on frontend, UI/UX, and the overall
            experience you're using right now.
          </p>
        </section>

        <section ref={problemRef}>
          <h2 className="text-lg font-semibold text-ink-900">The problem we're exploring</h2>
          <p className="mt-2 leading-relaxed">
            Radiologists review an enormous volume of images, and fatigue and time
            pressure are real factors in medical imaging. We wanted to explore whether an
            AI-assisted tool could act as a second set of eyes — not replacing a doctor's
            judgment, but helping surface regions worth a closer look, faster.
          </p>
        </section>

        <section ref={howRef}>
          <h2 className="text-lg font-semibold text-ink-900">How the prototype works</h2>
          <p className="mt-2 leading-relaxed">
            At a high level: an image is passed to a model trained to recognize patterns
            associated with certain findings. The model outputs a region of interest and a
            confidence score, which the interface then displays as a highlighted overlay.
            Today, that pipeline is simulated with mock data so the full product
            experience can be demonstrated end-to-end; the real model is being developed
            separately and is designed to slot into the same interface.
          </p>
        </section>

        <section ref={gridRef} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-green-200 bg-green-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-green-800">
              <CircleCheck className="h-5 w-5" /> What this prototype can do
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-green-900/80">
              {CAN.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <p className="flex items-center gap-2 font-semibold text-red-800">
              <CircleX className="h-5 w-5" /> What this prototype cannot do
            </p>
            <ul className="mt-3 flex flex-col gap-2 text-sm text-red-900/80">
              {CANNOT.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-600" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div ref={disclaimerRef}>
          <Disclaimer />
        </div>
      </div>
    </div>
  )
}
