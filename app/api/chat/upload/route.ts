import { NextRequest } from 'next/server'

import { extractPdfText } from '@/lib/server/pdf'
import { createSession } from '@/lib/server/sessions'

/**
 * POST /api/chat/upload
 * Upload a PDF file, extract text, and create a chat session.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return Response.json({ error: 'ต้องส่งไฟล์ PDF' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text
    const pdfText = await extractPdfText(buffer)

    if (!pdfText.trim()) {
      return Response.json(
        { error: 'ไม่สามารถอ่านข้อความจาก PDF ได้' },
        { status: 422 }
      )
    }

    // Create session
    const sessionId = crypto.randomUUID()
    createSession(sessionId, file.name, pdfText)

    return Response.json({ session_id: sessionId })
  } catch (error) {
    console.error('[chat/upload] Error:', error)
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการอัปโหลดไฟล์' },
      { status: 500 }
    )
  }
}
