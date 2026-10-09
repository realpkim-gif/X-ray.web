import {
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  RotateCw,
  Scan,
  ZoomIn,
  ZoomOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'

const MIN_ZOOM = 1
const MAX_ZOOM = 3.5
const ZOOM_STEP = 0.5

/**
 * A simplified medical-imaging-style viewer. `image` is either an object URL
 * string (uploaded file) or a React component rendering an <svg> (demo
 * illustrations). `region` is the normalized (0-100) highlight box from the
 * analysis result.
 */
export default function XrayViewer({
  image,
  ImageComponent,
  alt = 'X-ray image',
  region = null,
  overlayLabel = 'Area for additional review',
  defaultShowOverlay = true,
}) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [fullscreen, setFullscreen] = useState(false)
  const [showOverlay, setShowOverlay] = useState(defaultShowOverlay)

  useEffect(() => {
    if (!fullscreen) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setFullscreen(false)
    }
    window.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [fullscreen])

  const zoomIn = () => setZoom((z) => Math.min(MAX_ZOOM, +(z + ZOOM_STEP).toFixed(2)))
  const zoomOut = () => setZoom((z) => Math.max(MIN_ZOOM, +(z - ZOOM_STEP).toFixed(2)))
  const resetView = () => {
    setZoom(1)
    setRotation(0)
  }
  const rotate = () => setRotation((r) => (r + 90) % 360)

  const stageClasses = fullscreen
    ? 'fixed inset-0 z-50 bg-ink-900 flex flex-col'
    : 'group/viewer relative flex flex-col rounded-xl border border-ink-200 bg-ink-900 shadow-[var(--shadow-soft)] transition-shadow duration-200 hover:shadow-[var(--shadow-lift)] overflow-hidden'

  return (
    <div className={stageClasses}>
      <div className="flex flex-1 items-center justify-center overflow-hidden p-6">
        <div
          className="relative flex items-center justify-center transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
        >
          <div className="relative w-[min(70vh,90vw)] max-w-[480px] transition-transform duration-300 ease-out group-hover/viewer:scale-[1.015]">
            {ImageComponent ? (
              <ImageComponent className="h-full w-full rounded-lg" />
            ) : (
              <img src={image} alt={alt} className="h-full w-full rounded-lg object-contain" />
            )}
            {region && showOverlay && (
              <div
                className="pointer-events-none absolute rounded-md border-2 border-brand-500/80 bg-brand-500/10 transition-all duration-300 ease-out group-hover/viewer:border-brand-500 group-hover/viewer:bg-brand-500/20"
                style={{
                  left: `${region.x}%`,
                  top: `${region.y}%`,
                  width: `${region.width}%`,
                  height: `${region.height}%`,
                }}
              >
                <span className="absolute -top-7 left-0 whitespace-nowrap rounded-md bg-brand-500 px-2 py-1 text-xs font-medium text-white opacity-90 transition-all duration-300 ease-out group-hover/viewer:-translate-y-0.5 group-hover/viewer:opacity-100">
                  {overlayLabel}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Toolbar
        zoom={zoom}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetView}
        onRotate={rotate}
        fullscreen={fullscreen}
        onToggleFullscreen={() => setFullscreen((f) => !f)}
        hasRegion={Boolean(region)}
        showOverlay={showOverlay}
        onToggleOverlay={() => setShowOverlay((v) => !v)}
      />
    </div>
  )
}

function Toolbar({
  zoom,
  onZoomIn,
  onZoomOut,
  onReset,
  onRotate,
  fullscreen,
  onToggleFullscreen,
  hasRegion,
  showOverlay,
  onToggleOverlay,
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-t border-white/10 bg-ink-900 px-3 py-2.5">
      <div className="flex items-center gap-1">
        <ToolButton label="Zoom out" onClick={onZoomOut} disabled={zoom <= MIN_ZOOM}>
          <ZoomOut className="h-4 w-4" />
        </ToolButton>
        <span className="min-w-11 text-center text-xs font-medium tabular-nums text-white/70">
          {Math.round(zoom * 100)}%
        </span>
        <ToolButton label="Zoom in" onClick={onZoomIn} disabled={zoom >= MAX_ZOOM}>
          <ZoomIn className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Fit to screen / reset zoom" onClick={onReset}>
          <Scan className="h-4 w-4" />
        </ToolButton>
        <ToolButton label="Rotate" onClick={onRotate}>
          <RotateCw className="h-4 w-4" />
        </ToolButton>
      </div>
      <div className="flex items-center gap-1">
        {hasRegion && (
          <ToolButton label={showOverlay ? 'Hide analysis overlay' : 'Show analysis overlay'} onClick={onToggleOverlay} active={showOverlay}>
            {showOverlay ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </ToolButton>
        )}
        <ToolButton label={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={onToggleFullscreen}>
          {fullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
        </ToolButton>
      </div>
    </div>
  )
}

function ToolButton({ label, children, active, ...props }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`flex h-8 w-8 items-center justify-center rounded-lg text-white/80 transition-all duration-150 ease-out hover:bg-white/10 hover:text-white active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent disabled:active:scale-100 ${
        active ? 'bg-brand-500/20 text-brand-400' : ''
      }`}
      {...props}
    >
      {children}
    </button>
  )
}
