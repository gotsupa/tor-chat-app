import { CheckCircle2Icon, FileTextIcon, Loader2Icon } from 'lucide-react'

import type { ChatSession } from '@/lib/types'

import { cn } from '@/lib/utils'

interface PdfUploadZoneProps {
  className?: string
  session: ChatSession | null
}

export function PdfUploadZone({ className, session }: PdfUploadZoneProps) {
  if (!session) return null

  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-xs',
        className
      )}
    >
      <div className="flex size-6 items-center justify-center rounded bg-red-500/10">
        <FileTextIcon className="size-3.5 text-red-400" />
      </div>
      <span className="truncate font-medium">{session.fileName}</span>
      {session.status === 'uploading' && (
        <Loader2Icon className="size-3 animate-spin text-muted-foreground ml-auto" />
      )}
      {session.status === 'processing' && (
        <span className="ml-auto flex items-center gap-1 text-amber-400">
          <Loader2Icon className="size-3 animate-spin" />
          กำลังวิเคราะห์
        </span>
      )}
      {session.status === 'ready' && (
        <CheckCircle2Icon className="size-3.5 text-emerald-400 ml-auto" />
      )}
      {session.status === 'error' && (
        <span className="ml-auto text-destructive">ผิดพลาด</span>
      )}
    </div>
  )
}
