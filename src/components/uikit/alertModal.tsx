'use client'

import { Button } from '@/components/uikit/buttons/button'
import { XIcon } from './icons'
import { cva } from 'class-variance-authority'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { cn } from '@/utilities/ui'

interface AlertDialogContentProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content> {}

function AlertDialogContent({ className, ...props }: AlertDialogContentProps) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out ' +
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
            'fixed inset-0 z-50 backdrop-blur-md',
          className,
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out ' +
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ' +
            'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ' +
            'fixed top-[50%] left-[50%] z-50 grid w-[90%] translate-x-[-50%] translate-y-[-50%] ' +
            'gap-6 rounded-lg p-6 shadow-lg duration-200 sm:-lg shadow-md',
          className,
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  )
}

const buttonAlignVariants = cva('', {
  variants: {
    alignmentVariant: {
      stacked: 'flex flex-col gap-4 sm:flex-row sm:justify-end',
      justify: 'flex flex-row gap-4 justify-center [&_button]:grow',
      right: 'flex flex-row gap-4 justify-end',
    },
  },
  defaultVariants: {
    alignmentVariant: 'stacked',
  },
})

export interface AlertModalProps
  extends React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Root> {
  title: string
  description?: string
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  alignmentVariant?: 'stacked' | 'justify' | 'right'
  cancelButtonText?: string
  actionButtonText?: string
  onCancleButtonVariant?: 'default' | 'secondary' | 'ghost'
  actionButtonClassName?: string
  dismissible?: boolean
  onAction?: () => void
  onCancle?: () => void
  defaultOpen?: boolean
}

export function AlertModal({
  title,
  description,
  icon: Icon,
  alignmentVariant = 'stacked',
  cancelButtonText,
  actionButtonText = 'Confirm',
  onCancleButtonVariant = 'secondary',
  actionButtonClassName,
  dismissible = false,
  onAction,
  onCancle,
  onOpenChange,
  children,
  defaultOpen = false,
  ...props
}: AlertModalProps) {
  return (
    <AlertDialogPrimitive.Root
      {...props}
      data-slot="alert-dialog"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        {children}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          {dismissible && (
            <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
              <XIcon className="text-neutral-dark" />
            </AlertDialogPrimitive.Cancel>
          )}
          {Icon && <Icon />}
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-sm/[19px] font-semibold"
          >
            {title}
          </AlertDialogPrimitive.Title>
          {description && (
            <AlertDialogPrimitive.Description
              data-slot="alert-dialog-description"
              className="text-muted-foreground text-sm"
            >
              {description}
            </AlertDialogPrimitive.Description>
          )}
        </div>
        <div
          data-slot="alert-dialog-footer"
          className={cn(buttonAlignVariants({ alignmentVariant }))}
        >
          <AlertDialogPrimitive.Action asChild>
            <Button className={actionButtonClassName} onClick={onAction}>
              {actionButtonText}
            </Button>
          </AlertDialogPrimitive.Action>

          {cancelButtonText && (
            <AlertDialogPrimitive.Cancel asChild>
              <Button variant={onCancleButtonVariant} onClick={onCancle}>
                {cancelButtonText}
              </Button>
            </AlertDialogPrimitive.Cancel>
          )}
        </div>
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  )
}
