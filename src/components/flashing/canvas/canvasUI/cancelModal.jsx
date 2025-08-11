// components/CancelResizingModal.jsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { AlertModal } from "@/components/uikit/alertModal";

export default function CancelModal({ onApply, onDiscard, children, onOpenChange, ...prop }) {
  return (
    <AlertModal
      title="Discard changes?"
      description="You haven't applied your changes yet. If you cancel now, these
              modifications will be lost."
      actionButtonText="Apply changes"
      cancelButtonText="Discard changes"
      dismissible
      onAction={onApply}
      onCancle={onDiscard}
      onOpenChange={onOpenChange}
      {...prop}
    >
      {children}
    </AlertModal>
  );
}

{
  /* <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:-[425px]">
          <DialogHeader>
            <DialogTitle>Discard changes?</DialogTitle>
            <DialogDescription>
              You haven't applied your changes yet. If you cancel now, these
              modifications will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2">
            <Button onClick={onApply}>Apply changes</Button>
            <Button variant="outline" onClick={onDiscard}>
              Discard changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */
}
