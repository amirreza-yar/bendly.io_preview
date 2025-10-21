'use client'
import useGrid from '@/hooks/canvas/useGrid'
import {
  CanvasProvider,
  useCanvasContext,
} from '@/providers/canvas_providers/canvasContextProvider'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { Canvas, config } from 'fabric'
import { useEffect, useRef } from 'react'
import PreviewCanvas from '../flashing/preview/previewCanvas'
import {
  addColorSideFlashing,
  centerDrawingGroup,
  create3DFlashing,
  drawingBounds,
  loadFlashing,
} from '@/hooks/canvas/useFlashingLoader'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'
import { usePreviewCanvas } from '../flashing/preview/hooks/usePreviewCanvas'
import DetailedCanvas from './detailedCanvas'

export default function DetailedCanvasModal({
  setShowDetailedCanvas,
  showDetailedCanvas,
  flashing,
}: {
  setShowDetailedCanvas: (param: boolean) => void
  showDetailedCanvas: boolean
  flashing: any
}) {
  return (
    <DialogPrimitive.Root
      data-slot="dialog"
      open={showDetailedCanvas}
      onOpenChange={(open: boolean) => {
        setShowDetailedCanvas(open)
      }}
    >
      <DialogPrimitive.Title data-slot="dialog-title" className="hidden" />
      <DialogPrimitive.Portal data-slot="dialog-portal">
        <DialogPrimitive.Overlay
          data-slot="dialog-overlay"
          className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50"
        />
        <DialogPrimitive.Content
          data-slot="dialog-content"
          className="w-fit bg-white data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 translate-x-[-50%] translate-y-[-50%] rounded-lg shadow-lg duration-200"
        >
          <DetailedCanvas
            showDetailedCanvas={showDetailedCanvas}
            setShowDetailedCanvas={setShowDetailedCanvas}
            flashing={flashing}
          />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
