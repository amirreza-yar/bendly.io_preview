"use client";
import { useEffect, useState } from "react";
import { useCanvasContext } from "@/providers/canvasContextProvider";
import useGrid from "./useGrid";

export default function useControls() {
  const { canvasInstance, drawing, setLastDotRef, scale, setScale } =
    useCanvasContext();

  const { createGrid, updateGrid, snapToGrid } = useGrid();

  const centerAndFitCanvas = () => {
    // if (!canvasInstance.current) return;
    // const canvas = canvasInstance.current;
    // // Get all objects except the grid (if needed)
    // const objects = canvas.getObjects().filter((obj) => obj.type !== "group");
    // if (objects.length === 0) return; // No objects to fit
    // // Create a temporary group to get the bounding box
    // const tempGroup = new Group(objects, { selectable: false });
    // const boundingRect = tempGroup.getBoundingRect();
    // canvas.remove(tempGroup); // Remove temp group after use
    // const canvasWidth = canvas.getWidth();
    // const canvasHeight = canvas.getHeight();
    // const padding = 20; // Space around objects
    // // Calculate best zoom to fit the drawing
    // const zoomX = (canvasWidth - padding * 2) / boundingRect.width;
    // const zoomY = (canvasHeight - padding * 2) / boundingRect.height;
    // const newZoom = Math.min(zoomX, zoomY, 1); // Max zoom = 1
    // // Center position
    // const centerX = boundingRect.left + boundingRect.width / 2;
    // const centerY = boundingRect.top + boundingRect.height / 2;
    // const newPanX = centerX - canvasWidth / (2 * newZoom);
    // const newPanY = centerY - canvasHeight / (2 * newZoom);
    // // Get current values
    // const currentZoom = canvas.getZoom();
    // const currentVPT = canvas.viewportTransform;
    // const currentPanX = -currentVPT[4] / currentZoom;
    // const currentPanY = -currentVPT[5] / currentZoom;
    // let startTime;
    // const duration = 500; // Animation duration in ms
    // const animate = (time) => {
    //   if (!startTime) startTime = time;
    //   const progress = Math.min((time - startTime) / duration, 1); // Normalize progress [0,1]
    //   const easedProgress = util.ease.easeInOutCubic(progress); // Smooth easing
    //   // Interpolate zoom and pan together
    //   const interpolatedZoom =
    //     currentZoom + (newZoom - currentZoom) * easedProgress;
    //   const interpolatedPanX =
    //     currentPanX + (newPanX - currentPanX) * easedProgress;
    //   const interpolatedPanY =
    //     currentPanY + (newPanY - currentPanY) * easedProgress;
    //   canvas.setZoom(interpolatedZoom);
    //   const vpt = canvas.viewportTransform;
    //   vpt[4] = -interpolatedPanX * interpolatedZoom;
    //   vpt[5] = -interpolatedPanY * interpolatedZoom;
    //   canvas.requestRenderAll();
    //   if (progress < 1) {
    //     requestAnimationFrame(animate);
    //   }
    // };
    // requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const scaleObjects = () => {
      const circleObjs = canvas
        .getObjects()
        .filter((obj) => obj.type === "circle");
      circleObjs.forEach((cir) => {
        cir.set({ radius: cir.originalRadius / scale });
      });

      const lineObjs = canvas.getObjects().filter((obj) => obj.type === "line");
      lineObjs.forEach((line) => {
        line.set({ strokeWidth: line.originalStrokeWidth / scale });
      });
    };

    const handleZoomWheel = (opt) => {
      let delta = opt.e.deltaY;
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 10) zoom = 10;
      if (zoom < 0.5) zoom = 0.5;
      canvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
      opt.e.preventDefault();
      opt.e.stopPropagation();

      // setScale(zoom);

      createGrid();

      // scaleObjects();

      // const circleObjs = canvas
      //   .getObjects()
      //   .filter((obj) => obj.type === "circle");
      // circleObjs.forEach((cir) => {
      //   cir.set({ radius: cir.originalRadius / scale });
      // });

      // const lineObjs = canvas.getObjects().filter((obj) => obj.type === "line");
      // lineObjs.forEach((line) => {
      //   line.set({ strokeWidth: line.originalStrokeWidth / scale });
      // });
    };

    let lastTouchDistance = null;

    // Touch Start: Detect two-finger zoom gesture
    const handleZoomTouchStart = (e) => {
      if (drawing) return;
      if (e.touches.length === 2) {
        lastTouchDistance = getDistanceBetweenTouches(e.touches);
      }
    };

    // Touch Move: Perform zooming
    const handleZoomTouchMove = (e) => {
      if (e.touches.length === 2 && lastTouchDistance !== null) {
        const newTouchDistance = getDistanceBetweenTouches(e.touches);
        let zoom = canvas.getZoom();
        let delta = newTouchDistance - lastTouchDistance;

        // let newZoom = zoom * (1 + delta * 0.004); // Adjusted for better responsiveness

        zoom *= 1.002 ** delta;

        // Keep zoom within limits
        zoom = Math.max(0.5, Math.min(10, zoom));

        // Zoom to the midpoint between two fingers
        const point = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };

        canvas.zoomToPoint(point, zoom);
        // setScale(zoom);
        // createGrid();

        // scaleObjects();

        lastTouchDistance = newTouchDistance; // Update for next move event

        e.preventDefault(); // Prevent page scroll
        e.stopPropagation();
      }
    };

    // Touch End: Reset zoom tracking
    const handleZoomTouchEnd = (e) => {
      if (e.touches.length < 2) {
        lastTouchDistance = null;
      }
    };

    // Utility Function: Get distance between two touch points
    function getDistanceBetweenTouches(touches) {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    const getClientCoords = (e) => (e.changedTouches ? e.changedTouches[0] : e);

    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let frameId = null;

    const handlePanMove = (e) => {
      if (!isDragging) return;

      // let evt = e.e;
      // if (evt.changedTouches) {
      //   evt = evt.changedTouches[0]; // More precise touch event
      // }

      // let vpt = canvas.viewportTransform;
      // vpt[4] += evt.clientX - lastPosX;
      // vpt[5] += evt.clientY - lastPosY;
      // canvas.requestRenderAll();

      // lastPosX = evt.clientX;
      // lastPosY = evt.clientY;
      // updateGrid();

      const evt = getClientCoords(e.e);
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          let vpt = canvas.viewportTransform;
          vpt[4] += evt.clientX - lastX;
          vpt[5] += evt.clientY - lastY;
          // canvas.requestRenderAll();
          // updateGrid(); // throttled update if needed
          lastX = evt.clientX;
          lastY = evt.clientY;
          frameId = null;
        });
      }
    };

    const handlePanStart = (e) => {
      if (drawing) return;
      console.log("panning!");
      isDragging = true;
      const evt = getClientCoords(e.e);
      lastX = evt.clientX;
      lastY = evt.clientY;
    };

    const handlePanEnd = () => {
      isDragging = false;
      // createGrid(); // Only update grid after panning ends
    };

    // Add event listeners
    canvas.on("mouse:wheel", handleZoomWheel);
    // canvas.on("mouse:down", handlePanStart);
    // canvas.on("mouse:move", handlePanMove);
    // canvas.on("mouse:up", handlePanEnd);

    // canvas.on("zoom", function () {
    //   const zoom = canvas.getZoom();

    //   canvas.getObjects().forEach((obj) => {
    //     if (obj.strokeWidth) {
    //       obj.set({ strokeWidth: obj.originalStrokeWidth / zoom });
    //     }
    //   });

    //   canvas.renderAll();
    // });

    // canvas.on("object:moving", function (e) {
    //   var p = e.target;
    //   p.line1 && p.line1.set({ x2: p.left, y2: p.top });
    //   p.line2 && p.line2.set({ x1: p.left, y1: p.top });
    //   // p.setCoords();
    //   p.isEdge === true ? setLastDotRef(p.getCenterPoint()) : {};
    //   // console.log({line1: p.line1, line2: p.line2});
    //   canvas.renderAll();
    // });

    // canvas.on("selection:created", function (e) {
    //   console.log("Selection created: " + e.selected[0]);
    //   var p = e.selected[0];

    //   p.set({ fill: "blue", stroke: "blue" });
    // });

    // canvas.on("selection:cleared", function (e) {
    //   var p = e.deselected[0];
    //   p.set({ fill: "#000", stroke: "#000" });
    // });

    // canvas.on("selection:updated", function (e) {
    //   var s = e.selected[0];
    //   var p = e.deselected[0];
    //   p.set({ fill: "#000", stroke: "#000" });
    //   s.set({ fill: "blue", stroke: "blue" });
    // });

    // canvas.wrapperEl.addEventListener("touchstart", handleZoomTouchStart);
    // canvas.wrapperEl.addEventListener("touchmove", handleZoomTouchMove);
    // canvas.wrapperEl.addEventListener("touchend", handleZoomTouchEnd);

    return () => {
      canvas.off("mouse:wheel", handleZoomWheel);
      // canvas.off("mouse:down", handlePanStart);
      // canvas.off("mouse:move", handlePanMove);
      // canvas.off("mouse:up", handlePanEnd);
    };
  }, [drawing, scale]);
  return { centerAndFitCanvas };
}