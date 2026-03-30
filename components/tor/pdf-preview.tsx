'use client'

import { FileTextIcon, ZoomInIcon, ZoomOutIcon } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

interface PdfPreviewProps {
  file: File
}

export function PdfPreview({ file }: PdfPreviewProps) {
  const [zoom, setZoom] = useState(100)

  const objectUrl = useMemo(() => URL.createObjectURL(file), [file])

  useEffect(() => {
    return () => URL.revokeObjectURL(objectUrl)
  }, [objectUrl])

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
            disabled={zoom <= 50}
            onClick={() => setZoom((z) => Math.max(50, z - 25))}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ZoomOutIcon className="size-3.5" />
          </Button>
          <span className="min-w-[3rem] text-center text-xs text-muted-foreground">
            {zoom}%
          </span>
          <Button
            className="size-7"
            disabled={zoom >= 200}
            onClick={() => setZoom((z) => Math.min(200, z + 25))}
            size="icon"
            type="button"
            variant="ghost"
          >
            <ZoomInIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 overflow-auto bg-muted/30">
        <iframe
          className="border-0"
          src={`${objectUrl}#toolbar=0&navpanes=0`}
          style={{
            height: `${zoom}%`,
            minHeight: '100%',
            minWidth: '100%',
            width: `${zoom}%`,
          }}
          title={`Preview: ${file.name}`}
        />
      </div>
    </div>
  )
}
