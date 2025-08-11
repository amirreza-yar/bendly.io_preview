import { StoredFlashing } from '@/types/flashingTypes'
import { usePreviewCanvas } from './hooks/usePreviewCanvas'
import React, { useEffect } from 'react'

export default function PreviewCanvas({
  flashing,
  view,
  setTotalGirth,
}: {
  flashing: StoredFlashing | null | undefined
  view: '2D' | '3D'
  setTotalGirth: (totalGirth: number) => void
}): React.ReactNode {
  const { canvasRef, totalGirth } = usePreviewCanvas(flashing, view)

  useEffect(() => {
    if (setTotalGirth) {
      setTotalGirth(totalGirth)
    }
  }, [totalGirth, setTotalGirth])

  return <canvas ref={canvasRef} />
}
