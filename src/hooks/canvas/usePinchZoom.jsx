"use client";
import { useEffect } from "react";
import { useCanvasContext } from "@/providers/canvasContextProvider";
import useGrid from "./useGrid";
import useObejctUtils from "./useObjectUtils";

export default function usePinchZoom() {
  const {
    canvasInstance,
    isDrawing,
    isPinchZooming,
    setIsPanning,
    // setLastDotRef,
    zoomTargetRef,
    setZoomTargetRef,
    isResizing, objectsZoomScale,} = useCanvasContext();

  const { createGrid } = useGrid();
  const { groupDrawings, unGroupDrawings } = useObejctUtils();

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    let lastTouchDistance = 0;
    // let zoomTarget = canvas.getZoom();
    // let zoomTargetPinch = zoomTarget;
    // let zoomTarget = canvas.getZoom();
    let zoomPoint = { x: canvas.width / 2, y: canvas.height / 2 }; // Default center

    // Touch Start: Detect two-finger zoom gesture
    const handleZoomTouchStart = (e) => {
      // if (isDrawing || !isPinchZooming || isResizing) return;
      if (isDrawing || !isPinchZooming) return;
      if (e.touches.length === 2) {
        lastTouchDistance = getDistanceBetweenTouches(e.touches);
        zoomPoint = getMidpoint(e.touches); // Store the midpoint of fingers
        setIsPanning(false);

        // groupDrawings();
      }
    };

    const smoothZoom = () => {
      let currentZoom = canvas.getZoom();
      if (Math.abs(canvas.getZoom() - zoomTargetRef.current) > 0.005) {
        let newZoom = currentZoom + (zoomTargetRef.current - currentZoom) * 0.5; // Smooth transition
        canvas.zoomToPoint(zoomPoint, newZoom);

        setZoomTargetRef(newZoom);

        // requestAnimationFrame(smoothZoom);
      }
      createGrid();
      // updateGridOnZoom();
    };

    const handleZoomTouchMove = (e) => {
      if (e.touches.length === 2 && lastTouchDistance !== null) {
        const newTouchDistance = getDistanceBetweenTouches(e.touches);
        let delta = newTouchDistance - lastTouchDistance;

        zoomTargetRef.current *= 1.004 ** delta;
        zoomTargetRef.current = Math.max(
          0.5,
          Math.min(10, zoomTargetRef.current)
        );

        zoomPoint = getMidpoint(e.touches); // Update zoom point

        smoothZoom(); // Start smooth zooming

        lastTouchDistance = newTouchDistance;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    // Touch End: Reset zoom tracking
    const handleZoomTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastTouchDistance = null;
      }
      setIsPanning(true);

      // unGroupDrawings();
    };

    // Utility Function: Get distance between two touch points
    function getDistanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    // Utility Function: Get midpoint between two touch points
    function getMidpoint(touches) {
      return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
      };
    }

    canvas.wrapperEl.addEventListener("touchstart", handleZoomTouchStart);
    canvas.wrapperEl.addEventListener("touchmove", handleZoomTouchMove);
    canvas.wrapperEl.addEventListener("touchend", handleZoomTouchEnd);

    // return () => {
    //   canvasInstance.current?.wrapperEl.removeEventListener("touchstart", handleZoomTouchStart);
    //   canvasInstance.current?.wrapperEl.removeEventListener("touchmove", handleZoomTouchMove);
    //   canvasInstance.current?.wrapperEl.removeEventListener("touchend", handleZoomTouchEnd);
    // };
  }, [isResizing]);
}
