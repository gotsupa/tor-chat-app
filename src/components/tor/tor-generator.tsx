'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeftIcon, FileTextIcon } from 'lucide-react'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import type { TorFields, TorType } from '@/lib/types'

import { PageHeader } from '@/components/shared/page-header'
import { PdfPreview } from '@/components/shared/pdf-preview'
import { PdfUploadStep } from '@/components/tor/pdf-upload-step'
import { TorDownload } from '@/components/tor/tor-download'
import { TorForm } from '@/components/tor/tor-form'
import { Button } from '@/components/ui/button'
import EQUIPMENT_MOCK from '@/lib/mock/equipment-procurement.json'
import { torFieldsSchema } from '@/lib/types'

type Step = 'download' | 'form' | 'upload'

const DEFAULT_VALUES: TorFields = {
  budget: '',
  conditions: '',
  duration: '',
  objective: '',
  projectName: '',
  qualifications: '',
  scope: '',
}

/** Pre-filled mock for equipment_procurement — remove for production */
const DEV_MOCK_VALUES: TorFields = EQUIPMENT_MOCK as unknown as TorFields

export function TorGenerator() {
  const [step, setStep] = useState<Step>('upload')
  const [file, setFile] = useState<File | null>(null)
  const [torType, setTorType] = useState<'' | TorType>('')
  const [confidence, setConfidence] = useState(0)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const [downloadUrl, setDownloadUrl] = useState<null | string>(null)

  const form = useForm<TorFields>({
    defaultValues: DEV_MOCK_VALUES,
    resolver: zodResolver(torFieldsSchema),
  })

  // Step 1 → Step 2: Extract fields from PDF
  const handleExtract = useCallback(async () => {
    if (!file || !torType) return

    setIsExtracting(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('tor_type', torType)

      const res = await fetch('/api/tor/extract', {
        body: formData,
        method: 'POST',
      })

      if (!res.ok) throw new Error('Extract failed')
      const data = await res.json()

      const extractedFields = data.fields || DEFAULT_VALUES
      form.reset(extractedFields)
      setConfidence(data.confidence || 0)
      setStep('form')
      toast.success('วิเคราะห์เอกสารสำเร็จ')
    } catch {
      toast.error('วิเคราะห์เอกสารผิดพลาด กรุณาลองใหม่')
    } finally {
      setIsExtracting(false)
    }
  }, [file, torType, form])

  // Step 2 → Step 3: Generate TOR document
  const handleGenerate = useCallback(
    async (fields: TorFields) => {
      if (!torType) return

      setStep('download')
      setIsGenerating(true)
      setDownloadSuccess(false)

      try {
        const res = await fetch('/api/tor/generate', {
          body: JSON.stringify({ fields, torType }),
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
        })

        if (!res.ok) throw new Error('Generate failed')
        const data = await res.blob()

        // Create download URL from blob
        const url = URL.createObjectURL(data)
        setDownloadUrl(url)
        setDownloadSuccess(true)
        toast.success('สร้างเอกสาร TOR สำเร็จ')

        // Auto-download
        triggerDownload(url, `TOR_${fields.projectName || 'document'}.docx`)
      } catch {
        toast.error('สร้างเอกสารผิดพลาด กรุณาลองใหม่')
        setStep('form')
      } finally {
        setIsGenerating(false)
      }
    },
    [torType]
  )

  // Trigger file download
  const triggerDownload = (url: string, filename: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  // Manual download
  const handleDownload = useCallback(() => {
    if (downloadUrl) {
      const projectName = form.getValues('projectName')
      triggerDownload(downloadUrl, `TOR_${projectName || 'document'}.docx`)
    }
  }, [downloadUrl, form])

  // Reset everything
  const handleStartOver = useCallback(() => {
    setStep('upload')
    setFile(null)
    setTorType('')
    form.reset(DEFAULT_VALUES)
    setConfidence(0)
    setDownloadSuccess(false)
    if (downloadUrl) {
      URL.revokeObjectURL(downloadUrl)
      setDownloadUrl(null)
    }
  }, [downloadUrl, form])

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <PageHeader
        description="อัปโหลด PDF → AI ดึงข้อมูล → สร้างเอกสาร TOR"
        title="TOR Generator"
      >
        {step !== 'upload' && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <FileTextIcon className="size-3.5" />
            {file?.name}
          </div>
        )}
      </PageHeader>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div
          className={`mx-auto px-4 py-5 md:py-8 ${
            step === 'form' ? 'max-w-6xl' : 'max-w-2xl'
          }`}
        >
          {/* Step Indicator */}
          <div className="mb-5 flex items-center gap-2 md:mb-8">
            {(['upload', 'form', 'download'] as Step[]).map((s, i) => (
              <div className="flex items-center gap-2" key={s}>
                <div
                  className={`flex size-2 rounded-full transition-colors ${
                    step === s
                      ? 'bg-primary'
                      : i < ['upload', 'form', 'download'].indexOf(step)
                        ? 'bg-primary/50'
                        : 'bg-muted'
                  }`}
                />
                {i < 2 && (
                  <div
                    className={`h-px w-8 transition-colors ${
                      i < ['upload', 'form', 'download'].indexOf(step)
                        ? 'bg-primary/50'
                        : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Steps */}
          {step === 'upload' && (
            <PdfUploadStep
              file={file}
              isExtracting={isExtracting}
              onExtract={handleExtract}
              onFileChange={setFile}
              onTorTypeChange={setTorType}
              torType={torType}
            />
          )}

          {step === 'form' && torType && (
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(handleGenerate)}>
                <div className="flex flex-col gap-6 lg:flex-row">
                  {/* PDF Preview — sticky left panel */}
                  {file && (
                    <div className="sticky top-0 lg:w-1/2 lg:self-start">
                      <div className="h-[40vh] lg:h-[calc(100vh-12rem)]">
                        <PdfPreview file={file} />
                      </div>
                    </div>
                  )}

                  {/* Form — scrollable right panel */}
                  <div className={file ? 'lg:w-1/2' : 'w-full'}>
                    <TorForm
                      confidence={confidence}
                      torType={torType as TorType}
                    />
                    <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
                      <Button
                        className="gap-2"
                        onClick={() => setStep('upload')}
                        type="button"
                        variant="outline"
                      >
                        <ArrowLeftIcon className="size-4" />
                        ย้อนกลับ
                      </Button>
                      <Button className="flex-1 gap-2" size="lg" type="submit">
                        <FileTextIcon className="size-4" />
                        สร้าง TOR
                      </Button>
                    </div>
                  </div>
                </div>
              </form>
            </FormProvider>
          )}

          {step === 'download' && (
            <TorDownload
              isGenerating={isGenerating}
              onDownload={handleDownload}
              onStartOver={handleStartOver}
              success={downloadSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}
