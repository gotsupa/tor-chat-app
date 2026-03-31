import { NextRequest } from 'next/server'

import { createTorDocument } from '@/lib/server/tor-docx'

/**
 * POST /api/tor/generate
 * Generate a TOR Word document from fields.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fields, torType } = body as {
      fields?: Record<string, unknown>
      torType?: string
    }

    if (!fields) {
      return Response.json({ error: 'ต้องระบุ fields' }, { status: 400 })
    }

    if (!torType) {
      return Response.json({ error: 'ต้องระบุ torType' }, { status: 400 })
    }

    // Generate Word document
    const docBuffer = await createTorDocument(fields, torType)

    // Return as downloadable file
    return new Response(new Uint8Array(docBuffer), {
      headers: {
        'Content-Disposition': 'attachment; filename=TOR_Generated.docx',
        'Content-Type':
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      },
    })
  } catch (error) {
    console.error('[tor/generate] Error:', error)
    return Response.json(
      { error: 'เกิดข้อผิดพลาดในการสร้างเอกสาร' },
      { status: 500 }
    )
  }
}
