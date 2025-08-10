"use client";
import { useEffect, useState } from "react";
import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider";
import useObejctUtils from "./useObjectUtils";
import useGrid from "./useGrid";

export default function usePanning() {
  const {
    canvasInstance,
    isDrawing,
    isPanning,
    // setIsPinchZooming,
    isResizingobjectsZoomScale, isResizing} = useCanvasContext();

  const { createGrid, updateGrid } = useGrid();
  // const { groupDrawings, unGroupDrawings } = useObejctUtils();

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const getClientCoords = (e) => (e.changedTouches ? e.changedTouches[0] : e);

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;

    // Function to handle the panning movement
    const handlePanMove = (e) => {
      if (!isDragging) return;

      const evt = getClientCoords(e.e);
      let vpt = canvas.viewportTransform;

      // Apply the difference between the last and current position to the viewport
      vpt[4] += evt.clientX - lastX;
      vpt[5] += evt.clientY - lastY;

      // Update lastX and lastY to the current position for the next movement
      lastX = evt.clientX;
      lastY = evt.clientY;

      // Optionally call for rendering or grid updates here if needed
      // createGrid();
      updateGrid();
      canvas.requestRenderAll();
    };

    const handlePanStart = (e) => {
      // if (isDrawing || !isPanning || isResizing) return;
      if (isDrawing || !isPanning) return;
      if (!isPanning) return;
      // createGrid();
      isDragging = true;
      const evt = getClientCoords(e.e);
      lastX = evt.clientX;
      lastY = evt.clientY;
      // setIsPinchZooming(false);
      // groupDrawings();
    };

    const handlePanEnd = () => {
      isDragging = false;
      // Optionally refresh grid or other elements after pan ends
      createGrid();
      // setIsPinchZooming(true);
      // unGroupDrawings();
    };

    // Add event listeners for panning
    canvas.on("mouse:down", handlePanStart);
    canvas.on("mouse:move", handlePanMove); // Move updates immediately
    canvas.on("mouse:up", handlePanEnd);

    // Cleanup on unmount
    return () => {
      canvas.off("mouse:down", handlePanStart);
      canvas.off("mouse:move", handlePanMove);
      canvas.off("mouse:up", handlePanEnd);
    };
  }, [isDrawing, isResizing, isPanning]);
}
