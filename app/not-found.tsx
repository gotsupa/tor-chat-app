import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-24">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted">
        <span className="text-4xl">404</span>
      </div>
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">ไม่พบหน้าที่ต้องการ</h2>
        <p className="text-sm text-muted-foreground max-w-md">
          หน้าที่คุณกำลังมองหาอาจถูกย้าย ลบ หรือไม่เคยมีอยู่
        </p>
      </div>
      <Link
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        href="/"
      >
        <ArrowLeftIcon className="size-4" />
        กลับหน้าหลัก
      </Link>
    </div>
  )
}
