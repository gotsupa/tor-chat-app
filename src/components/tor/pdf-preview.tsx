'use client'

import {
  FileTextIcon,
  MaximizeIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

interface PdfPreviewProps {
  file: File
}

const ZOOM_STEP = 10
const ZOOM_MIN = 30
const ZOOM_MAX = 200
const ZOOM_FIT = 100

export function PdfPreview({ file }: PdfPreviewProps) {
  const [zoom, setZoom] = useState(ZOOM_FIT)

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl)
  }, [objectUrl])

  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
  const zoomReset = () => setZoom(ZOOM_FIT)

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/50 bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
        <div className="flex items-center gap-2 min-w-0">
          <FileTextIcon className="size-4 shrink-0 text-primary" />
          <span className="truncate text-xs font-medium text-foreground">
            {file.name}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            className="size-7"
            disabled={zoom <= ZOOM_MIN}
            onClick={zoomOut}
            size="icon"
            title="ซูมออก"
            type="button"
            variant="ghost"
          >
            <ZoomOutIcon className="size-3.5" />
          </Button>
          <button
            className="min-w-[3rem] text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
            onClick={zoomReset}
            title="รีเซ็ตซูม"
            type="button"
          >
            {zoom}%
          </button>
          <Button
            className="size-7"
            disabled={zoom >= ZOOM_MAX}
            onClick={zoomIn}
            size="icon"
            title="ซูมเข้า"
            type="button"
            variant="ghost"
          >
            <ZoomInIcon className="size-3.5" />
          </Button>
          <Button
            className="size-7"
            onClick={zoomReset}
            size="icon"
            title="พอดีหน้า"
            type="button"
            variant="ghost"
          >
            <MaximizeIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer — scrollable container with scaled iframe */}
      <div className="flex-1 overflow-auto bg-muted/30 custom-scrollbar">
        <div
          className="mx-auto"
          style={{
            // A4 aspect ratio: 210mm × 297mm ≈ 1:1.414
            // At 100%, the iframe fills the container width
            // transform-origin top-left so scroll works naturally
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            width: `${10000 / zoom}%`,
          }}
        >
          <iframe
            className="block border-0 w-full"
            src={`${objectUrl}#toolbar=0&navpanes=0&view=FitH`}
            style={{
              aspectRatio: '210 / 297',
            }}
            title={`Preview: ${file.name}`}
          />
        </div>
      </div>
    </div>
  )
}
