import { ReactNode } from 'react'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { ArrowLeft, XIcon } from '@/components/uikit/icons'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import { Button } from '@/components/uikit/buttons/button'

export const UnsavedChangesOnDetailsModal = ({
  children,
  onDiscardChanges,
  onSaveChanges,
}: {
  children: ReactNode
  onDiscardChanges: () => void
  onSaveChanges: () => void
}) => {
  return (
    <AlertDialogPrimitive.Root data-slot="alert-dialog">
      <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
        {children}
      </AlertDialogPrimitive.Trigger>
      <AlertDialogContent className="font-roboto">
        <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
          <AlertDialogPrimitive.Cancel className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6">
            <XIcon className="text-neutral-dark" variant="secondary" />
          </AlertDialogPrimitive.Cancel>
          <AlertDialogPrimitive.Title
            data-slot="alert-dialog-title"
            className="text-sm/[19px] font-semibold"
          >
            Unsaved Chnages
          </AlertDialogPrimitive.Title>

          <AlertDialogPrimitive.Description
            data-slot="alert-dialog-description"
            className="text-muted-foreground text-sm"
          >
            You have made changes that have not been saved. If you go back now, they will be lost.
          </AlertDialogPrimitive.Description>
        </div>
        <div
          data-slot="alert-dialog-footer"
          className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
        >
          <AlertDialogPrimitive.Action asChild>
            <Button onClick={onSaveChanges}>Save & Go Back</Button>
          </AlertDialogPrimitive.Action>

          <AlertDialogPrimitive.Cancel asChild>
            <Button variant="secondary" onClick={onDiscardChanges}>
              Discard Changes
            </Button>
          </AlertDialogPrimitive.Cancel>
        </div>
      </AlertDialogContent>
    </AlertDialogPrimitive.Root>
  )
}
