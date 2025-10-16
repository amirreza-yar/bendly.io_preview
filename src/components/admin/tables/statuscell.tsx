'use client'

import * as React from 'react'
import { ChevronDown, Check, ChevronUp } from '@/components/uikit/icons'
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from '@/utilities/ui'

export type StatusValue = 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE'

export type StatusItem = {
  value: StatusValue
  label: string
}

interface StatusCellProps {
  value: StatusValue
  onChange: (value: StatusValue) => void
  items: StatusItem[]
}

function getStatusLabel(status: StatusValue): string {
  const map: Record<StatusValue, string> = {
    PE: 'Pending',
    IP: 'In Production',
    RFP: 'Ready for pickup',
    SI: 'Shipped',
    CO: 'Completed',
    RE: 'Rejected',
  }
  return map[status]
}

function getStatusColors(status: StatusValue) {
  const variants: Record<StatusValue, string> = {
    PE: 'bg-surface-warning-subtle text-warning-dark',
    IP: 'bg-surface-info-subtle text-info-dark',
    RFP: 'bg-surface-alert-subtle text-alert-dark',
    SI: 'bg-surface-info-subtle text-[#141EE1]',
    CO: 'bg-surface-success-subtle text-success-dark',
    RE: 'bg-surface-attention-subtle text-attention-dark',
  }
  return variants[status] || 'bg-gray-100 text-gray-800'
}

export function StatusCell({ value, onChange, items }: StatusCellProps) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onChange}>
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(
          'flex items-center gap-1 rounded-full px-3 py-1 h-6 w-fit border-none cursor-pointer select-none text-xs font-medium',
          getStatusColors(value),
        )}
      >
        <SelectPrimitive.Value>
          <span className="capitalize">{getStatusLabel(value)}</span>
        </SelectPrimitive.Value>
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="h-3.5 w-3.5 opacity-70" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          className="bg-white text-body relative z-50 rounded-md border-2 border-border-default shadow-md min-w-[8rem] overflow-y-auto"
        >
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>

          <SelectPrimitive.Viewport className="p-1">
            {items.map((item) => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-pointer items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none"
              >
                <span className="absolute right-2 flex size-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="size-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>{item.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>

          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center py-1">
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
