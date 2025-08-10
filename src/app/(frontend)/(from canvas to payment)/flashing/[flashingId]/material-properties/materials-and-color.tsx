'use client'
import { CardChecked } from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import { useState } from 'react'
export function Materials() {
  const materials = ['Stainless Steel', 'Colorbond', 'Lead', 'Copper']

  const [activeMaterial, setActiveMaterial] = useState('')

  return (
    <div className="flex flex-wrap gap-2 pt-4">
      {materials.map((material, index) => (
        <div
          className={cn(
            'py-4 px-3 rounded-md border-1 caption-regular',
            activeMaterial === material
              ? 'border-border-success bg-[#CCEBD6]'
              : 'border-border-default',
          )}
          key={index}
          onClick={() => setActiveMaterial(material)}
        >
          {material}
        </div>
      ))}
    </div>
  )
}

export function Colors() {
  const colors = [
    { name: 'Southerly', color: '#D2D1CB' },
    { name: 'Shale Gray', color: '#BDBFBA' },
    { name: 'Bluegum', color: '#959698' },
    { name: 'Dover White', color: '#F9FBF2' },
  ]

  const [activeColor, setActiveColor] = useState('')

  return (
    <div className="grid grid-cols-3 gap-2 pt-4">
      {colors.map((color, index) => (
        <div
          className={cn(
            'p-1 rounded-md flex flex-col items-center justify-between h-29 relative',
            activeColor === color.name
              ? 'border-2 border-border-success'
              : 'border-1 border-border-default',
          )}
          key={index}
          onClick={() => setActiveColor(color.name)}
        >
          {activeColor === color.name && <CardChecked className="absolute right-[6px]" />}
          <div className={`rounded-md h-15 w-full bg-[${color.color}]`}></div>
          <span className="caption-regular pb-4">{color.name}</span>
        </div>
      ))}
    </div>
  )
}
