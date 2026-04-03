import OpenAI from 'openai'

// ─── Config ──────────────────────────────────────────────────
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY ?? ''
const OPENROUTER_BASE_URL =
  process.env.OPENROUTER_BASE_URL ?? 'https://openrouter.ai/api/v1'
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL ?? 'qwen/qwen3.5-flash-02-23'
const MAX_HISTORY = Number(process.env.MAX_HISTORY ?? '20')

// ─── Types ──────────────────────────────────────────────────
export interface ChatHistoryMessage {
  content: string
  role: 'assistant' | 'user'
}

// ─── Client (singleton per process) ─────────────────────────
let _client: null | OpenAI = null

// ─── PDF Chat ───────────────────────────────────────────────
export async function chatWithPdf(
  pdfText: string,
  history: ChatHistoryMessage[],
  question: string
): Promise<string> {
  const client = getClient()

  const systemPrompt = `คุณคือผู้ช่วย AI สำหรับวิเคราะห์เอกสาร PDF
ตอบคำถามโดยอิงจากเนื้อหาต่อไปนี้เป็นหลัก
ถ้าไม่มีข้อมูลในเอกสาร ให้บอกตรงๆ ว่า "ไม่พบข้อมูลนี้ในเอกสาร"
ตอบเป็นภาษาเดียวกับที่ผู้ใช้ถาม

=== เนื้อหา PDF ===
${pdfText}
===================`

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { content: systemPrompt, role: 'system' },
  ]

  // Append recent history (capped)
  for (const msg of history.slice(-MAX_HISTORY)) {
    messages.push({ content: msg.content, role: msg.role })
  }

  messages.push({ content: question, role: 'user' })

  const resp = await client.chat.completions.create({
    max_tokens: 2000,
    messages,
    model: OPENROUTER_MODEL,
    temperature: 0.7,
  })

  return resp.choices[0]?.message?.content ?? ''
}

// ─── TOR Field Extraction ───────────────────────────────────
export async function extractTorFields(
  pdfText: string,
  torType: string
): Promise<{ confidence: number; fields: Record<string, string> }> {
  const client = getClient()

  const systemPrompt = `คุณคือผู้ช่วย AI สำหรับดึงข้อมูลจากเอกสาร TOR (Terms of Reference)
จากเนื้อหา PDF ด้านล่าง ให้ดึงข้อมูลตาม fields ต่อไปนี้:
- projectName: ชื่อโครงการ
- objective: วัตถุประสงค์
- background: ความเป็นมา
- scope: ขอบเขตงาน
- budget: งบประมาณ(บาท)
- duration: ระยะเวลา
- penaltyRate: อัตราค่าปรับ
- qualifications: คุณสมบัติผู้เสนอราคา
- conditions: เงื่อนไข/ข้อกำหนดอื่นๆ

ประเภท TOR: ${torType}

ตอบเป็น JSON เท่านั้น ในรูปแบบ:
{
  "fields": { "projectName": "...", "objective": "...", "background": "...", "scope": "...", "budget": "...", "duration": "...", "penaltyRate": "...", "qualifications": "...", "conditions": "..." },
  "confidence": 0.85
}

ถ้าพบข้อมูล butget ในเอกสาร ให้เพิ่มวงเล็บด้านหลังเป็นคำไทยเช่น 1,000,000 ให้แปลงเป็น ๑,๐๐๐,๐๐๐ และใส่คำว่า (หนึ่งล้านบาท) ตามหลังด้วย เช่น "budget": "งบประมาณประมาณ 1 ล้านบาท (หนึ่งล้านบาท)"
ถ้าไม่พบข้อมูล field ใด ให้ใส่ ข้อมูลตัวอย่างมาคือช่วยแนะนำมาเลยว่า ใส่ข้อมูลอะไรใน field นั้นแทน (เช่น "budget": "งบประมาณประมาณ ๑,๐๐๐,๐๐๐ บาท (หนึ่งล้านบาท)(ตัวอย่าง)","penaltyRate": "๐.๒๐ ของราคาค่าสิ่งของที่ยังไม่ได้รับมอบต่อวัน (ตัวอย่าง)") และให้เปลี่ยนตัวเลขทั้งหมดเป็นเลขไทย"
confidence คืออัตราส่วนความมั่นใจ (0-1) ว่าดึงข้อมูลถูกต้อง

=== เนื้อหา PDF ===
${pdfText}
===================`

  const resp = await client.chat.completions.create({
    messages: [
      { content: systemPrompt, role: 'system' },
      { content: 'กรุณาดึงข้อมูลจากเอกสารนี้', role: 'user' },
    ],
    model: OPENROUTER_MODEL,
    response_format: { type: 'json_object' },
    temperature: 0.3,
  })

  const raw = resp.choices[0]?.message?.content ?? '{}'

  try {
    const parsed = JSON.parse(raw)
    return {
      confidence: parsed.confidence ?? 0,
      fields: parsed.fields ?? {},
    }
  } catch {
    return {
      confidence: 0,
      fields: {
        budget: '',
        conditions: '',
        duration: '',
        objective: '',
        projectName: '',
        qualifications: '',
        scope: '',
      },
    }
  }
}

function getClient(): OpenAI {
  if (!_client) {
    _client = new OpenAI({
      apiKey: OPENROUTER_API_KEY,
      baseURL: OPENROUTER_BASE_URL,
      defaultHeaders: {
        'HTTP-Referer':
          process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
        'X-Title': 'PDF Chat AI',
      },
    })
  }
  return _client
}
