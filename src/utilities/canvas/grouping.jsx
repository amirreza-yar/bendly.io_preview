"use client";
import { useCanvasContext } from "@/providers/canvasContextProvider";
import { Group } from "fabric";

export const groupDrawings = () => {
  const { canvasInstance , objectsZoomScale,} = useCanvasContext();
  const canvas = canvasInstance.current;
  const objects = canvas
    .getObjects()
    .filter((obj) => obj.type === "circle" || obj.type === "line");

  if (objects.length === 0) return; // No objects to group

  const drawingGroup = new Group(objects, {
    name: "drawing_group",
    // selectable: true,
    // evented: true,
    selectable: false,
    evented: false,
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    objectCaching: true,
    statefullCache: true,
  });

  // Add the group to the canvas
  canvas.add(drawingGroup);

  // Remove individual objects from the canvas
  objects.forEach((obj) => canvas.remove(obj));

  canvas.requestRenderAll();

  return drawingGroup;
};

export const unGroupDrawings = () => {
  const { canvasInstance , objectsZoomScale,} = useCanvasContext();
  const canvas = canvasInstance.current;

  const currentZoom = canvas.getZoom();

  const drawingGroup = canvas
    .getObjects()
    .find((obj) => obj.name === "drawing_group");

  if (!drawingGroup || drawingGroup.type !== "group") return;

  const drawingItems = drawingGroup._objects;

  drawingItems.forEach((item) => {
    if (item.type == "circle") {
      item.set("radius", 3 / objectsZoomScale.current);
      item.line1 && item.line1.set({ x2: item.left, y2: item.top });
      item.line2 && item.line2.set({ x1: item.left, y1: item.top });
      item.isEdge === true ? setLastDotRef(item.getCenterPoint()) : {};
    } else if (item.type == "line") {
      console.log(item.circle1.getCenterPoint());

      item.set({
        strokeWidth: 2 / objectsZoomScale.current,
      });
      console.log(item.circle1.getCenterPoint().x);
      item.setCoords();
    }
  });

  console.log("UNgrouping objects");

  if (!drawingGroup || drawingGroup.type !== "group") return; // Ensure it's a group

  const items = drawingGroup._objects; // Get objects inside the group

  canvas.remove(drawingGroup); // Remove the group from the canvas

  items.forEach((item) => canvas.add(item));

  canvas.requestRenderAll();
};
