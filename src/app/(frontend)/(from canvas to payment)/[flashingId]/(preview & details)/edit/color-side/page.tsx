'use client'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Footer } from '@/components/dashboard/footer'
import { Header } from '@/components/dashboard/header'
import { Button } from '@/components/uikit/buttons/button'
import { IconButton } from '@/components/uikit/buttons/iconButton'
// import { CircleQuestion, VerticalyTransferHorizontaly } from '@/components/uikit/icons'
import { Canvas } from 'fabric'
import { useEffect, useRef, useState } from 'react'
import {
  loadFlashing,
  centerDrawingGroup,
  create3DFlashing,
  addColorSideFlashing,
  drawingBounds,
} from '@/hooks/canvas/useFlashingLoader'
import { ArrowLeft, CircleQuestion, TransferVerticaly, XIcon } from '@/components/uikit/icons'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import { toast } from 'sonner'
import { AlertDialogContent, AlertModal } from '@/components/uikit/alertModal'
import { cn } from '@/utilities/ui'
import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'

export default function ColorSidePage() {
  const { flashingId }: { flashingId: string } = useParams()
  const searchParams = useSearchParams()

  const next = searchParams.get('next')

  const orderId = searchParams.get('orderId')

  if (!next) return notFound()

  if (next === 'order' && !orderId) return notFound()

  const router = useRouter()

  const [hasColorChanged, setHasColorChanged] = useState(false)

  const flashing = useLiveQuery(
    () => db.flashings.get({ id: flashingId }),
    [flashingId],
    null, // initial value
  )

  useEffect(() => {
    if (flashing === undefined) {
      notFound()
    } else if (
      flashing &&
      (flashing.nodes.length < 2 || !(flashing?.color || flashing?.thickness))
    ) {
      notFound()
    }
  }, [flashing])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasInstance = useRef<Canvas>(null)

  const [flashingDir, setFlashingDir] = useState<boolean | undefined>(flashing?.crushFoldDir)
  const [colorSideObjsState, setColorSideObjsState] = useState([])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#F5F5F5',
      selection: false,
    })

    canvas.setWidth(window.innerWidth)
    canvas.setHeight(window.innerHeight - 220)

    canvasInstance.current = canvas

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose()
        canvasInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (flashing && flashingDir === undefined) {
      setFlashingDir(flashing.crushFoldDir)
    }
  }, [flashing, flashingDir])

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    console.log(flashing)

    if (flashing) {
      canvas.clear()

      loadFlashing(canvas, flashing)
      const { groupHeight } = drawingBounds(canvas)

      const { colorSideObjects, toggleButtonPosition } = addColorSideFlashing(
        canvas,
        flashingDir,
        flashing.startCrushFold,
        flashing.endCrushFold,
        0.8 * Math.sqrt(groupHeight),
        8 * Math.sqrt(groupHeight),
      )

      setColorSideObjsState(colorSideObjects)

      centerDrawingGroup(canvas)
    }
  }, [flashingDir, flashing])

  const confirmColorSide = () => {
    upsertPartialFlashing(flashingId, {
      crushFoldDir: flashingDir,
    })

    if (next === 'order' && orderId) {
      router.push(`/o/${orderId}/review`)
    } else if (next === 'preview') {
      router.push(`/f/${flashingId}/preview`)
    }
    toast('Your changes have been saved')
  }

  return (
    <>
      <div className="w-[100vw] h-[100vh]">
        <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
          <div className="flex items-center justify-between h-full w-full px-4">
            {next === 'order' || next === 'preview' ? (
              hasColorChanged ? (
                <AlertDialogPrimitive.Root data-slot="alert-dialog">
                  <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" asChild>
                    <div className="flex items-center gap-[18px] pr-3">
                      <ArrowLeft />
                      <h6>Color Side</h6>
                    </div>
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
                        You've made changes that haven't been saved. If you go back now, they'll be
                        lost.
                      </AlertDialogPrimitive.Description>
                    </div>
                    <div
                      data-slot="alert-dialog-footer"
                      className={'flex flex-col gap-4 sm:flex-row sm:justify-end pt-4'}
                    >
                      <AlertDialogPrimitive.Action asChild>
                        <Button onClick={confirmColorSide}>Save & Go Back</Button>
                      </AlertDialogPrimitive.Action>

                      <AlertDialogPrimitive.Cancel asChild>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            router.push(`/f/${flashingId}/preview`)
                          }}
                        >
                          Discard Changes
                        </Button>
                      </AlertDialogPrimitive.Cancel>
                    </div>
                  </AlertDialogContent>
                </AlertDialogPrimitive.Root>
              ) : (
                <div className="flex items-center gap-[18px] pr-3">
                  <a
                    href={
                      next === 'preview'
                        ? `/f/${flashingId}/preview`
                        : orderId && next === 'order'
                          ? `/o/${orderId}/review`
                          : 'not-found'
                    }
                  >
                    <ArrowLeft />
                  </a>
                  <h6>Color Side</h6>
                </div>
              )
            ) : (
              <div className="flex items-center gap-[18px] pr-3">
                <a
                  href={
                    next === 'preview'
                      ? `/f/${flashingId}/preview`
                      : orderId && next === 'order'
                        ? `/o/${orderId}/review`
                        : 'not-found'
                  }
                >
                  <ArrowLeft />
                </a>
                <h6>Color Side</h6>
              </div>
            )}
          </div>
        </header>

        <ContentWrapper className="pt-18 bg-[#f5f5f5] px-0">
          <div className="flex items-center gap-2 bg-[#D9E2FF] rounded-md px-3 py-[10.5px] mx-4">
            <h3 className="grow font-roboto text-xs/[22.5px] text-primary-dark">
              <span className="font-bold">Color side.</span> To determine the color side, click the
              toggle button
            </h3>
            <IconButton className black size="medium">
              <CircleQuestion />
            </IconButton>
          </div>
          <canvas ref={canvasRef} />
        </ContentWrapper>
        <IconButton
          black
          size="large"
          className="fixed bottom-24 left-4"
          onClick={() => {
            setFlashingDir(!flashingDir)
            setHasColorChanged(true)
          }}
        >
          <TransferVerticaly />
        </IconButton>
        <Footer className="border-t-0 bg-[#F5F5F5]">
          <Button onClick={confirmColorSide} className="w-full">
            Finish and Continue
          </Button>
        </Footer>
      </div>
    </>
  )
}
