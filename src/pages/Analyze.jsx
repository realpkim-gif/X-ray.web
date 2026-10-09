import { RotateCcw, ScanSearch } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import AnalysisLoader from '../components/xray/AnalysisLoader'
import ResultsPanel from '../components/xray/ResultsPanel'
import UploadZone, { ACCEPTED_TYPES } from '../components/xray/UploadZone'
import XrayViewer from '../components/xray/XrayViewer'
import Button from '../components/ui/Button'
import Disclaimer from '../components/ui/Disclaimer'
import { useToast } from '../context/ToastContext'
import { analyzeXray } from '../lib/xrayService'

const MAX_SIZE_BYTES = 15 * 1024 * 1024

/** idle -> ready -> analyzing -> done */
export default function Analyze() {
  const [stage, setStage] = useState('idle')
  const [file, setFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [fileError, setFileError] = useState(null)
  const [activeStage, setActiveStage] = useState(0)
  const [result, setResult] = useState(null)
  const { toast } = useToast()
  const objectUrlRef = useRef(null)

  useEffect(() => () => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
  }, [])

  const handleFileSelect = (picked) => {
    if (!ACCEPTED_TYPES.includes(picked.type) && !picked.type.startsWith('image/')) {
      setFileError('That file type is not supported. Please upload a PNG, JPEG, or WEBP image.')
      return
    }
    if (picked.size > MAX_SIZE_BYTES) {
      setFileError('That file is too large. Please upload an image under 15 MB.')
      return
    }
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(picked)
    objectUrlRef.current = url
    setFile(picked)
    setPreviewUrl(url)
    setFileError(null)
    setStage('ready')
  }

  const handleRemove = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setFile(null)
    setPreviewUrl(null)
    setResult(null)
    setStage('idle')
  }

  const handleAnalyze = async () => {
    setStage('analyzing')
    setActiveStage(0)
    try {
      const res = await analyzeXray({
        imageUrl: previewUrl,
        onStage: (i) => setActiveStage(i),
      })
      setResult(res)
      setStage('done')
    } catch {
      toast('Something went wrong during analysis. Please try again.', { type: 'error' })
      setStage('ready')
    }
  }

  const handleStartOver = () => {
    setResult(null)
    setStage('ready')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-ink-900 sm:text-4xl">
          Upload an X-ray
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-ink-600">
          Drag and drop an image here or browse your files. Analysis runs entirely in this
          demo — nothing is uploaded to a server yet.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-2xl">
        {stage !== 'analyzing' && stage !== 'done' && (
          <UploadZone
            file={file}
            previewUrl={previewUrl}
            onFileSelect={handleFileSelect}
            onRemove={handleRemove}
            error={fileError}
          />
        )}

        {stage === 'ready' && (
          <div className="mt-6 flex animate-fade-up justify-center">
            <Button size="lg" onClick={handleAnalyze} icon={<ScanSearch className="h-5 w-5" />}>
              Analyze
            </Button>
          </div>
        )}
      </div>

      {stage === 'analyzing' && (
        <div className="mx-auto mt-4 max-w-2xl">
          <AnalysisLoader activeStage={activeStage} />
        </div>
      )}

      {stage === 'done' && result && (
        <div className="mt-4 grid grid-cols-1 animate-fade-up gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-start">
          <XrayViewer image={previewUrl} region={result.region} />
          <div className="flex flex-col gap-4">
            <ResultsPanel result={result} />
            <Button variant="secondary" onClick={handleStartOver} icon={<RotateCcw className="h-4 w-4" />}>
              Analyze another image
            </Button>
          </div>
        </div>
      )}

      {stage === 'idle' && <Disclaimer className="mx-auto mt-8 max-w-2xl" />}
    </div>
  )
}
