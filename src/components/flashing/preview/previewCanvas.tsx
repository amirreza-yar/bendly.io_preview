import { StoredFlashing } from '@/types/flashingTypes'
import { usePreviewCanvas } from './hooks/usePreviewCanvas'
import React, { useEffect } from 'react'

export default function PreviewCanvas({
  flashing,
  view,
  setTotalGirth,
  height,
  width,
}: {
  flashing: StoredFlashing | null | undefined
  view: '2D' | '3D'
  setTotalGirth: (totalGirth: number) => void
  height?: number
  width?: number
}): React.ReactNode {
  const { canvasRef, totalGirth } = usePreviewCanvas(flashing, view, height, width)

  useEffect(() => {
    if (setTotalGirth) {
      setTotalGirth(totalGirth ?? 0)
    }
  }, [totalGirth, setTotalGirth])

  return <canvas ref={canvasRef} />
}
