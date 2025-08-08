'use client'
import { Button } from '@/components/uikit/buttons/button'
import { XIcon } from './icons'
import { cva } from 'class-variance-authority'

import * as React from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

import { cn } from '@/utilities/ui'

function DeleteDialogContent({ className = '', ...props }) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-sm',
          className,
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          'bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full -[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-6 rounded-lg px-6 pt-xl pb-l shadow-lg duration-200 sm:-lg shadown-md',
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

interface DeleteModalProps {
  title: string
  description: string
  icon?: React.ElementType
  alignmentVariant?: 'stacked' | 'justify' | 'right'
  cancelButtonText?: React.ReactNode
  actionButtonText?: string
  dismissible?: boolean
  onAction?: () => void
  onCancle?: () => void
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
  defaultOpen?: boolean
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  description,
  icon: Icon,
  alignmentVariant = 'stacked',
  cancelButtonText,
  actionButtonText = 'Confirm',
  dismissible = false,
  onAction = () => {},
  onCancle = () => {},
  onOpenChange,
  children,
  defaultOpen = false,
}) => {
  return (
    <AlertDialogPrimitive.Root
      data-slot="alert-dialog"
      // trapFocus="true"
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        {children}
      </AlertDialogPrimitive.Trigger>
      <DeleteDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          {dismissible && (
            <AlertDialogPrimitive.Cancel className="text-neutral-dark absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
              <XIcon />
            </AlertDialogPrimitive.Cancel>
          )}
          {Icon && <Icon />}
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-smd font-semibold"
          >
            {title}
          </AlertDialogPrimitive.Title>
          {description && (
            <AlertDialogPrimitive.Description
              data-slot="alert-dialog-description"
              className="font-regular text-xs-r text-body"
            >
              {description}
            </AlertDialogPrimitive.Description>
          )}
        </div>
        <div
          data-slot="alert-dialog-footer"
          className={cn(buttonAlignVariants({ alignmentVariant }))}
        >
          {cancelButtonText && (
            <AlertDialogPrimitive.Cancel asChild>
              <Button size="sm" className="" variant="ghost" onClick={onCancle}>
                {cancelButtonText}
              </Button>
            </AlertDialogPrimitive.Cancel>
          )}

          <AlertDialogPrimitive.Action asChild>
            <Button size="sm" className="" onClick={onAction} variant="ghost">
              {actionButtonText}
            </Button>
          </AlertDialogPrimitive.Action>
        </div>
      </DeleteDialogContent>
    </AlertDialogPrimitive.Root>
  )
}
