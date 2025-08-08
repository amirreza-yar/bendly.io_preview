// components/CancelResizingModal.jsx
'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { AlertModal } from '@/components/uikit/alertModal'

export default function RemoveCrushFoldOnDrawingModal({ onApply, onDiscard, children, onOpenChange }) {
  return (
    <AlertModal
      title="This end is locked with Crush Fold"
      description="You’ve added a Crush Fold here. To move the Extender Node to this point, remove the Crush Fold first."
      actionButtonText="Cancel"
      cancelButtonText="Remove Crush Fold"
      dismissible
      onAction={onApply}
      onCancle={onDiscard}
      onOpenChange={onOpenChange}
      onCancleButtonVariant="ghost"
    >
      {children}
    </AlertModal>
  )
}
