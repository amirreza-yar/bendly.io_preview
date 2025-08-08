import { cn } from '@/utilities/ui'
import React from 'react'

type ContentWrapperProps = {
  className?: string
  children: React.ReactNode
}

export function ContentWrapper({ className, children }: ContentWrapperProps) {
  return (
    <section className={cn('overflow-scroll h-full b-0 pt-14 pb-20 px-4 no-scrollbar', className)}>
      {children}
    </section>
  )
}
