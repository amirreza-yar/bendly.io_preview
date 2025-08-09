'use client'

import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/utilities/ui'

export type LabelProps = LabelPrimitive.LabelProps & {}

function Label({ className, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        '',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
