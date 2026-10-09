import { animate, stagger } from 'animejs'
import {
  ArrowRight,
  FlaskConical,
  Gauge,
  Highlighter,
  Images,
  Layers,
  PawPrint,
  PlayCircle,
  ScanSearch,
  SlidersHorizontal,
  Upload,
} from 'lucide-react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { DISCLAIMER_TEXT } from '../components/ui/Disclaimer'
import ResultsPanel from '../components/xray/ResultsPanel'
import XrayViewer from '../components/xray/XrayViewer'
import { useCountUp } from '../hooks/useCountUp'
import { useParallax } from '../hooks/useParallax'
import { useReveal, useRevealGroup } from '../hooks/useReveal'
import { useTilt } from '../hooks/useTilt'
import chestFinding from '../assets/xrays/chest-finding.jpg'
import { DEMO_CASES } from '../lib/demoCases'
import { prefersReducedMotion } from '../lib/motion'
import { SAMPLE_RESULT } from '../lib/xrayService'

const INTRO_STEPS = [
  { icon: Upload, title: 'Upload', text: 'Select an X-ray image.' },
  { icon: ScanSearch, title: 'Analyze', text: 'Run AI-assisted image analysis.' },
  { icon: Highlighter, title: 'Review', text: 'Explore highlighted areas and supporting detail.' },
]

const FEATURES = [
  { icon: SlidersHorizontal, title: 'X-ray viewer', text: 'Zoom, rotate, fullscreen, and toggle the overlay.' },
  { icon: ScanSearch, title: 'AI-assisted analysis', text: 'A staged pipeline examines the uploaded image.' },
  { icon: Highlighter, title: 'Area highlighting', text: 'Regions worth a second look are marked in orange.' },
  { icon: Gauge, title: 'Confidence, not certainty', text: 'Every finding ships with a model confidence score.' },
  { icon: Images, title: 'Sample X-rays', text: 'Prepared demo cases for a no-upload walkthrough.' },
  { icon: FlaskConical, title: 'Research-oriented', text: 'Built to be understood, questioned, and extended.' },
]

const WORKFLOW_STEPS = [
  { icon: Upload, title: 'Upload', text: 'Choose an X-ray from your device.' },
  { icon: ScanSearch, title: 'Analyze', text: 'The system performs AI-assisted image analysis.' },
  { icon: Highlighter, title: 'Review', text: 'Potential areas of interest are visually highlighted.' },
  { icon: Layers, title: 'Understand', text: 'Read the supporting explanation and confidence score.' },
]

export default function Landing() {
  return (
    <div>
      <Hero />
      <IntroStrip />
      <FeatureSection />
      <ProductShowcase />
      <WorkflowSection />
      <DemoSection />
      <DogTeaser />
      <FinalCta />
    </div>
  )
}

