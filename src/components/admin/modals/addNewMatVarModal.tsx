'use client'
import { Button } from '@/components/uikit/buttons/button'
import { XIcon } from '@/components/uikit/icons'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import AddNewMaterialVarForm, { NewVairantFormValues } from '../forms/addNewMatVarForm'

export default function AddNewMaterialVarModal({
  isAddNewVarModalOpen,
  setIsAddNewVarModalOpen,
  onNewVariantFormSubmit,
}: {
  isAddNewVarModalOpen: boolean
  setIsAddNewVarModalOpen: (val: boolean) => void
  onNewVariantFormSubmit: (data: NewVairantFormValues) => void
}) {
  return (
    <>
      <DialogPrimitive.Root open={isAddNewVarModalOpen} data-slot="alert-dialog">
        <AlertDialogContent className="font-roboto w-100">
          <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
            <DialogPrimitive.Cancel
              onClick={() => {
                setIsAddNewVarModalOpen(false)
              }}
              className="absolute top-4 end-4 [&_svg:not([class*='size-'])]:size-6"
            >
              <XIcon className="text-neutral-dark" variant="secondary" />
            </DialogPrimitive.Cancel>
            <DialogPrimitive.Title
              data-slot="alert-dialog-title"
              className="text-sm/[19px] font-semibold"
            >
              Add new material variant
            </DialogPrimitive.Title>
            <DialogPrimitive.Description
              data-slot="alert-dialog-description"
              className="text-muted-foreground subtitle-regular"
            >
              Add new color variants for this material.
            </DialogPrimitive.Description>
          </div>

          <AddNewMaterialVarForm onNewVariantFormSubmit={onNewVariantFormSubmit} />

          <div
            data-slot="alert-dialog-footer"
            className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
          >
            <DialogPrimitive.Action asChild>
              <Button
                type="submit"
                form="new-variant-form"
                // onClick={() => setIsAddNewVarModalOpen(false)}
              >
                Add Variant
              </Button>
            </DialogPrimitive.Action>

            <DialogPrimitive.Cancel asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddNewVarModalOpen(false)
                }}
              >
                Discard
              </Button>
            </DialogPrimitive.Cancel>
          </div>
        </AlertDialogContent>
      </DialogPrimitive.Root>
    </>
  )
}
