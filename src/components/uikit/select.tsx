'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, Info } from '@/components/uikit/icons'
import { ReactNode } from 'react'

type SelectValue = 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE'

type SelectItem = {
  value: SelectValue
  label: string
}

type SelectProps = {
  items: SelectItem[]
  placeholder?: string
  onValueChange?: (value: SelectValue) => void
  value?: SelectValue
  defaultValue?: SelectValue
  helpText?: ReactNode
  label?: string
  error?: boolean
  required?: boolean
  children?: ReactNode // ✅ allow children
}

export function Select({
  items,
  placeholder,
  onValueChange,
  value,
  defaultValue,
  helpText,
  error,
  label,
  required,
  children, // ✅ include children
  ...props
}: SelectProps) {
  return (
    <SelectPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      {label && (
        <div className="flex items-center gap-1 mb-1">
          <p className="text-xs font-medium text-neutral-dark">{label}</p>
          {required && <p className="text-sm font-medium text-red-500">*</p>}
        </div>
      )}
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={`${error ? 'border-border-attention' : 'border-border-default'} border-2 text-sm data-[placeholder]:text-placeholder [&_svg:not([class*='text-'])]:text-muted-foreground focus:border-primary flex items-center justify-between gap-2 rounded-md px-3 transition-[color,box-shadow] disabled:cursor-not-allowed h-11 w-full`}
      >
        {/* ✅ Render children (custom display) OR fallback to default Value */}
        {children ? (
          children
        ) : (
          <>
            <SelectPrimitive.Value placeholder={placeholder} />
            <SelectPrimitive.Icon asChild>
              <ChevronDown className="size-4 opacity-50" />
            </SelectPrimitive.Icon>
          </>
        )}
      </SelectPrimitive.Trigger>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="popper"
          className="bg-white text-body relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border-2 border-border-default shadow-md"
        >
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center py-1">
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1">
            {items.map((item) => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                className="focus:bg-accent focus:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm select-none"
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

      {helpText && (
        <div
          className={`flex items-center gap-1 text-2xs ${
            error ? 'text-attention-default' : 'text-neutral-dark'
          }`}
        >
          <Info className="size-3" />
          <p>{helpText}</p>
        </div>
      )}
    </SelectPrimitive.Root>
  )
}
