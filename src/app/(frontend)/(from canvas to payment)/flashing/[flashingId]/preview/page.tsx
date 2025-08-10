'use client'
import { useEffect, useRef, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import {
  loadFlashing,
  centerDrawingGroup,
  create3DFlashing,
  addColorSideFlashing,
  drawingBounds,
  getTotalGirth,
} from '@/hooks/canvas/useFlashingLoader'
import { Canvas } from 'fabric'
import { Button } from '@/components/uikit/buttons/button'
import { ArrowRight, Edit, Remove } from '@/components/uikit/icons'
import PreviewCard from '@/components/dashboard/order/PreviewCard'
import { Header } from '@/components/dashboard/header'
import { ViewToggle } from '@/components/uikit/viewToggle'
import { ContentWrapper } from '@/components/dashboard/contentWrapper'
import { Separator } from '@/components/uikit/separator'
import Link from 'next/link'
import { Footer } from '@/components/dashboard/footer'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'

export default function PreviewPage() {
  const { flashingId } = useParams()

  // const flashing: StoredFlashing | undefined = getFlashingById(flashingId)

  const flashing = useLiveQuery(
    () => db.flashings.get({ id: flashingId }),
    [flashingId],
    null, // initial value
  )

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasInstance = useRef<Canvas>(null)

  const modes = ['2D', '3D'] as const
  const [view, setView] = useState<(typeof modes)[number]>('3D')
  const [openEdit, setOpenEdit] = useState(false)

  const [girth, setGirth] = useState<number | undefined>(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#F5F5F5',
      selection: false,
    })

    canvas.setWidth(window.innerWidth - 64)
    canvas.setHeight(160)

    canvasInstance.current = canvas

    return () => {
      if (canvasInstance.current) {
        canvasInstance.current.dispose()
        canvasInstance.current = null
      }
    }
  }, [])

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    console.log(flashingId)

    if (flashing) {
      setGirth(getTotalGirth(flashing.nodes))

      canvas.clear()

      loadFlashing(canvas, flashing)

      const { groupHeight } = drawingBounds(canvas)

      const { colorSideObjects, toggleButtonPosition } = addColorSideFlashing(
        canvas,
        flashing.crushFoldDir,
        flashing.startCrushFold,
        flashing.endCrushFold,
        0.8 * Math.sqrt(groupHeight),
        8 * Math.sqrt(groupHeight),
      )

      if (view === '3D') {
        create3DFlashing(canvas)
      }

      centerDrawingGroup(canvas, 10)

      canvas.renderAll()
    }
  }, [flashing, view])

  return (
    <div className="h-screen w-screen bg-[#EEE]">
      <Header title="preview" />

      <ContentWrapper className="pt-18">
        <div className="grid gap-4 bg-white p-4 rounded-md border border-border-default">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="label-regular">View</p>
              <ViewToggle modes={modes} view={view} onChange={(newView) => setView(newView)} />
            </div>
            <div className="flex items-center gap-6 [&_svg]:size-6">
              <Remove />
              <Edit />
            </div>
          </div>
          <canvas className="h-50" ref={canvasRef} />
          <Separator />
          <div className="w-full flex flex-wrap gap-2">
            <p className="caption-small rounded-xs bg-surface-disable p-2 border border-border-default h-fit">
              Total Girth: {getTotalGirth(flashing?.nodes)}mm
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
              href=""
              className="flex items-center gap-2 caption-small rounded-xs bg-surface-disable p-2 border border-border-default"
            >
              <div className="grid gap-2 caption-small">
                <p>Material: {flashing?.material}</p>
                {flashing?.color ? (
                  <p>Color: {flashing.color.name}</p>
                ) : (
                  <p>Color: {flashing?.thickness?.thickness}mm</p>
                )}
                {/* <p>Thickness: 1mm</p> */}
              </div>
              <Edit className="size-5" />
            </Link>
          </div>
        </div>
      </ContentWrapper>
      <Footer>
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button variant="ghost">Save as Template</Button>
          <Button size="large">
            Continue
            <ArrowRight />
          </Button>
        </div>
      </Footer>
    </div>
  )
}
