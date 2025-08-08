'use client'

import React from 'react'

interface ViewToggleProps<T extends string> {
  modes: readonly T[]
  view: T
  onChange: (view: T) => void
}

export const ViewToggle = <T extends string>({ modes, view, onChange }: ViewToggleProps<T>) => {
  return (
    <div className="inline-flex rounded-xs border-border-dark border overflow-hidden text-sm p-[2px]">
      {modes.map((mode) => (
        <button
          key={mode}
          type="button"
          onClick={() => onChange(mode)}
          className={`rounded-2xs p-1 font-medium transition ${
            view === mode ? 'bg-primary text-white' : 'bg-nuteral text-body'
          }`}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
