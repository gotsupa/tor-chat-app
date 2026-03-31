import { ArrowLeftIcon } from 'lucide-react'
import Link from 'next/link'

import { ThemeSelect } from '@/components/shared/theme-select'
import { Button } from '@/components/ui/button'

interface PageHeaderProps {
  backHref?: string
  children?: React.ReactNode
  description?: string
  title: string
}

export function PageHeader({
  backHref = '/',
  children,
  description,
  title,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-border/50 px-3 py-2 md:gap-3 md:px-4 md:py-3">
      <Button
        aria-label="กลับ"
        nativeButton={false}
        render={<Link href={backHref} />}
        size="icon-sm"
        variant="ghost"
      >
        <ArrowLeftIcon className="size-4" />
      </Button>
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold truncate">{title}</h1>
        {description && (
          <p className="text-xs text-muted-foreground truncate">
            {description}
          </p>
        )}
      </div>
      {children}
      <ThemeSelect />
    </div>
  )
}
