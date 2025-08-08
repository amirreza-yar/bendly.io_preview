import React from 'react'

export function Footer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed bottom-0 left-0 w-full h-19 z-10 bg-white border-t-1 border-border-dark px-4">
      <div className="w-full h-full">
        <div className="flex justify-around items-center h-full">{children}</div>
      </div>
    </div>
  )
}
