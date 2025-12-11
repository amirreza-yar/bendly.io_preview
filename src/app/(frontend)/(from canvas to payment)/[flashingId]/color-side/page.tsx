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
import { ArrowLeft, CircleQuestion, TransferVerticaly } from '@/components/uikit/icons'
import { notFound, useParams, useRouter, useSearchParams } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'

export default function ColorSidePage() {
  const { flashingId }: { flashingId: string } = useParams()

  const orderId = useSearchParams().get('orderId')

  const router = useRouter()

  // const flashing: StoredFlashing | undefined = useGETFlashingById(flashingId)

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
      isDraft: false,
    })

    router.push(`/f/${flashingId}/preview?orderId=${orderId}`)
  }

  return (
    <>
      <div className="w-[100vw] h-[100vh]">
        <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-center z-10 bg-white border-b-1 border-border-dark">
          <div className="flex items-center justify-between h-full w-full px-4">
            <div className="flex items-center gap-[18px] pr-3">
              <a href={`/f/${flashingId}/canvas`}>
                <ArrowLeft />
              </a>
              <h6>Color Side</h6>
            </div>
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
          onClick={() => setFlashingDir(!flashingDir)}
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
