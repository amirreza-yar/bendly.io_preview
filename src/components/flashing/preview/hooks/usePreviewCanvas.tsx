// usePreviewCanvas.ts
'use client'
import { Ref, RefObject, useEffect, useMemo, useRef } from 'react'
import { Canvas } from 'fabric'
import {
  loadFlashing,
  centerDrawingGroup,
  create3DFlashing,
  addColorSideFlashing,
  drawingBounds,
  getTotalGirth,
} from '@/hooks/canvas/useFlashingLoader'
import type { StoredFlashing } from '@/types/flashingTypes'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'

export function usePreviewCanvas(
  flashing: StoredFlashing | null | undefined,
  view: '2D' | '3D',
  height?: number,
  width?: number,
): { canvasRef: RefObject<HTMLCanvasElement | null>; totalGirth: number | undefined } {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasInstance = useRef<Canvas | null>(null)

  const totalGirth = useMemo(() => (flashing ? getTotalGirth(flashing.nodes) : 0), [flashing])

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#F5F5F5',
      selection: false,
    })

    if (height || width) {
      height && canvas.setHeight(height)
      width && canvas.setWidth(width)
    } else {
      // prefer container width / ResizeObserver in real app
      canvas.setWidth(window.innerWidth - 64)
      canvas.setHeight(160)
    }

    canvasInstance.current = canvas

    return () => {
      canvasInstance.current?.dispose()
      canvasInstance.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas || !flashing) return

    canvas.clear()
    loadFlashing(canvas, flashing)

    if (flashing.color) {
      const bounds = drawingBounds(canvas)

      const groupHeight = bounds?.groupHeight ?? 0
      addColorSideFlashing(
        canvas,
        flashing.crushFoldDir,
        flashing.startCrushFold,
        flashing.endCrushFold,
        0.8 * Math.sqrt(groupHeight),
        8 * Math.sqrt(groupHeight),
      )
    } else {
      if (flashing.startCrushFold) {
        const startCircle = canvas.getObjects().find((obj) => obj.line2 && !obj.line1)

        canvas.add(createCrushFoldObject(startCircle, flashing.crushFoldDir, 'start'))
        console.log(startCircle)
      }
      if (flashing.endCrushFold) {
        const endCircle = canvas.getObjects().find((obj) => !obj.line2 && obj.line1)

        canvas.add(createCrushFoldObject(endCircle, flashing.crushFoldDir, 'end'))
        console.log(endCircle)
      }
    }

    if (view === '3D') {
      create3DFlashing(canvas)
    }

    centerDrawingGroup(canvas, 10)
    canvas.renderAll()
  }, [flashing, view])

  return { canvasRef, totalGirth }
}
