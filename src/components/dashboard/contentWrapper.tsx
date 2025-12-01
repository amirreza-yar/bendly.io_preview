import { cn } from '@/utilities/ui'
import React from 'react'

type ContentWrapperProps = {
  className?: string
  children: React.ReactNode
}

export function ContentWrapper({ className, children }: ContentWrapperProps) {
  return (
    <section
      className={cn(
        'overflow-scroll h-full b-0 pt-18 pb-20 px-4 no-scrollbar min-h-screen md:max-w-[1000px] md:mx-auto md:px-4 md:border-r md:border-l md:border-gray-200',
        className,
      )}
    >
      {children}
    </section>
  )
}
