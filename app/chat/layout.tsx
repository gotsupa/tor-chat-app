import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'อัปโหลด PDF แล้วถามตอบกับ AI อัตโนมัติ',
  title: 'Chat Bot',
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">{children}</div>
  )
}
