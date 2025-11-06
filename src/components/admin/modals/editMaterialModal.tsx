'use client'
import { Button } from '@/components/uikit/buttons/button'
import { XIcon } from '@/components/uikit/icons'
import * as DialogPrimitive from '@radix-ui/react-alert-dialog'
import { AlertDialogContent } from '@/components/uikit/alertModal'
import AddNewMaterialVarForm, { NewVairantFormValues } from '../forms/addNewMatVarForm'
import EditMaterialForm, { EditMaterialFormValues } from '../forms/editMaterialForm'

export default function EditMaterialModal({
  isEditMaterialModalOpen,
  setIsEditMaterialModalOpen,
  onEditMaterialFormSubmit,
  materialDetails,
}: {
  isEditMaterialModalOpen: boolean
  setIsEditMaterialModalOpen: (val: boolean) => void
  onEditMaterialFormSubmit: (data: EditMaterialFormValues) => void
  materialDetails: any
}) {
  return (
    <>
      <DialogPrimitive.Root open={isEditMaterialModalOpen} data-slot="alert-dialog">
        <AlertDialogContent className="font-roboto max-w-[870px] lg:w-[70vw] w-[90vw] max-h-[90vh] p-0">
          <div data-slot="alert-dialog-header" className="hidden">
            <DialogPrimitive.Title
              data-slot="alert-dialog-title"
              className="text-sm/[19px] font-semibold hidden"
            ></DialogPrimitive.Title>
          </div>

          <EditMaterialForm
            materialDetails={materialDetails}
            onEditMaterialFormSubmit={onEditMaterialFormSubmit}
            setIsEditMaterialModalOpen={setIsEditMaterialModalOpen}
          />
        </AlertDialogContent>
      </DialogPrimitive.Root>
    </>
  )
}
