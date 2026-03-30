import type { Metadata, Viewport } from 'next'

import { Geist_Mono } from 'next/font/google'
import localFont from 'next/font/local'

import './globals.css'
import { QueryProvider } from '@/components/providers/query-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const googleSans = localFont({
  display: 'swap',
  src: [
    {
      path: './assets/fonts/GoogleSans-VariableFont_GRAD,opsz,wght.ttf',
      style: 'normal',
    },
    {
      path: './assets/fonts/GoogleSans-Italic-VariableFont_GRAD,opsz,wght.ttf',
      style: 'italic',
    },
  ],
  variable: '--font-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  description:
    'AI-powered chatbot for document Q&A and automated TOR generation',
  title: {
    default: 'TOR Chat App',
    template: '%s | TOR Chat App',
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      className={`antialiased ${googleSans.variable} ${geistMono.variable} font-sans`}
      lang="th"
      suppressHydrationWarning
    >
      <body className="min-h-dvh flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <QueryProvider>
            {children}
            <Toaster position="bottom-right" richColors />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
