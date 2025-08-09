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
} from '@/hooks/canvas/useFlashingLoader'
import { CircleQuestion, TransferVerticaly } from '@/components/uikit/icons'

const flashing = {
  nodes: [
    {
      node_id: '3pik7o',
      left: 550,
      top: 250,
      next_node_id: 'xk6ibn',
    },
    {
      node_id: 'xk6ibn',
      left: 900,
      top: 200,
      prev_node_id: '3pik7o',
      next_node_id: 'zsnkuo',
    },
    {
      node_id: 'zsnkuo',
      left: 900,
      top: 400,
      prev_node_id: 'xk6ibn',
      next_node_id: '9dntq7',
    },
    {
      node_id: '9dntq7',
      left: 700,
      top: 550,
      prev_node_id: 'zsnkuo',
      next_node_id: 'lm247w',
    },
    {
      node_id: 'lm247w',
      left: 850,
      top: 550,
      prev_node_id: '9dntq7',
    },
  ],
  startCrushFold: false,
  endCrushFold: true,
  crushFoldDir: false,
}

export default function ColorSidePage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasInstance = useRef(null)

  const [flashingDir, setFlashingDir] = useState<boolean>(flashing.crushFoldDir)
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
  }, [])

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    canvas.clear()

    loadFlashing(canvas, flashing)

    const { colorSideObjects, toggleButtonPosition } = addColorSideFlashing(
      canvas,
      flashingDir,
      flashing.startCrushFold,
      flashing.endCrushFold,
    )

    setColorSideObjsState(colorSideObjects)

    centerDrawingGroup(canvas)
  }, [flashingDir])

  return (
    <>
      <div className="w-[100vw] h-[100vh]">
        <Header title="Color Side" returnHref="/dashboard/sample/canvas" />

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
          <Button className="w-full">Finish and Continue</Button>
        </Footer>
      </div>
    </>
  )
}
