'use client'

import { FileUpIcon, Loader2Icon, XIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PdfDropzoneProps {
  accept?: string
  className?: string
  disabled?: boolean
  file: File | null
  isUploading?: boolean
  onFileChange: (file: File | null) => void
}

export function PdfDropzone({
  accept = '.pdf',
  className,
  disabled = false,
  file,
  isUploading = false,
  onFileChange,
}: PdfDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      if (disabled || isUploading) return
      const droppedFile = e.dataTransfer.files[0]
      if (droppedFile?.type === 'application/pdf') {
        onFileChange(droppedFile)
      }
    },
    [disabled, isUploading, onFileChange]
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) {
        onFileChange(selected)
      }
      e.target.value = ''
    },
    [onFileChange]
  )

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (file) {
    return (
      <div
        className={cn(
          'flex items-center gap-3 rounded-xl border border-border/50 bg-card p-4',
          className
        )}
      >
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
          <FileUpIcon className="size-5 text-red-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">
            {formatSize(file.size)}
          </p>
        </div>
        {isUploading ? (
          <Loader2Icon className="size-4 animate-spin text-primary" />
        ) : (
          <Button
            disabled={disabled}
            onClick={() => onFileChange(null)}
            size="icon-xs"
            variant="ghost"
          >
            <XIcon className="size-3.5" />
          </Button>
        )}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-colors cursor-pointer',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-border/50 hover:border-muted-foreground/30',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={() => !disabled && !isUploading && inputRef.current?.click()}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(e) => {
        e.preventDefault()
        if (!disabled && !isUploading) setIsDragging(true)
      }}
      onDrop={handleDrop}
    >
      <div
        className={cn(
          'flex size-12 items-center justify-center rounded-xl',
          isDragging ? 'bg-primary/10' : 'bg-muted'
        )}
      >
        <FileUpIcon
          className={cn(
            'size-6',
            isDragging ? 'text-primary' : 'text-muted-foreground'
          )}
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-medium">
          ลากไฟล์มาวาง หรือ{' '}
          <span className="text-primary underline underline-offset-2">
            เลือกไฟล์
          </span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          รองรับไฟล์ PDF เท่านั้น
        </p>
      </div>
      <input
        accept={accept}
        className="hidden"
        disabled={disabled || isUploading}
        onChange={handleFileSelect}
        ref={inputRef}
        type="file"
      />
    </div>
  )
}
