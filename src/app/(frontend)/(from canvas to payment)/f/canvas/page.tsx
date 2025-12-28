"use client";

import useCanvas from "@/hooks/canvas/useCanvas";
import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider";
import useDrawing from "@/hooks/canvas/useDrawing";
import useControls from "@/hooks/canvas/useControls";
import usePinchZoom from "@/hooks/canvas/usePinchZoom";
import usePanning from "@/hooks/canvas/usePanning";
import useRulering from "@/hooks/canvas/useRuler";
import CanvasControllers from "@/components/flashing/canvas/canvasUI/canvasController";
import { useHistory } from "@/hooks/canvas/useHistory";
import { AlertModal } from "@/components/uikit/alertModal";
import { Button } from "@/components/uikit/buttons/button";
import { FeaturedStop } from "@/components/uikit/icons";
import useTapper from "@/hooks/canvas/useTapper";

export default function CanvasPage({
  searchParams,
}: {
  searchParams: Promise<{ flashingId?: string }>;
}) {
  const { canvasRef } = useCanvasContext();

  useCanvas();

  useDrawing();

  useControls();

  useHistory();

  usePinchZoom();

  usePanning();

  useRulering();

  useTapper();

  return (
    <>
      <AlertModal
        title="This end is locked with Crush Fold"
        description="You’ve added a Crush Fold here. To move the Extender Node to this point, remove the Crush Fold first."
        actionButtonText="Cancel"
        cancelButtonText="Remove Crush Fold"
        dismissible
        onAction={() => {}}
        onCancle={() => console.log("crush fold on discard clicked")}
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
        <Button
          className="hidden"
          id="trigger-both-ends-closed-crush-fold-alert-dialog"
        >
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
      <CanvasControllers searchParams={searchParams} />
      <div className="flex-1 h-full w-full">
        <canvas ref={canvasRef} className="w-full" />
      </div>
    </>
  );
}