function Hero() {
  const textRef = useRef(null)
  const parallaxRef = useParallax({ strength: 0.05 })
  const panelRef = useTilt()

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const textItems = textRef.current?.children
    if (textItems) {
      Array.from(textItems).forEach((el) => {
        el.style.opacity = '0'
        el.style.transform = 'translateY(14px)'
      })
    }
    if (panelRef.current) {
      panelRef.current.style.opacity = '0'
    }
  }, [panelRef])

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const textItems = textRef.current?.children

    const animations = []
    if (textItems) {
      animations.push(
        animate(textItems, {
          opacity: [0, 1],
          translateY: [14, 0],
          duration: 500,
          delay: stagger(70),
          ease: 'outQuad',
        }),
      )
    }
    if (panelRef.current) {
      animations.push(
        animate(panelRef.current, {
          opacity: [0, 1],
          duration: 550,
          delay: 200,
          ease: 'outQuad',
        }),
      )
    }
    return () => animations.forEach((a) => a.revert())
  }, [panelRef])

  return (
    <section className="border-b border-ink-200 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
        <div ref={textRef} className="min-w-0">
          <span className="inline-flex items-center rounded-md bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700">
            Student research prototype
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl">
            A clearer way to review X-ray images.
          </h1>
          <p className="mt-4 max-w-lg text-lg text-ink-600">
            Radiant provides AI-assisted analysis of X-ray images and highlights areas
            that may deserve additional review — built by two students for the
            Congressional App Challenge.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button to="/analyze" size="lg" icon={<ScanSearch className="h-5 w-5" />}>
              Analyze an X-ray
            </Button>
            <Button to="/how-it-works" variant="secondary" size="lg">
              See how it works
            </Button>
          </div>
          <p className="mt-5 max-w-md text-xs leading-relaxed text-ink-500">
            This tool is an AI-assisted research prototype and is not intended to
            diagnose medical conditions or replace evaluation by a qualified medical
            professional.
          </p>
        </div>

        <div ref={parallaxRef} className="relative mx-auto w-full min-w-0 max-w-sm [perspective:1200px]">
          <div ref={panelRef} className="[transform-style:preserve-3d]">
            <div className="overflow-hidden rounded-xl border border-ink-200 bg-ink-900 shadow-[var(--shadow-lift)]">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <span className="text-xs text-white/50">chest_xray_014.png</span>
                <span className="text-xs font-medium text-brand-400">Analysis complete</span>
              </div>
              <XrayViewer
                image={chestFinding}
                alt="Chest X-ray showing patchy opacity in the upper right lung field"
                region={SAMPLE_RESULT.region}
                overlayLabel="Area for review"
              />
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 rounded-lg border border-ink-200 bg-white px-4 py-2.5 shadow-[var(--shadow-lift)]">
            <p className="text-xs text-ink-500">Model confidence</p>
            <ConfidenceStat />
          </div>
        </div>
      </div>
    </section>
  )
}

function ConfidenceStat() {
  const ref = useCountUp(87, { duration: 900, delay: 500, format: (v) => `${Math.round(v)}%` })
  return (
    <p ref={ref} className="text-sm font-semibold text-ink-900">
      0%
    </p>
  )
}

