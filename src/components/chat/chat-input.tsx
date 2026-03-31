'use client'

import { PaperclipIcon, SendIcon } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ChatInputProps {
  disabled?: boolean
  onAttach: () => void
  onSend: (message: string) => void
}

export function ChatInput({ disabled, onAttach, onSend }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }, [value, disabled, onSend])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend]
  )

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setValue(e.target.value)
      // Auto-grow textarea
      const el = e.target
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`
    },
    []
  )

  return (
    <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
      <div className="mx-auto flex max-w-3xl items-center gap-2">
        <Button
          aria-label="แนบไฟล์ PDF"
          className="shrink-0"
          disabled={disabled}
          onClick={onAttach}
          size="icon-sm"
          variant="ghost"
        >
          <PaperclipIcon className="size-4" />
        </Button>

        <div className="relative flex-1">
          <Textarea
            className={cn(
              'min-h-[40px] max-h-[160px] resize-none rounded-xl border-border/50 bg-card pr-12',
              'focus-visible:ring-1 focus-visible:ring-primary/50'
            )}
            disabled={disabled}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="พิมพ์คำถาม…"
            ref={textareaRef}
            rows={1}
            value={value}
          />
        </div>

        <Button
          aria-label="ส่งข้อความ"
          className={cn(
            'shrink-0 transition-all',
            value.trim()
              ? 'bg-primary hover:bg-primary/90'
              : 'bg-muted text-muted-foreground'
          )}
          disabled={disabled || !value.trim()}
          onClick={handleSend}
          size="icon-sm"
        >
          <SendIcon className="size-4" />
        </Button>
      </div>
    </div>
  )
}
