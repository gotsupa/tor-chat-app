import { NextRequest } from 'next/server'

import { extractTorFields } from '@/lib/server/openrouter'
import { extractPdfText } from '@/lib/server/pdf'

/**
 * POST /api/tor/extract
 * Upload a PDF and extract TOR fields using AI.
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const torType = formData.get('tor_type') as null | string

    if (!file) {
      return Response.json({ error: 'ต้องส่งไฟล์ PDF' }, { status: 400 })
    }

    if (!torType) {
      return Response.json({ error: 'ต้องระบุประเภท TOR' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Extract text from PDF
    const pdfText = await extractPdfText(buffer)

    if (!pdfText.trim()) {
      return Response.json(
        { error: 'ไม่สามารถอ่านข้อความจาก PDF ได้' },
        { status: 422 }
      )
    }

    // Use AI to extract structured fields
    const result = await extractTorFields(pdfText, torType)

    return Response.json(result)
  } catch (error) {
    console.error('[tor/extract] Error:', error)
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการวิเคราะห์เอกสาร' },
      { status: 500 }
    )
  }
}
