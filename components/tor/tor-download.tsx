'use client'

import {
  CheckCircle2Icon,
  DownloadIcon,
  Loader2Icon,
  RefreshCwIcon,
} from 'lucide-react'

import { Button } from '@/components/ui/button'

interface TorDownloadProps {
  isGenerating: boolean
  onDownload: () => void
  onStartOver: () => void
  success: boolean
}

export function TorDownload({
  isGenerating,
  onDownload,
  onStartOver,
  success,
}: TorDownloadProps) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            3
          </span>
          <h2 className="text-lg font-semibold">
            {success ? 'สร้างเอกสารสำเร็จ' : 'กำลังสร้างเอกสาร'}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center gap-6 rounded-2xl border border-border/50 bg-card py-12 px-6">
        {isGenerating ? (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 animate-pulse-glow">
              <Loader2Icon className="size-8 text-primary animate-spin" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-1">
                กำลังสร้างเอกสาร TOR…
              </p>
              <p className="text-sm text-muted-foreground">
                กรุณารอสักครู่ AI กำลังจัดทำเอกสาร
              </p>
            </div>
          </>
        ) : success ? (
          <>
            <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10">
              <CheckCircle2Icon className="size-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold mb-1">สร้างเอกสารสำเร็จ!</p>
              <p className="text-sm text-muted-foreground">
                ไฟล์เอกสาร TOR พร้อมดาวน์โหลดแล้ว
              </p>
            </div>
            <div className="flex gap-3">
              <Button className="gap-2" onClick={onDownload} size="lg">
                <DownloadIcon className="size-4" />
                ดาวน์โหลดเอกสาร
              </Button>
            </div>
          </>
        ) : null}
      </div>

      {/* Start Over */}
      {success && (
        <Button
          className="w-full gap-2"
          onClick={onStartOver}
          variant="outline"
        >
          <RefreshCwIcon className="size-4" />
          สร้าง TOR ใหม่
        </Button>
      )}
    </div>
  )
}
