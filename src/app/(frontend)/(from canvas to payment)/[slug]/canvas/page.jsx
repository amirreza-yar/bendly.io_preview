'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, Line, Circle, Group, Rect } from 'fabric'
import useCanvas from '@/hooks/canvas/useCanvas'
import { useCanvasContext } from '@/providers/canvasContextProvider'
// import useGrid from "@/hooks/canvas/useGrid";
import useDrawing from '@/hooks/canvas/useDrawing'
import useControls from '@/hooks/canvas/useControls'
import usePinchZoom from '@/hooks/canvas/usePinchZoom'
import usePanning from '@/hooks/canvas/usePanning'
import useRulering from '@/hooks/canvas/useRuler'

// import CanvasControllers from "@/components/ui/canvas/controllers";
import CanvasControllers from '@/components/canvas/canvasController'
import ResizingDrawer from '@/components/canvas/resizing/resizingDrawer'
import { useHistory } from '@/hooks/canvas/useHistory'
import { AlertDialog } from '@/components/ui/alert-dialog'
import { AlertModal } from '@/components/uikit/alertModal'
import { Button } from '@/components/uikit/buttons/button'
import { FeaturedStop } from '@/components/uikit/icons'
import useTapper from '@/hooks/canvas/useTapper'
import RemoveCrushFoldOnDrawingModal from '@/components/canvas/removeCrushFoldOnDrawingModal'
import useLoading from '@/hooks/canvas/useLoading'
import { useNewFlashingContext } from '@/providers/data_providers/flashing_providers/NewFlashingContext'

const flashing = {
  nodes: [
    {
      node_id: '5liz9r',
      left: 154.62889312011072,
      top: 258.10056296019377,
      next_node_id: 'cz7l1r',
    },
    {
      node_id: 'cz7l1r',
      left: 300,
      top: 250,
      prev_node_id: '5liz9r',
      next_node_id: 'qnajqg',
    },
    {
      node_id: 'qnajqg',
      left: 327.83462019201306,
      top: 448.0536137483141,
      prev_node_id: 'cz7l1r',
      next_node_id: 'n87yn4',
    },
    {
      node_id: 'n87yn4',
      left: 179.29440988077755,
      top: 468.9295788923239,
      prev_node_id: 'qnajqg',
      next_node_id: 'kdy2fp',
    },
    {
      node_id: 'kdy2fp',
      left: 106.47185766283125,
      top: 385.1568154875962,
      prev_node_id: 'n87yn4',
    },
  ],
  startCrushFold: true,
  endCrushFold: false,
  crushFoldDir: true,
}

export default function CanvasPage() {
  const {
    canvasRef,
    canvasInstance,
    circles,
    lines,
    lastDotRef,
    setLastDotRef,
    setIsPinchZooming,
    showOverlapDialogobjectsZoomScale,
  } = useCanvasContext()

  const { newFlashing, setNewFlashing } = useNewFlashingContext()

  console.log(newFlashing)

  useCanvas()

  useDrawing()

  useControls()

  useHistory()

  usePinchZoom()

  usePanning()

  useRulering()

  useTapper()

  useLoading({ flashing })

  return (
    <>
      <AlertModal
        title="This end is locked with Crush Fold"
        description="You’ve added a Crush Fold here. To move the Extender Node to this point, remove the Crush Fold first."
        actionButtonText="Cancel"
        cancelButtonText="Remove Crush Fold"
        dismissible
        onAction={() => {}}
        onCancle={() => console.log('crush fold on discard clicked')}
        onCancleButtonVariant="ghost"
      >
        <Button className="hidden" id="trigger-remove-crush-fold-alert-dialog">
          Trigger modal
        </Button>
      </AlertModal>

      <AlertModal
        title="Both Ends Locked"
        description="Both ends have Crush Folds. To draw, remove one or both Crush Folds.
Need adjustments? Use the Adjust tool."
        actionButtonText="Got it!"
        dismissible
        onAction={() => {}}
      >
        <Button className="hidden" id="trigger-both-ends-closed-crush-fold-alert-dialog">
          Trigger modal
        </Button>
      </AlertModal>

      <AlertModal
        title="You Cannot Create A Polygon"
        icon={FeaturedStop}
        alignmentVariant="justify"
        actionButtonText="Got it!"
        onAction={() => {}}
        description={`To change the expanding point, select the Node that is open on one side`}
      >
        <Button className="hidden" id="trigger-overlap-alert-dialog">
          Trigger modal
        </Button>
      </AlertModal>
      <CanvasControllers />
      <div className="flex-1 h-full w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </>
  )
}
