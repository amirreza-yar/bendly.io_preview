'use client'
import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/uikit/buttons/button'
import { ArrowRight, Edit } from '@/components/uikit/icons'
import { Header } from '@/components/dashboard/header'
import { ViewToggle } from '@/components/uikit/viewToggle'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Separator } from '@/components/uikit/separator'
import Link from 'next/link'
import { Footer } from '@/components/dashboard/footer'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'
import { toast } from 'sonner'
import { UseFormReturn } from 'react-hook-form'
import PreviewCanvas from '@/components/flashing/preview/previewCanvas'
import { deleteFlashingById } from '@/lib/db/helpers/flashingHelpers'
import { EditFlashingDrawer } from '@/components/flashing/preview/drawers'
import {
  AddTemplateModal,
  DeleteFlashingModalOnPreview,
  TemplateFormValues,
} from '@/components/flashing/preview/modals'
import { addTemplate } from '@/lib/db/helpers/templateHelpers'

export default function PreviewPage() {
  const { flashingId } = useParams<{ flashingId: string }>()

  const router = useRouter()

  const flashing = useLiveQuery(() => db.flashings.get({ id: flashingId }), [flashingId], null)

  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState<boolean>(false)

  const [canvasView, setCanvasView] = useState<'2D' | '3D'>('2D')

  const [totalGirth, setTotalGirth] = useState<number>()

  const deleteFlashing = async () => {
    await deleteFlashingById(flashingId).then(() => {
      toast('The drawn flashing was removed.')
    })
  }

  const submitTemplate = async (
    data: TemplateFormValues,
    form: UseFormReturn<TemplateFormValues>,
  ) => {
    const error =
      flashing &&
      (await addTemplate({
        name: data.name,
        flashing: flashing,
        owner: 'user',
      }))

    if (error && error.name === 'ConstraintError') {
      form.setError('name', {
        type: 'manual',
        message: 'This name is already in use',
      })
    } else {
      toast('Drawing save as template')
      setIsTemplateModalOpen(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#EEE]">
      <Header title="preview" />

      <ContentWrapper className="pt-18">
        <div className="grid gap-4 bg-white p-4 rounded-md border border-border-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="label-regular">View</p>
              <ViewToggle
                modes={['2D', '3D']}
                view={canvasView}
                onChange={(newView) => setCanvasView(newView)}
              />
            </div>
            <div className="flex items-center gap-4 [&_svg]:size-6">
              <DeleteFlashingModalOnPreview deleteFlashing={deleteFlashing} />

              {flashing?.color && !flashing.startCrushFold && !flashing.endCrushFold ? (
                <EditFlashingDrawer flashingId={flashingId} />
              ) : (
                <a href={`/flashing/${flashingId}/preview/edit-canvas`}>
                  <Edit />
                </a>
              )}
            </div>
          </div>
          <PreviewCanvas flashing={flashing} view={canvasView} setTotalGirth={setTotalGirth} />
          <Separator />
          <div className="w-full flex flex-wrap gap-2">
            <p className="caption-small rounded-xs bg-surface-disable p-2 border border-border-default h-fit">
              Total Girth: {totalGirth}mm
            </p>
            <p className="caption-small rounded-xs bg-surface-disable p-2 border border-border-default h-fit">
              Tapered:{' '}
              {flashing && flashing.nodes.some((node) => !!node.next_line_bside_length)
                ? 'Yes'
                : 'No'}
            </p>
            <p className="caption-small rounded-xs bg-surface-disable p-2 border border-border-default h-fit">
              Crush Fold: {flashing?.startCrushFold || flashing?.endCrushFold ? 'Yes' : 'No'}
            </p>
            <Link
              href={`/flashing/${flashingId}/preview/edit-material-properties`}
              className="flex items-center gap-2 caption-small rounded-xs bg-surface-disable p-2 border border-border-default"
            >
              <div className="grid gap-2 caption-small">
                <p>Material: {flashing?.material}</p>
                {flashing?.color ? (
                  <p>Color: {flashing.color.name}</p>
                ) : (
                  <p>Thickness: {flashing?.thickness?.thickness}mm</p>
                )}
              </div>
              <Edit className="size-5" />
            </Link>
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        <div className="grid grid-cols-2 gap-2 w-full">
          <AddTemplateModal
            setIsTemplateModalOpen={setIsTemplateModalOpen}
            isTemplateModalOpen={isTemplateModalOpen}
            submitTemplate={submitTemplate}
          />

          <Link href={`/flashing/${flashingId}/details`}>
            <Button size="large" className="w-full">
              Continue
              <ArrowRight />
            </Button>
          </Link>
        </div>
      </Footer>
    </div>
  )
}
