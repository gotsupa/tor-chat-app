'use client'

import { PlusIcon, SparklesIcon, TrashIcon } from 'lucide-react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import type { TorFields, TorType } from '@/lib/types'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { TOR_TYPES } from '@/lib/types'

interface TorFormProps {
  confidence: number
  torType: TorType
}

// Fields shown for all TOR types
const COMMON_FIELDS = [
  {
    key: 'projectName' as const,
    label: 'ชื่อโครงการ',
    required: true,
    type: 'input',
  },
  { key: 'background' as const, label: 'ความเป็นมา', type: 'textarea' },
  { key: 'objective' as const, label: 'วัตถุประสงค์', type: 'textarea' },
  { key: 'scope' as const, label: 'ขอบเขตงาน', type: 'textarea' },
  { key: 'budget' as const, label: 'งบประมาณ (บาท)', type: 'textarea' },
  // {
  //   inputType: 'number',
  //   key: 'budget' as const,
  //   label: 'งบประมาณ (บาท)',
  //   type: 'input',
  // },
  { key: 'duration' as const, label: 'ระยะเวลาดำเนินการ', type: 'input' },
  { key: 'penaltyRate' as const, label: 'อัตราค่าปรับ', type: 'textarea' }
  // {
  //   key: 'qualifications' as const,
  //   label: 'คุณสมบัติผู้เสนอราคา',
  //   type: 'textarea',
  // },
  // { key: 'conditions' as const, label: 'เงื่อนไขอื่น ๆ', type: 'textarea' },
]

// Extra fields specific to equipment_procurement
const EQUIPMENT_FIELDS = [
  {
    inputType: 'number',
    key: 'quantity' as const,
    label: 'จำนวน',
    type: 'input',
  },
  { key: 'unit' as const, label: 'หน่วย', type: 'input' },
  { key: 'background' as const, label: 'ความเป็นมา', type: 'textarea' },
  { key: 'objectives' as const, label: 'วัตถุประสงค์', type: 'textarea' },
  { key: 'brands' as const, label: 'ยี่ห้อ / ผู้ผลิตที่กำหนด', type: 'input' },
  {
    inputType: 'number',
    key: 'minProjectValue' as const,
    label: 'มูลค่าผลงานขั้นต่ำ (บาท)',
    type: 'input',
  },
  { key: 'cpu' as const, label: 'ประมวลผล (CPU)', type: 'input' },
  { key: 'ram' as const, label: 'หน่วยความจำ (RAM)', type: 'input' },
  { key: 'storage' as const, label: 'พื้นที่จัดเก็บ (Storage)', type: 'input' },
  { key: 'os' as const, label: 'ระบบปฏิบัติการ (OS)', type: 'input' },
  { key: 'monitor' as const, label: 'มอนิเตอร์', type: 'input' },
  {
    inputType: 'number',
    key: 'warrantyYears' as const,
    label: 'ระยะเวลารับประกัน (ปี)',
    type: 'input',
  },
  {
    inputType: 'number',
    key: 'middlePrice' as const,
    label: 'ราคากลาง (บาท)',
    type: 'input',
  },
  {
    inputType: 'number',
    key: 'penaltyRate' as const,
    label: 'อัตราค่าปรับ (%)',
    type: 'input',
  },
  {
    inputType: 'number',
    key: 'penaltyMin' as const,
    label: 'ค่าปรับขั้นต่ำ (บาท)',
    type: 'input',
  },
  {
    inputType: 'number',
    key: 'bondPercent' as const,
    label: 'หลักประกันสัญญา (%)',
    type: 'input',
  },
]

export function TorForm({ confidence, torType }: TorFormProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext<TorFields>()

  const torLabel = TOR_TYPES.find((t) => t.value === torType)?.label
  const isEquipment = torType === 'equipment_procurement'

  // Manage objectives as string[] via setValue
  const objectives = useWatch({ control, name: 'objectives' }) ?? []
  // const setObjectives = (next: string[]) => setValue('objectives', next)
  // const addObjective = () => setObjectives([...objectives, ''])
  // const removeObjective = (i: number) =>
  //   setObjectives(objectives.filter((_, idx) => idx !== i))
  // const updateObjective = (i: number, val: string) => {
  //   const next = [...objectives]
  //   next[i] = val
  //   setObjectives(next)
  // }

  console.log('background', useWatch({ control, name: 'background' }))

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

      {/* Common Fields */}
      <div className="space-y-4">
        {COMMON_FIELDS.map((field) => (
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
                  <Input
                    id={field.key}
                    min={field.inputType === 'number' ? 0 : undefined}
                    onChange={onChange}
                    step={field.inputType === 'number' ? 'any' : undefined}
                    type={field.inputType ?? 'text'}
                    value={value ?? ''}
                  />
                ) : (
                  <Textarea
                    className="min-h-[100px]"
                    id={field.key}
                    onChange={onChange}
                    value={value ?? ''}
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

      {/* Equipment Procurement Fields */}
      {/* {isEquipment && (
        <div className="space-y-4 rounded-xl border border-border/50 bg-card/50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            รายละเอียดครุภัณฑ์
          </p>

          {EQUIPMENT_FIELDS.map((field) => (
            <Controller
              control={control}
              key={field.key}
              name={field.key}
              render={({ field: { onChange, value } }) => (
                <div className="space-y-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === 'input' ? (
                    <Input
                      id={field.key}
                      min={field.inputType === 'number' ? 0 : undefined}
                      onChange={onChange}
                      step={field.inputType === 'number' ? 'any' : undefined}
                      type={field.inputType ?? 'text'}
                      value={value ?? ''}
                    />
                  ) : (
                    <Textarea
                      className="min-h-[80px]"
                      id={field.key}
                      onChange={onChange}
                      value={value ?? ''}
                    />
                  )}
                </div>
              )}
            />
          ))}

          <div className="space-y-2">
            <Label>วัตถุประสงค์ (รายการ)</Label>
            <div className="space-y-2">
              {objectives.map((obj, index) => (
                <div className="flex gap-2" key={index}>
                  <span className="mt-2.5 text-xs text-muted-foreground w-6 shrink-0">
                    {index + 1}.
                  </span>
                  <Input
                    className="flex-1"
                    id={`objectives-${index}`}
                    onChange={(e) => updateObjective(index, e.target.value)}
                    value={obj}
                  />
                  <Button
                    className="size-9 shrink-0"
                    onClick={() => removeObjective(index)}
                    size="icon"
                    type="button"
                    variant="ghost"
                  >
                    <TrashIcon className="size-3.5 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              className="w-full"
              onClick={addObjective}
              size="sm"
              type="button"
              variant="outline"
            >
              <PlusIcon className="size-3.5 mr-1" />
              เพิ่มวัตถุประสงค์
            </Button>
          </div>
        </div>
      )} */}
    </div>
  )
}
