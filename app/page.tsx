import { ArrowRightIcon, FileTextIcon, MessageCircleIcon } from 'lucide-react'
import Link from 'next/link'

import { ThemeSelect } from '@/components/shared/theme-select'

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4">
        <span className="text-sm font-semibold tracking-tight text-foreground">
          TOR Chat
        </span>
        <ThemeSelect />
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center justify-center px-4 pb-24">
        <div className="mb-12 flex flex-col items-center gap-3 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            TOR Chat App
          </h1>
          <p className="max-w-md text-base text-muted-foreground">
            ถามตอบจากเอกสาร PDF และสร้างเอกสาร TOR อัตโนมัติ
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
          {/* Chat Bot Card */}
          <Link
            aria-label="ไปหน้า Chat Bot — ถาม-ตอบ AI จากเอกสาร"
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-foreground/15 hover:bg-accent/50"
            href="/chat"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <MessageCircleIcon className="size-5 text-primary" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold">Chat Bot</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                อัปโหลด PDF แล้วถามคำถามเกี่ยวกับเนื้อหาในเอกสาร
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                PDF Upload
              </span>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                AI Q&amp;A
              </span>
            </div>
          </Link>

          {/* TOR Generator Card */}
          <Link
            aria-label="ไปหน้า TOR Generator — สร้างเอกสาร TOR อัตโนมัติ"
            className="group flex flex-col gap-4 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-foreground/15 hover:bg-accent/50"
            href="/tor"
          >
            <div className="flex items-center justify-between">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <FileTextIcon className="size-5 text-primary" />
              </div>
              <ArrowRightIcon className="size-4 text-muted-foreground transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
            <div>
              <h2 className="text-base font-semibold">TOR Generator</h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                อัปโหลด PDF → AI ดึงข้อมูล → ตรวจสอบ → ดาวน์โหลด DOCX
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                AI Extract
              </span>
              <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                7 ประเภท
              </span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
