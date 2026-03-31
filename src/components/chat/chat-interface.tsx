'use client'

import {
  BotMessageSquareIcon,
  FileTextIcon,
  PanelRightCloseIcon,
  PanelRightOpenIcon,
  PlusIcon,
  SparklesIcon,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { ChatMessage as ChatMessageType, ChatSession } from '@/lib/types'

import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessage, TypingIndicator } from '@/components/chat/chat-message'
import { PdfUploadZone } from '@/components/chat/pdf-upload-zone'
import { PageHeader } from '@/components/shared/page-header'
import { PdfDropzone } from '@/components/shared/pdf-dropzone'
import { PdfPreview } from '@/components/shared/pdf-preview'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showPdf, setShowPdf] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Upload PDF
  const handleUploadPdf = useCallback(async () => {
    if (!pendingFile) return

    setIsUploading(true)
    const newSession: ChatSession = {
      fileName: pendingFile.name,
      id: '',
      status: 'uploading',
    }
    setSession(newSession)
    setUploadOpen(false)

    try {
      const formData = new FormData()
      formData.append('file', pendingFile)

      setSession((s) => (s ? { ...s, status: 'processing' } : s))

      const res = await fetch('/api/chat/upload', {
        body: formData,
        method: 'POST',
      })

      if (!res.ok) throw new Error('Upload failed')
      const data = await res.json()

      setSession({
        fileName: pendingFile.name,
        id: data.session_id,
        status: 'ready',
      })

      // Keep the file for PDF preview
      setUploadedFile(pendingFile)

      setMessages([
        {
          content: `อัปโหลดไฟล์ "${pendingFile.name}" สำเร็จ — พร้อมตอบคำถามแล้ว`,
          id: crypto.randomUUID(),
          role: 'assistant',
          timestamp: new Date(),
        },
      ])

      toast.success('อัปโหลดไฟล์สำเร็จ')
    } catch {
      setSession((s) => (s ? { ...s, status: 'error' } : s))
      toast.error('อัปโหลดไฟล์ผิดพลาด')
    } finally {
      setIsUploading(false)
      setPendingFile(null)
    }
  }, [pendingFile])

  // Send message
  const handleSend = useCallback(
    async (content: string) => {
      if (!session?.id) {
        toast.error('กรุณาอัปโหลดไฟล์ PDF ก่อน')
        setUploadOpen(true)
        return
      }

      const userMessage: ChatMessageType = {
        content,
        id: crypto.randomUUID(),
        role: 'user',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      try {
        const res = await fetch('/api/chat/message', {
          body: JSON.stringify({
            message: content,
            session_id: session.id,
          }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })

        if (!res.ok) throw new Error('Message failed')
        const data = await res.json()

        const aiMessage: ChatMessageType = {
          content: data.response || data.message || 'ไม่สามารถตอบคำถามได้',
          id: crypto.randomUUID(),
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, aiMessage])
      } catch {
        const errorMessage: ChatMessageType = {
          content: 'เกิดข้อผิดพลาดในการตอบคำถาม กรุณาลองใหม่อีกครั้ง',
          id: crypto.randomUUID(),
          role: 'assistant',
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, errorMessage])
        toast.error('ส่งข้อความผิดพลาด')
      } finally {
        setIsTyping(false)
      }
    },
    [session]
  )

  // New chat
  const handleNewChat = useCallback(() => {
    setMessages([])
    setSession(null)
    setPendingFile(null)
    setUploadedFile(null)
    setShowPdf(false)
    setUploadOpen(true)
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <PageHeader description="ถามตอบ AI จากเอกสาร PDF" title="Chat Bot">
        <PdfUploadZone session={session} />
        {uploadedFile && (
          <Button
            className="hidden md:flex gap-1.5"
            onClick={() => setShowPdf((v) => !v)}
            size="sm"
            variant={showPdf ? 'default' : 'outline'}
          >
            {showPdf ? (
              <>
                <PanelRightCloseIcon className="size-3.5" />
                ซ่อน PDF
              </>
            ) : (
              <>
                <FileTextIcon className="size-3.5" />
                ดู PDF
              </>
            )}
          </Button>
        )}
        <Button
          className="gap-1.5"
          onClick={handleNewChat}
          size="sm"
          variant="outline"
        >
          <PlusIcon className="size-3.5" />
          แชทใหม่
        </Button>
      </PageHeader>

      {/* Main Content — Chat + optional PDF panel */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Chat Column */}
        <div className="flex flex-1 flex-col min-w-0 min-h-0">
          {/* Messages */}
          <div
            className="flex-1 overflow-y-auto custom-scrollbar min-h-0"
            ref={scrollRef}
          >
            {messages.length === 0 && !session ? (
              /* Empty State */
              <div className="flex h-full flex-col items-center justify-center gap-6 py-24 px-4">
                <div className="flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-primary/10">
                  <BotMessageSquareIcon className="size-10 text-primary/70" />
                </div>
                <div className="text-center max-w-sm">
                  <h2 className="text-xl font-semibold mb-2">เริ่มต้นแชท</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    อัปโหลดไฟล์ PDF ที่ต้องการถามคำถาม แล้ว AI
                    จะวิเคราะห์เนื้อหาและพร้อมตอบคำถามให้
                  </p>
                  <Button className="gap-2" onClick={() => setUploadOpen(true)}>
                    <SparklesIcon className="size-4" />
                    อัปโหลด PDF เพื่อเริ่มต้น
                  </Button>
                </div>
              </div>
            ) : (
              /* Message List */
              <div className="mx-auto max-w-3xl space-y-3 p-3 md:space-y-4 md:p-4">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isTyping && <TypingIndicator />}
              </div>
            )}
          </div>
        </div>

        {/* PDF Preview Panel */}
        {showPdf && uploadedFile && (
          <div className="hidden md:flex w-[45%] max-w-[600px] border-l border-border/50 flex-col animate-in slide-in-from-right-5 duration-200">
            <div className="flex items-center justify-between border-b border-border/50 px-3 py-2">
              <span className="text-xs font-medium text-muted-foreground">
                เอกสารอ้างอิง
              </span>
              <Button
                className="size-7"
                onClick={() => setShowPdf(false)}
                size="icon"
                title="ซ่อนแผง PDF"
                type="button"
                variant="ghost"
              >
                <PanelRightOpenIcon className="size-3.5" />
              </Button>
            </div>
            <div className="flex-1 min-h-0">
              <PdfPreview file={uploadedFile} />
            </div>
          </div>
        )}
      </div>

      {/* Input — anchored to bottom of layout */}
      <div className="shrink-0 pb-[env(safe-area-inset-bottom)]">
        <ChatInput
          disabled={isTyping}
          onAttach={() => setUploadOpen(true)}
          onSend={handleSend}
        />
      </div>

      {/* Upload Dialog */}
      <Dialog onOpenChange={setUploadOpen} open={uploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>อัปโหลดไฟล์ PDF</DialogTitle>
            <DialogDescription>
              เลือกไฟล์ PDF ที่ต้องการใช้เป็นข้อมูลสำหรับถามตอบ
            </DialogDescription>
          </DialogHeader>
          <PdfDropzone
            file={pendingFile}
            isUploading={isUploading}
            onFileChange={setPendingFile}
          />
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setUploadOpen(false)
                setPendingFile(null)
              }}
              size="sm"
              variant="outline"
            >
              ยกเลิก
            </Button>
            <Button
              disabled={!pendingFile || isUploading}
              onClick={handleUploadPdf}
              size="sm"
            >
              {isUploading ? 'กำลังอัปโหลด…' : 'อัปโหลด'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
