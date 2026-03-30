import { Loader2Icon } from 'lucide-react'

export default function TorLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <Loader2Icon className="size-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">กำลังโหลด TOR Generator…</p>
    </div>
  )
}
