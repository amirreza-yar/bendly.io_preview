import { cn } from '@/utilities/ui'
import React from 'react'

export function Footer({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-gray-300 px-4 max-w-[1000px] md:left-1/2 md:-translate-x-1/2 text-center',
        className,
      )}
    >
      <div className="w-full h-full">
        <div className="flex justify-around items-center h-full">{children}</div>
      </div>
    </div>
  )
}
