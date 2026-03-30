'use client'

import { Loader2Icon, SearchIcon } from 'lucide-react'

import type { TorType } from '@/lib/types'

import { PdfDropzone } from '@/components/shared/pdf-dropzone'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { TOR_TYPES } from '@/lib/types'

interface PdfUploadStepProps {
  file: File | null
  isExtracting: boolean
  onExtract: () => void
  onFileChange: (file: File | null) => void
  onTorTypeChange: (type: TorType) => void
  torType: '' | TorType
}

export function PdfUploadStep({
  file,
  isExtracting,
  onExtract,
  onFileChange,
  onTorTypeChange,
  torType,
}: PdfUploadStepProps) {
  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="flex size-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            1
          </span>
          <h2 className="text-lg font-semibold">อัปโหลดเอกสาร</h2>
        </div>
        <p className="text-sm text-muted-foreground ml-8">
          อัปโหลดไฟล์ PDF รายละเอียดโครงการ แล้วเลือกประเภท TOR ที่ต้องการ
        </p>
      </div>

      {/* PDF Upload */}
      <PdfDropzone
        disabled={isExtracting}
        file={file}
        isUploading={isExtracting}
        onFileChange={onFileChange}
      />

      {/* TOR Type Select */}
      <div className="space-y-2">
        <Label>ประเภท TOR</Label>
        <Select
          disabled={isExtracting}
          onValueChange={(v) => onTorTypeChange(v as TorType)}
          value={torType || undefined}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกประเภท TOR">
              {(value: null | string) =>
                value ? (
                  (TOR_TYPES.find((t) => t.value === value)?.label ?? value)
                ) : (
                  <span className="text-muted-foreground">เลือกประเภท TOR</span>
                )
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="p-1">
            {TOR_TYPES.map((type) => (
              <SelectItem
                key={type.value}
                label={type.label}
                value={type.value}
              >
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Extract Button */}
      <Button
        className="w-full gap-2"
        disabled={!file || !torType || isExtracting}
        onClick={onExtract}
        size="lg"
      >
        {isExtracting ? (
          <>
            <Loader2Icon className="size-4 animate-spin" />
            AI กำลังวิเคราะห์เอกสาร…
          </>
        ) : (
          <>
            <SearchIcon className="size-4" />
            วิเคราะห์เอกสาร
          </>
        )}
      </Button>
    </div>
  )
}
