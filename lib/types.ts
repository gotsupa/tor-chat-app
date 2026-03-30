// ─── Chat Types ──────────────────────────────────────────────

export interface ChatMessage {
  content: string
  id: string
  role: 'assistant' | 'user'
  timestamp: Date
}

export interface ChatSession {
  fileName: string
  id: string
  status: 'error' | 'processing' | 'ready' | 'uploading'
}

// ─── TOR Types ───────────────────────────────────────────────

import { z } from 'zod'

export const TOR_TYPES = [
  { label: 'จัดซื้อวัสดุ', value: 'material_procurement' },
  { label: 'จ้างเหมาบริการ', value: 'service_contract' },
  { label: 'จ้างที่ปรึกษา', value: 'consulting' },
  { label: 'จัดซื้อครุภัณฑ์', value: 'equipment_procurement' },
  { label: 'งานก่อสร้าง', value: 'construction' },
  { label: 'จ้างออกแบบ', value: 'design' },
  { label: 'เช่าใช้บริการ', value: 'rental_service' },
] as const

export const torFieldsSchema = z.object({
  budget: z.string(),
  conditions: z.string(),
  duration: z.string(),
  objective: z.string(),
  projectName: z.string().min(1, 'กรุณาระบุชื่อโครงการ'),
  qualifications: z.string(),
  scope: z.string(),
})

export interface TorExtractResponse {
  confidence: number
  fields: TorFields
}

export type TorFields = z.infer<typeof torFieldsSchema>

export interface TorGenerateRequest {
  fields: TorFields
  torType: TorType
}

export type TorType = (typeof TOR_TYPES)[number]['value']
