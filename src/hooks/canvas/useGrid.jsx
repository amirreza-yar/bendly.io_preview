import { useEffect } from "react";
import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider"; // Make sure the path is correct
import { Line, Group } from "fabric"; // Ensure you import fabric elements

const GRID_SIZE = 50; // You can set this value based on your requirements

const useGrid = () => {
  const { canvasInstance, gridGroupRef, setGridGroupRef , objectsZoomScale,} = useCanvasContext();

  // const createGrid = () => {
  //   const canvas = canvasInstance.current;
  //   if (!canvas) return;

  //   // Remove the previous grid if it exists
  //   if (gridGroupRef.current) {
  //     canvas.remove(gridGroupRef.current);
  //   }

  //   const gridLines = [];
  //   const maxZoomOut = 0.1; // Minimum zoom level
  //   const maxWidth = canvas.getWidth() / maxZoomOut;
  //   const maxHeight = canvas.getHeight() / maxZoomOut;

  //   const startX = Math.floor(-maxWidth / 2 / GRID_SIZE) * GRID_SIZE;
  //   const startY = Math.floor(-maxHeight / 2 / GRID_SIZE) * GRID_SIZE;
  //   const endX = Math.ceil(maxWidth / 2 / GRID_SIZE) * GRID_SIZE;
  //   const endY = Math.ceil(maxHeight / 2 / GRID_SIZE) * GRID_SIZE;

  //   // Create vertical grid lines
  //   for (let i = startX; i < endX; i += GRID_SIZE) {
  //     gridLines.push(
  //       new Line([i, startY, i, endY], {
  //         stroke: "#ddd",
  //         strokeWidth: 0.5,
  //         selectable: false,
  //         evented: false,
  //       })
  //     );
  //   }

  //   // Create horizontal grid lines
  //   for (let j = startY; j < endY; j += GRID_SIZE) {
  //     gridLines.push(
  //       new Line([startX, j, endX, j], {
  //         stroke: "#ddd",
  //         strokeWidth: 0.5,
  //         selectable: false,
  //         evented: false,
  //       })
  //     );
  //   }

  //   // Group the grid lines and add to the canvas
  //   const gridGroup = new Group(gridLines, {
  //     selectable: false,
  //     evented: false,
  //     dirty: true,
  //   });

  //   gridGroup.dirty = true;

  //   setGridGroupRef(gridGroup);
  //   canvas.add(gridGroup);
  //   canvas.sendObjectToBack(gridGroup);
  // };

  const createGrid = () => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    // Remove the previous grid if it exists
    if (gridGroupRef.current) {
      canvas.remove(gridGroupRef.current);
    }

    const gridLines = [];
    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const offsetX = -vpt[4] / zoom;
    const offsetY = -vpt[5] / zoom;
    const width = canvas.getWidth() / zoom;
    const height = canvas.getHeight() / zoom;

    const startX = Math.floor(offsetX / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(offsetY / GRID_SIZE) * GRID_SIZE;
    const endX = startX + width + GRID_SIZE;
    const endY = startY + height + GRID_SIZE;

    const lineScale = Math.max(0.7, Math.min(7, zoom));

    // Create vertical grid lines
    for (let i = startX; i < endX; i += GRID_SIZE) {
      gridLines.push(
        new Line([i, startY, i, endY], {
          stroke: "#ddd",
          strokeWidth: 0.5 / lineScale,
          selectable: false,
          evented: false,
        })
      );
    }

    // Create horizontal grid lines
    for (let j = startY; j < endY; j += GRID_SIZE) {
      gridLines.push(
        new Line([startX, j, endX, j], {
          stroke: "#ddd",
          strokeWidth: 0.5 / lineScale,
          selectable: false,
          evented: false,
        })
      );
    }

    // Group the grid lines and add to the canvas
    const gridGroup = new Group(gridLines, {
      selectable: false,
      evented: false,
      // objectCaching: true,
      dirty: true,
      name: "grid_group",
    });

    gridGroup.dirty = true;

    // gridGroup.getObjects().forEach((obj) => {
    //   // obj.set("strokeUniform", true);
    //   obj.set("objectCaching", false);
    // });

    setGridGroupRef(gridGroup);
    canvas.add(gridGroup);
    canvas.sendObjectToBack(gridGroup);
    // canvas.renderAll();
  };

  const updateGridOnZoom = () => {
    const canvas = canvasInstance.current;
    if (!canvas || !gridGroupRef.current) return;

    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const offsetX = -vpt[4] / zoom;
    const offsetY = -vpt[5] / zoom;
    const width = canvas.getWidth() / zoom;
    const height = canvas.getHeight() / zoom;

    const startX = Math.floor(offsetX / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(offsetY / GRID_SIZE) * GRID_SIZE;
    const endX = startX + width + GRID_SIZE;
    const endY = startY + height + GRID_SIZE;

    gridGroupRef.current.set({
      left: startX,
      top: startY,
      scaleX: zoom, // Scale the grid properly
      scaleY: zoom,
    });

    gridGroupRef.current.setCoords();
    canvas.requestRenderAll();
  };

  const updateGrid = () => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const zoom = canvas.getZoom();
    // console.log("zoom in updategrid: ", zoom);
    const vpt = canvas.viewportTransform;
    const offsetX = -vpt[4] / zoom;
    const offsetY = -vpt[5] / zoom;
    const width = canvas.getWidth() / zoom;
    const height = canvas.getHeight() / zoom;

    const startX = Math.floor(offsetX / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(offsetY / GRID_SIZE) * GRID_SIZE;
    const endX = startX + width + GRID_SIZE;
    const endY = startY + height + GRID_SIZE;

    gridGroupRef.current.set({
      left: startX,
      top: startY,
    });
    gridGroupRef.current.setCoords();
    // canvas.renderAll();
  };

  const renderGrid = () => {
    const canvas = canvasInstance.current;
    if (!canvas || !gridGroupRef.current) return;

    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const offsetX = -vpt[4] / zoom;
    const offsetY = -vpt[5] / zoom;
    const width = canvas.getWidth() / zoom;
    const height = canvas.getHeight() / zoom;

    const startX = Math.floor(offsetX / GRID_SIZE) * GRID_SIZE;
    const startY = Math.floor(offsetY / GRID_SIZE) * GRID_SIZE;
    const endX = startX + width + GRID_SIZE;
    const endY = startY + height + GRID_SIZE;

    gridGroupRef.current.set({
      left: startX,
      top: startY,
    });

    gridGroupRef.current.dirty = true;
    canvas.requestRenderAll();
  };

  //   const updateGrid = () => {
  //     const canvas = canvasInstance.current;
  //     if (!canvas) return;

  //     const zoom = canvas.getZoom();
  //     const vpt = canvas.viewportTransform;
  //     const offsetX = -vpt[4] / zoom;
  //     const offsetY = -vpt[5] / zoom;
  //     const width = canvas.getWidth() / zoom;
  //     const height = canvas.getHeight() / zoom;

  //     const startX = Math.floor(offsetX / GRID_SIZE) * GRID_SIZE;
  //     const startY = Math.floor(offsetY / GRID_SIZE) * GRID_SIZE;
  //     const endX = startX + width + GRID_SIZE;
  //     const endY = startY + height + GRID_SIZE;

  //     // Remove existing grid before drawing a new one
  //     if (gridGroupRef.current) {
  //         canvas.remove(gridGroupRef.current);
  //     }

  //     const gridLines = [];

  //     for (let i = startX; i < endX; i += GRID_SIZE) {
  //         gridLines.push(
  //             new Line([i, startY, i, endY], {
  //                 stroke: "#ddd",
  //                 selectable: false,
  //                 evented: false,
  //             })
  //         );
  //     }

  //     for (let j = startY; j < endY; j += GRID_SIZE) {
  //         gridLines.push(
  //             new Line([startX, j, endX, j], {
  //                 stroke: "#ddd",
  //                 selectable: false,
  //                 evented: false,
  //             })
  //         );
  //     }

  //     const gridGroup = new Group(gridLines, {
  //         selectable: false,
  //         evented: false,
  //     });

  //     setGridGroupRef(gridGroup); // Update the ref
  //     canvas.add(gridGroup);
  //     // canvas.sendObjectToBack(gridGroup);

  //     canvas.renderAll();
  // };

  const snapToGrid = (x, y) => ({
    x: Math.round(x / GRID_SIZE) * GRID_SIZE,
    y: Math.round(y / GRID_SIZE) * GRID_SIZE,
  });

  return { createGrid, updateGrid, snapToGrid, renderGrid, updateGridOnZoom };
};

export default useGrid;
