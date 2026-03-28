import type { Metadata } from 'next'

export const metadata: Metadata = {
  description: 'Manage your Google Drive files with AI-powered categorization',
  title: 'Drive Manager | KM CRM',
}

export default function DriveLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">{children}</div>
  )
}
