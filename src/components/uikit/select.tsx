'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown, ChevronUp, Info } from '@/components/uikit/icons'
import { ReactNode } from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/utilities/ui'

type SelectValue = 'PE' | 'IP' | 'RFP' | 'SI' | 'CO' | 'RE' | string

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
  children?: ReactNode
  className?: string
  borderless?: boolean // ✅ new prop
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
  children,
  className,
  borderless,
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
        <div className="flex items-center gap-1 mb-2">
          <p className="label-regular text-neutral-dark">{label}</p>
          {required && <p className="text-sm font-medium text-red-500">*</p>}
        </div>
      )}
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        className={cn(
          'text-xs flex items-center justify-between gap-2 rounded-md px-3 transition-[color,box-shadow] disabled:cursor-not-allowed h-11 w-full',
          borderless
            ? 'border-none outline-none shadow-none focus:ring-0 focus:outline-none'
            : `${error ? 'border-border-attention' : 'border-border-default'} border-2 focus:border-primary`,
          className,
        )}
      >
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

export const badgeSelectColors = cva(
  'bg-[#FCEAD8] text-[#B43B1A] label-small flex items-center justify-between gap-1 rounded-full px-2.5 transition-[color,box-shadow] h-5.5 w-fit',
  {
    variants: {
      variant: {
        green: 'bg-surface-success-subtle text-success-dark',
        orange: 'bg-surface-alert-subtle text-alert-dark',
        red: 'bg-surface-attention-subtle text-attention-dark',
        blue: 'bg-surface-info-subtle text-[#141EE1]',
        gray: 'bg-slate-light text-body',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  },
)

export function BadgeSelect({
  items,
  onValueChange,
  value,
  defaultValue,
  variant,
  ...props
}: {
  items: SelectItem[]
  placeholder?: string
  onValueChange?: (value: string) => void
  value?: string
  defaultValue?: string
  helpText?: any
  label?: string
  error?: boolean // <-- corrected
  required?: boolean // <-- corrected
  variant?: 'green' | 'orange' | 'red' | 'blue' | 'gray'
}) {
  return (
    <SelectPrimitive.Root
      defaultValue={defaultValue}
      value={value}
      onValueChange={onValueChange}
      {...props}
    >
      <SelectPrimitive.Trigger
        data-slot="select-trigger"
        data-size="default"
        className={cn(badgeSelectColors({ variant }))}
        {...props}
      >
        <SelectPrimitive.Value data-slot="select-value" className="text-black" />
        <SelectPrimitive.Icon asChild>
          <ChevronDown className="size-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          data-slot="select-content"
          className="bg-white text-body data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-[var(--radix-select-content-available-height)] min-w-[8rem] origin-[var(--radix-select-content-transform-origin)] overflow-x-hidden overflow-y-auto rounded-md border-2 border-border-default shadow-md data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1"
          position="popper"
        >
          <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className="flex cursor-default items-center justify-center py-1"
          >
            <ChevronUp className="size-4" />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="p-1 h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1">
            {items.map((item) => (
              <SelectPrimitive.Item
                key={item.value}
                value={item.value}
                data-slot="select-item"
                className="focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 body-small outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2"
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
          <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className="flex cursor-default items-center justify-center py-1"
          >
            <ChevronDown className="size-4" />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}
