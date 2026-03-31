'use client'

import { CircleXIcon } from 'lucide-react'

export default function Error({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24">
      <div className="flex size-16 items-center justify-center rounded-2xl bg-destructive/10">
        <CircleXIcon className="size-8 text-destructive" />
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">เกิดข้อผิดพลาด</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          ไม่สามารถโหลดหน้านี้ได้ กรุณาลองใหม่อีกครั้ง
        </p>
      </div>
      <button
        className="rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        onClick={() => reset()}
      >
        ลองใหม่
      </button>
    </div>
  )
}
