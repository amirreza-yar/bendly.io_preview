'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utilities/ui'

// Tailwind variant styles
const buttonVariants = cva('button_style', {
  variants: {
    variant: {
      default: 'button_style_default',
      secondary: 'button_style_secondary',
      ghost: 'button_style_ghost',
    },
    size: {
      default: 'px-4 py-0 h-9 font-roboto text-[14px] font-semibold',
      large: 'px-4 py-0 h-11 font-roboto text-[14px]/[19px] font-semibold',
      // Extend sizes as needed
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'large',
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
