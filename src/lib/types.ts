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
  { disabled: true, label: 'จ้างทั่วไป', value: 'general_service' },
  { disabled: true, label: 'จ้างก่อสร้าง', value: 'construction' },
  { disabled: true, label: 'จ้างที่ปรึกษา', value: 'consulting' },
  { disabled: true, label: 'จัดซื้อทั่วไป', value: 'general_procurement' },
  {
    disabled: false,
    label: 'จัดซื้อคอมพิวเตอร์',
    value: 'equipment_procurement',
  },
  { disabled: true, label: 'จ้างออกแบบ', value: 'design' },
  { disabled: true, label: 'จ้างควบคุมงาน', value: 'supervision' },
] as const

export const torFieldsSchema = z.object({
  background: z.string().optional(),
  bondPercent: z.string().optional(),
  brands: z.string().optional(),
  budget: z.string(),
  conditions: z.string(),
  cpu: z.string().optional(),
  duration: z.string(),
  middlePrice: z.string().optional(),
  minProjectValue: z.string().optional(),
  monitor: z.string().optional(),
  objective: z.string(),
  objectives: z.array(z.string()).optional(),
  os: z.string().optional(),
  penaltyMin: z.string().optional(),
  penaltyRate: z.string().optional(),
  projectName: z.string().min(1, 'กรุณาระบุชื่อโครงการ'),
  qualifications: z.string(),
  quantity: z.string().optional(),
  ram: z.string().optional(),
  scope: z.string(),
  storage: z.string().optional(),
  unit: z.string().optional(),
  warrantyYears: z.string().optional(),
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
