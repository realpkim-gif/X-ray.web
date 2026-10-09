import { ImageUp, RefreshCw, UploadCloud, X } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/webp']

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Large upload target. Supports drag-and-drop and click-to-browse. Once a
 * file is selected, hands a preview object URL + File back to the parent via
 * `onFileSelect`; the parent owns what happens next (this component doesn't
 * know about analysis).
 */
export default function UploadZone({ file, previewUrl, onFileSelect, onRemove, error }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)
  const dragCounter = useRef(0)

  const handleFiles = useCallback(
    (fileList) => {
      const picked = fileList?.[0]
      if (!picked) return
      onFileSelect(picked)
    },
    [onFileSelect],
  )

  // dragenter/dragleave fire on every child boundary crossing, not just the
  // zone's own edge — a counter avoids the highlight flickering while
  // dragging over the icon/text inside the zone.
  const onDragEnter = (e) => {
    e.preventDefault()
    dragCounter.current += 1
    setIsDragging(true)
  }

  const onDragLeave = (e) => {
    e.preventDefault()
    dragCounter.current -= 1
    if (dragCounter.current <= 0) {
      dragCounter.current = 0
      setIsDragging(false)
    }
  }

  const onDrop = (e) => {
    e.preventDefault()
    dragCounter.current = 0
    setIsDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  if (file && previewUrl) {
    return (
      <div className="rounded-2xl border border-ink-200 bg-white p-4 shadow-[var(--shadow-soft)] sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-ink-200 bg-ink-900">
            <img src={previewUrl} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-ink-900">{file.name}</p>
            <p className="text-sm text-ink-500">
              {file.type || 'image'} · {formatSize(file.size)}
            </p>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:bg-ink-50 active:scale-95"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
            </button>
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-ink-200 px-3 text-sm font-medium text-ink-700 transition-colors duration-150 hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
    )
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragEnter={onDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`group flex w-full flex-col items-center gap-4 rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 ease-out sm:p-14 ${
          isDragging
            ? 'scale-[1.01] border-brand-500 bg-brand-50'
            : 'border-ink-300 bg-white hover:border-brand-300 hover:bg-brand-50/40'
        }`}
      >
        <span
          className={`flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 ease-out group-hover:-translate-y-1 ${
            isDragging ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-500'
          }`}
        >
          {isDragging ? <ImageUp className="h-6 w-6" /> : <UploadCloud className="h-6 w-6" />}
        </span>
        <div>
          <p className="text-lg font-semibold text-ink-900">
            {isDragging ? 'Drop your X-ray here' : 'Drop an X-ray here'}
          </p>
          <p className="mt-1 text-sm text-ink-500">or choose an image from your computer</p>
        </div>
        <span className="rounded-lg bg-ink-900 px-4 py-2 text-sm font-semibold text-white transition-all duration-150 ease-out group-hover:-translate-y-px group-hover:bg-ink-800">
          Browse files
        </span>
        <p className="text-xs text-ink-500">Supports PNG, JPEG, WEBP · Max 15 MB</p>
      </button>
      {error && <p className="mt-2 text-sm font-medium text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}

export { ACCEPTED_TYPES }
