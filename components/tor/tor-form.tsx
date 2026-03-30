'use client'

import { SparklesIcon } from 'lucide-react'
import { Controller, useFormContext } from 'react-hook-form'

import type { TorFields, TorType } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TOR_TYPES } from '@/lib/types'

interface TorFormProps {
  confidence: number
  torType: TorType
}

const FIELD_CONFIG = [
  {
    key: 'projectName' as const,
    label: 'ชื่อโครงการ',
    required: true,
    type: 'input',
  },
  {
    key: 'objective' as const,
    label: 'วัตถุประสงค์',
    type: 'textarea',
  },
  {
    key: 'scope' as const,
    label: 'ขอบเขตงาน',
    type: 'textarea',
  },
  {
    key: 'budget' as const,
    label: 'งบประมาณ',
    type: 'input',
  },
  {
    key: 'duration' as const,
    label: 'ระยะเวลาดำเนินการ',
    type: 'input',
  },
  {
    key: 'qualifications' as const,
    label: 'คุณสมบัติผู้เสนอราคา',
    type: 'textarea',
  },
  {
    key: 'conditions' as const,
    label: 'เงื่อนไขอื่น ๆ',
    type: 'textarea',
  },
]

export function TorForm({ confidence, torType }: TorFormProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext<TorFields>()

  const torLabel = TOR_TYPES.find((t) => t.value === torType)?.label

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            2
          </span>
          <h2 className="text-lg font-semibold">ตรวจสอบและแก้ไข</h2>
        </div>
        <p className="text-sm text-muted-foreground ml-8">
          AI ดึงข้อมูลจากเอกสารให้แล้ว — ตรวจสอบและแก้ไขก่อนสร้าง TOR
        </p>
      </div>

      {/* Info Bar */}
      <div className="flex items-center justify-between rounded-xl border border-border/50 bg-card p-3">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-primary" />
          <span className="text-sm font-medium">ประเภท: {torLabel}</span>
        </div>
        <Badge
          className={
            confidence >= 0.8
              ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
              : confidence >= 0.5
                ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
          }
          variant="secondary"
        >
          ความแม่นยำ {Math.round(confidence * 100)}%
        </Badge>
      </div>

      {/* Fields */}
      <div className="space-y-4">
        {FIELD_CONFIG.map((field) => (
          <Controller
            control={control}
            key={field.key}
            name={field.key}
            render={({ field: { onChange, value } }) => (
              <div className="space-y-2">
                <Label htmlFor={field.key}>
                  {field.label}
                  {field.required && (
                    <span className="text-destructive ml-1">*</span>
                  )}
                </Label>
                {field.type === 'input' ? (
                  <Input id={field.key} onChange={onChange} value={value} />
                ) : (
                  <Textarea
                    className="min-h-[100px]"
                    id={field.key}
                    onChange={onChange}
                    value={value}
                  />
                )}
                {errors[field.key] && (
                  <p className="text-sm text-destructive">
                    {errors[field.key]?.message}
                  </p>
                )}
              </div>
            )}
          />
        ))}
      </div>
    </div>
  )
}
