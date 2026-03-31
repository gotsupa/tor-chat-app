import { NextRequest } from 'next/server'

import { chatWithPdf } from '@/lib/server/openrouter'
import { addToHistory, getSession } from '@/lib/server/sessions'

/**
 * POST /api/chat/message
 * Send a message to chat with the uploaded PDF.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, session_id } = body as {
      message?: string
      session_id?: string
    }

    if (!session_id) {
      return Response.json({ error: 'ต้องระบุ session_id' }, { status: 400 })
    }

    if (!message?.trim()) {
      return Response.json({ error: 'ต้องระบุข้อความ' }, { status: 400 })
    }

    const session = getSession(session_id)
    if (!session) {
      return Response.json(
        { error: 'ไม่พบ session กรุณาอัปโหลดไฟล์ใหม่' },
        { status: 404 }
      )
    }

    // Add user message to history
    addToHistory(session_id, 'user', message)

    // Call OpenRouter
    const response = await chatWithPdf(
      session.pdfText,
      session.history,
      message
    )

    // Add assistant response to history
    addToHistory(session_id, 'assistant', response)

    return Response.json({ response })
  } catch (error) {
    console.error('[chat/message] Error:', error)
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการตอบคำถาม' },
      { status: 500 }
    )
  }
}
