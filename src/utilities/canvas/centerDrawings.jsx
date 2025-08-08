"use client";
import { util } from "fabric";

import { useCanvasContext } from "@/providers/canvasContextProvider";
import useGrid from "@/hooks/canvas/useGrid";
import { groupDrawings, unGroupDrawings } from "@/utilities/canvas/grouping";

export const centerDrawingGroup = (padding = 80, duration = 500) => {
  const { canvasInstance, setZoomTargetRef , objectsZoomScale,} = useCanvasContext();
  const { createGrid } = useGrid();
  const canvas = canvasInstance.current;

  const { drawingGroup } = groupDrawings();

  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  const groupBounds = drawingGroup.getBoundingRect(); // Absolute bounding box
  const groupCenter = {
    x: groupBounds.left + groupBounds.width / 2,
    y: groupBounds.top + groupBounds.height / 2,
  };

  // Calculate scale to fit with padding
  const availableWidth = canvasWidth - 2 * padding;
  const availableHeight = canvasHeight - 2 * padding;

  const scaleX = availableWidth / groupBounds.width;
  const scaleY = availableHeight / groupBounds.height;

  let targetScale = Math.max(0.5, Math.min(10, Math.min(scaleX, scaleY)));

  // Clamp scale (optional, adjust as needed)
  targetScale = Math.min(Math.max(targetScale, 0.1), 2); // Between 0.1 and 2

  // Translate to center the group after scaling
  const dx = canvasWidth / 2 - groupCenter.x * targetScale;
  const dy = canvasHeight / 2 - groupCenter.y * targetScale;

  const endTransform = [targetScale, 0, 0, targetScale, dx, dy];
  const startTransform = canvas.viewportTransform.slice();

  // canvas.viewportTransform = endTransform;

  // Animate
  util.animate({
    startValue: 0,
    endValue: 1,
    duration,
    easing: util.ease.easeOutQuad,
    onChange: (t) => {
      const interpolated = startTransform.map((start, i) => {
        const end = endTransform[i];
        return start + (end - start) * t;
      });

      canvas.viewportTransform = interpolated;
      canvas.requestRenderAll();
    },
    onComplete: () => {
      canvas.viewportTransform = endTransform;
      unGroupDrawings();
      createGrid();
      canvas.setZoom(targetScale);
      setZoomTargetRef(targetScale);

      canvas.renderAll();
    },
  });
};
