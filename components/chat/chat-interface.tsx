'use client'

import { BotMessageSquareIcon, PlusIcon, SparklesIcon } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import type { ChatMessage as ChatMessageType, ChatSession } from '@/lib/types'

import { ChatInput } from '@/components/chat/chat-input'
import { ChatMessage, TypingIndicator } from '@/components/chat/chat-message'
import { PdfUploadZone } from '@/components/chat/pdf-upload-zone'
import { PageHeader } from '@/components/shared/page-header'
import { PdfDropzone } from '@/components/shared/pdf-dropzone'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { apiClient } from '@/lib/axios'

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [session, setSession] = useState<ChatSession | null>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [pendingFile, setPendingFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

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

      const { data } = await apiClient.post('/api/chat/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setSession({
        fileName: pendingFile.name,
        id: data.session_id,
        status: 'ready',
      })

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
        const { data } = await apiClient.post('/api/chat/message', {
          message: content,
          session_id: session.id,
        })

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
    setUploadOpen(true)
  }, [])

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <PageHeader description="ถามตอบ AI จากเอกสาร PDF" title="Chat Bot">
        <PdfUploadZone session={session} />
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 && !session ? (
          /* Empty State */
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-24 px-4">
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
          <div className="mx-auto max-w-3xl space-y-4 p-4">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>

      {/* Input */}
      <ChatInput
        disabled={isTyping}
        onAttach={() => setUploadOpen(true)}
        onSend={handleSend}
      />

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
