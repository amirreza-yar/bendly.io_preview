import { Drawer, DrawerClose } from '@/components/uikit/drawer'
import { ReactNode } from 'react'
import { Edit, TransferHorizontaly, XIcon } from '@/components/uikit/icons'
import { Separator } from '@/components/uikit/separator'

export function EditFlashingDrawer({ flashingId }: { flashingId: string }): ReactNode {
  return (
    <Drawer trigger={<Edit />}>
      <div className="flex flex-col p-6">
        <div className="flex justify-between pb-6">
          <h6>Choose your edit option</h6>
          <DrawerClose asChild>
            <XIcon className="size-6" />
          </DrawerClose>
        </div>
        <a
          href={`/f/${flashingId}/preview/edit-canvas`}
          className="flex items-center gap-4 p-4 h-16"
        >
          <Edit />
          <span className="label-regular">Edit drawing</span>
        </a>
        <div className="w-full px-4">
          <Separator className="" />
        </div>
        <a
          href={`/f/${flashingId}/preview/edit-color-side?return=preview`}
          className="flex items-center gap-4 p-4 h-16"
        >
          <TransferHorizontaly />
          <span className="label-regular">Edit color side</span>
        </a>
        <div className="w-full px-4">
          <Separator className="" />
        </div>
      </div>
    </Drawer>
  )
}
