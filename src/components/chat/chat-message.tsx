import { BotIcon, UserIcon } from 'lucide-react'

import type { ChatMessage as ChatMessageType } from '@/lib/types'

import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-message-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          isUser
            ? 'bg-primary/10'
            : 'bg-gradient-to-br from-violet-500/20 to-blue-500/20'
        )}
      >
        {isUser ? (
          <UserIcon className="size-4 text-primary" />
        ) : (
          <BotIcon className="size-4 text-violet-400" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-primary-foreground rounded-tr-md'
            : 'bg-card border border-border/50 rounded-tl-md'
        )}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-message-in">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20">
        <BotIcon className="size-4 text-violet-400" />
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-card border border-border/50 px-4 py-3">
        <span className="size-1.5 rounded-full bg-muted-foreground animate-typing-dot" />
        <span
          className="size-1.5 rounded-full bg-muted-foreground animate-typing-dot"
          style={{ animationDelay: '0.2s' }}
        />
        <span
          className="size-1.5 rounded-full bg-muted-foreground animate-typing-dot"
          style={{ animationDelay: '0.4s' }}
        />
      </div>
    </div>
  )
}
