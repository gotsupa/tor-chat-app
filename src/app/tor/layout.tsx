import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'อัปโหลด PDF รายละเอียดโครงการ แล้วสร้างเอกสาร TOR อัตโนมัติ',
  title: 'TOR Generator',
}

export default function TorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {children}
    </div>
  )
}
