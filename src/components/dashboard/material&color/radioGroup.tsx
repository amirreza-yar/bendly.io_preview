'use client'

import React, { ComponentPropsWithoutRef, InputHTMLAttributes } from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/utilities/ui'
import { Interface } from 'readline'
import { CardChecked } from '@/components/uikit/icons'

interface RadioGroupProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  className?: string
}

function RadioGroup({ className, ...props }: RadioGroupProps) {
  return (
    <RadioGroupPrimitive.Root data-slot="radio-group" className={cn('', className)} {...props} />
  )
}

interface RadioGroupItemProps extends ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  className?: string
  children?: React.ReactNode
}

function RadioGroupItem({ className, children, ...props }: RadioGroupItemProps) {
  return (
    <RadioGroupPrimitive.Item data-slot="radio-group-item" className={cn('', className)} {...props}>
      {!children && (
        <RadioGroupIndicator />
      )}
      {children}
    </RadioGroupPrimitive.Item>
  )
}

function RadioGroupIndicator({
  className,
  children,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  value?: string
}) {
  return (
    <RadioGroupPrimitive.Indicator
      // value={value}
      data-slot="radio-group-indicator"
      className={cn(!children && 'absolute', className)}
      {...props}
    >
      {!children && <CardChecked />}
      {children}
    </RadioGroupPrimitive.Indicator>
  )
}

export { RadioGroup, RadioGroupItem, RadioGroupIndicator }
