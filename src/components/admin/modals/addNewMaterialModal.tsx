'use client'
import { Button } from '@/components/uikit/buttons/button'
import { XIcon } from '@/components/uikit/icons'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import AddNewMaterialVarForm, { NewVairantFormValues } from '../forms/addNewMatVarForm'
import EditMaterialForm, { EditMaterialFormValues } from '../forms/editMaterialForm'
import AddNewMaterialForm, { AddNewMaterialFormValues } from '../forms/addNewMaterialForm'

export default function AddNewMaterialModal({
  isAddNewMaterialModalOpen,
  setIsAddNewMaterialModalOpen,
  onAddNewMaterialFormSubmit,
}: {
  isAddNewMaterialModalOpen: boolean
  setIsAddNewMaterialModalOpen: (val: boolean) => void
  onAddNewMaterialFormSubmit: (data: AddNewMaterialFormValues) => void
}) {
  return (
    <>
      <DialogPrimitive.Root open={isAddNewMaterialModalOpen} data-slot="alert-dialog">
        <AlertDialogContent className="font-roboto max-w-[1000px] lg:w-[70vw] w-[90vw] max-h-[90vh] pt-0">
          <div data-slot="alert-dialog-header" className="flex flex-col gap-4">
            <DialogPrimitive.Title
              data-slot="alert-dialog-title"
              className="text-sm/[19px] font-semibold hidden"
            ></DialogPrimitive.Title>
          </div>

          <AddNewMaterialForm onAddNewMaterialFormSubmit={onAddNewMaterialFormSubmit} />

          <div
            data-slot="alert-dialog-footer"
            className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
          >
            <DialogPrimitive.Action asChild>
              <Button
                type="submit"
                form="edit-material-form"
                // onClick={() => setIsAddNewMaterialModalOpen(false)}
              >
                Submit Changes
              </Button>
            </DialogPrimitive.Action>

            <DialogPrimitive.Cancel asChild>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsAddNewMaterialModalOpen(false)
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
