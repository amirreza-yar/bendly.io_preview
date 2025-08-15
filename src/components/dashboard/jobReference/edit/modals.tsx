'use client'
import { Button } from '@/components/uikit/buttons/button'
import { Delete, XIcon } from '@/components/uikit/icons'
import { cn } from '@/utilities/ui'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertModal } from '@/components/uikit/alertModal'
import { toast } from 'sonner'

function AlertDialogContent({ ...props }) {
  return (
    <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal">
      <AlertDialogPrimitive.Overlay
        data-slot="alert-dialog-overlay"
        className={cn(
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 backdrop-blur-md',
        )}
      />
      <AlertDialogPrimitive.Content
        data-slot="alert-dialog-content"
        className={cn(
          ' bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-[90%] -[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] rounded-lg p-6 shadow-lg duration-200 sm:-lg shadown-md',
        )}
        {...props}
      />
    </AlertDialogPrimitive.Portal>
  )
}

interface RemoveJobRefModalProps {
  trigger: React.ReactElement
  onJobRefDelete: (jobRefCode: number) => void
}

export function RemoveJobRefModal({ trigger, onJobRefDelete }: RemoveJobRefModalProps) {
  return (
    <AlertModal
      title="Are you sure you want to delete?"
      description="By deleting this Job Reference, you will permanently remove it and all associated
              addresses. This action cannot be undone."
      cancelButtonText="Cancel"
      actionButtonText="Delete"
      actionButtonClassName="bg-surface-attention"
      dismissible
      onAction={onJobRefDelete}
      onCancle={() => {}}
    >
      {trigger}
    </AlertModal>
  )
}

export function RemoveJobRefAddressModal({ trigger }: RemoveJobRefModalProps) {
  return (
    <>
      <AlertModal
        title="Delete This Address?"
        description="Are you sure you want to delete this address? This action cannot be undone."
        cancelButtonText="Cancel"
        actionButtonText="Delete"
        actionButtonClassName="bg-surface-attention"
        dismissible
        onAction={() => toast('Address Deleted')}
        onCancle={() => {}}
      >
        {trigger}
      </AlertModal>
    </>
  )
}