function IntroStrip() {
  const ref = useRevealGroup({ staggerMs: 90 })
  return (
    <section className="border-b border-ink-200 bg-ink-50">
      <div ref={ref} className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6">
        {INTRO_STEPS.map((step) => (
          <div
            key={step.title}
            className="group flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-50 text-brand-500 transition-transform duration-200 group-hover:scale-110">
              <step.icon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-semibold text-ink-900">{step.title}</p>
              <p className="text-xs text-ink-500">{step.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

function FeatureSection() {
  const headingRef = useReveal()
  const gridRef = useRevealGroup({ staggerMs: 70 })
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div ref={headingRef} className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">What the prototype does</h2>
        <p className="mt-2 text-ink-600">A compact, research-oriented toolset for reviewing X-ray images.</p>
      </div>
      <div ref={gridRef} className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="group rounded-lg border border-ink-200 bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-50 text-brand-500 transition-transform duration-200 group-hover:scale-110">
              <f.icon className="h-4 w-4" />
            </span>
            <h3 className="mt-3 font-semibold text-ink-900">{f.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{f.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function ProductShowcase() {
  const headingRef = useReveal()
  const viewerRef = useReveal({ y: 20 })
  const panelRef = useReveal({ y: 20, delay: 120 })

  return (
    <section className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div ref={headingRef} className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Inside an analysis</h2>
          <p className="mt-2 text-ink-600">
            An image on the left, the model's output on the right — exactly what the
            application shows after analyzing an upload.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <div ref={viewerRef}>
            <XrayViewer image={chestFinding} alt="Chest X-ray showing patchy opacity in the upper right lung field" region={SAMPLE_RESULT.region} />
          </div>
          <div ref={panelRef}>
            <ResultsPanel result={SAMPLE_RESULT} />
          </div>
        </div>
      </div>
    </section>
  )
}

function WorkflowSection() {
  const headingRef = useReveal()
  const listRef = useRevealGroup({ staggerMs: 100 })

  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div ref={headingRef} className="mx-auto max-w-xl text-center">
        <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">How it works</h2>
        <p className="mt-2 text-ink-600">Four steps, start to finish.</p>
      </div>
      <div ref={listRef} className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {WORKFLOW_STEPS.map((step, i) => (
          <div
            key={step.title}
            className="group relative rounded-lg border border-ink-200 bg-white p-5 shadow-[var(--shadow-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-lift)]"
          >
            <span className="font-display text-xs font-bold text-brand-300">0{i + 1}</span>
            <span className="mt-2 flex h-10 w-10 items-center justify-center rounded-md bg-brand-50 text-brand-500 transition-transform duration-200 group-hover:scale-110">
              <step.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-3 font-semibold text-ink-900">{step.title}</h3>
            <p className="mt-1 text-sm text-ink-500">{step.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <Button to="/how-it-works" variant="ghost" icon={<ArrowRight className="h-4 w-4" />} className="flex-row-reverse">
          Learn more about the technology
        </Button>
      </div>
    </section>
  )
}

function DemoSection() {
  const headingRef = useReveal()
  const gridRef = useRevealGroup({ staggerMs: 80 })

  return (
    <section className="border-t border-ink-200 bg-ink-50">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div ref={headingRef} className="mx-auto max-w-xl text-center">
          <h2 className="font-display text-2xl font-bold text-ink-900 sm:text-3xl">Try a sample X-ray</h2>
          <p className="mt-2 text-ink-600">
            No upload needed — pick a prepared case and step straight into the analysis.
          </p>
        </div>
        <div ref={gridRef} className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-3">
          {DEMO_CASES.map((demoCase) => (
            <SampleCard key={demoCase.id} demoCase={demoCase} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SampleCard({ demoCase }) {
  return (
    <Link
      to="/demo"
      state={{ caseId: demoCase.id }}
      className="group flex flex-col overflow-hidden rounded-xl border border-ink-200 bg-white text-left shadow-[var(--shadow-soft)] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-ink-300 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative overflow-hidden bg-ink-900">
        <img
          src={demoCase.image}
          alt={demoCase.alt}
          className="aspect-[4/3] w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
        <span className="absolute inset-0 flex items-center justify-center bg-ink-900/0 opacity-0 transition-all duration-200 ease-out group-hover:bg-ink-900/30 group-hover:opacity-100">
          <PlayCircle className="h-9 w-9 text-white" />
        </span>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink-900 transition-colors duration-150 group-hover:text-brand-600">{demoCase.title}</p>
        <p className="mt-1 text-sm text-ink-500">{demoCase.description}</p>
      </div>
    </Link>
  )
}

function DogTeaser() {
  const ref = useReveal()
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <div
        ref={ref}
        className="flex flex-col items-center gap-5 rounded-xl border border-ink-200 bg-white px-6 py-8 text-center sm:px-8 md:flex-row md:text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-500">
          <PawPrint className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <h3 className="font-semibold text-ink-900">Educational veterinary demo</h3>
          <p className="mt-1 text-sm text-ink-500">
            Included to demonstrate the visualization workflow on a different kind of
            subject — not a veterinary diagnostic tool.
          </p>
        </div>
        <Button to="/demo/dog" variant="secondary" className="shrink-0">
          View dog X-ray demo
        </Button>
      </div>
    </section>
  )
}

function FinalCta() {
  const ref = useReveal()
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div ref={ref} className="rounded-xl bg-brand-500 px-6 py-12 text-center sm:px-10">
        <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">
          Explore the X-ray analysis workflow
        </h2>
        <p className="mx-auto mt-2 max-w-md text-white/85">
          Upload your own image, or try a prepared case in under a minute.
        </p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Button to="/analyze" size="lg" className="!bg-ink-900 hover:!bg-ink-800">
            Analyze an X-ray
          </Button>
          <Button to="/demo" variant="secondary" size="lg">
            Try the demo
          </Button>
        </div>
        <p className="mx-auto mt-6 max-w-lg text-xs leading-relaxed text-white/75">{DISCLAIMER_TEXT}</p>
      </div>
    </section>
  )
}
