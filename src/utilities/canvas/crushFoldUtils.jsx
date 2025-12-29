import { Circle, loadSVGFromString, util } from "fabric";

export function createCrushFoldObject(circle, direction, position, opts = {}) {
  const dirCoef = direction ? 1 : -1;

  let crushFoldObject;
  if (position === "start") {
    // circle center + radius
    const cx = circle.left + circle.radius;
    const cy = circle.top + circle.radius;
    const r = circle.radius;

    const line = circle.line2;

    const { x1, y1, x2, y2 } = line;
    const mainAngle = Math.atan2(y2 - y1, x2 - x1);

    crushFoldObject = new Circle({
      radius: 6,
      left:
        cx - 7 * Math.cos(mainAngle - 90 * dirCoef) - 2.6 * Math.cos(mainAngle),
      top:
        cy - 7 * Math.sin(mainAngle - 90 * dirCoef) - 2.6 * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI + 90,
      endAngle: (mainAngle * 180) / Math.PI - 90,
      stroke: "#000",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      fill: "",
      strokeLineCap: "round",
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    });

    // const endWindLine = new Line()
  } else if (position === "end") {
    // circle center + radius
    const cx = circle.left + circle.radius;
    const cy = circle.top + circle.radius;
    const r = circle.radius;

    const line = circle.line1;

    const { x1, y1, x2, y2 } = line;
    const mainAngle = Math.atan2(y2 - y1, x2 - x1);

    crushFoldObject = new Circle({
      radius: 6,
      left:
        cx - 7 * Math.cos(mainAngle - 90 * dirCoef) - 2.6 * Math.cos(mainAngle),
      top:
        cy - 7 * Math.sin(mainAngle - 90 * dirCoef) - 2.6 * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI - 90,
      endAngle: (mainAngle * 180) / Math.PI + 90,
      stroke: "#000",
      strokeWidth: 2,
      originX: "center",
      originY: "center",
      fill: "",
      strokeLineCap: "round",
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    });

    // const endWindLine = new Line()
  }

  return crushFoldObject;
}

export const toggleCrushFoldButton = (canvas, circle) => {
  const svgMarkup = `
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M17.0814 3.34912V15.023C17.0814 16.4031 15.9631 17.5219 14.5836 17.5219C12.8288 17.5219 11.6211 15.7594 12.2538 14.122L13.5132 10.8628M2.91675 13.1438L8.33341 7.72717M2.91675 7.72717L8.33341 13.1438"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
    />
    </svg>
    `.trim();
  if (circle.crushButton?.icon) {
    circle.crushButton.set({ fill: "" });
    canvas.remove(circle.crushButton.icon);
    delete circle.crushButton.icon;
  } else {
    const { x, y } = circle.crushButton.getCenterPoint();

    circle.crushButton.set({ fill: "#3355FF" });

    /* load it; Fabric ≥ 5 returns a Promise */
    loadSVGFromString(svgMarkup).then(({ objects, options }) => {
      // merge the individual <path> nodes into one Fabric object
      const icon = util.groupSVGElements(objects, options);

      /* optional: scale so it sits neatly inside the 120‑px‑diameter circle */
      const scale = 12 / Math.max(icon.width, icon.height); // 50 px ≈ circle radius – padding
      icon.set({
        originX: "center",
        originY: "center",
        scaleX: scale,
        scaleY: scale,
        left: x, // <‑‑ your required position
        top: y,
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        selectable: false,
        evented: true,
        objectCaching: true,
        statefullCache: true,
      });

      icon.on("mousedown", () => {
        circle.crushButton.fire("mousedown", { e: null });
        // toggleCrushFoldButton(canvas, circle)
      });

      circle.crushButton.icon = icon;

      canvas.add(icon);
      canvas.requestRenderAll();
    });
  }
};

export const createCrushFoldButtons = (canvas) => {
  let startCircle, endCircle;

  const circles = canvas.getObjects().filter((obj) => obj.type === "circle");

  if (!circles.length) return;

  circles.forEach((cir) => {
    if (!cir.line1 && cir.line2) {
      startCircle = cir;
    }
    if (cir.line1 && !cir.line2) {
      endCircle = cir;
    }
  });

  const gap = 30;
  const buttonRadius = 20;

  const startLine = startCircle.line2;

  const startX1 = startLine.x1;
  const startX2 = startLine.x2;
  const startY1 = startLine.y1;
  const startY2 = startLine.y2;
  const startMainAngle = Math.atan2(startY2 - startY1, startX2 - startX1);

  const startdX = startX1 - gap * Math.cos(startMainAngle);
  const startdY = startY1 - gap * Math.sin(startMainAngle);

  const startCrushFoldButton = new Circle({
    left: startdX,
    top: startdY,
    radius: buttonRadius,
    stroke: "rgba(51, 85, 255, 1)",
    strokeLineCap: "round",
    strokeWidth: 2,
    fill: "rgba(0, 0, 0, 0)",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    selectable: false,
    evented: true,
    objectCaching: true,
    statefullCache: true,
  });

  const endLine = endCircle.line1;

  const endX1 = endLine.x1;
  const endX2 = endLine.x2;
  const endY1 = endLine.y1;
  const endY2 = endLine.y2;
  const endMainAngle = Math.atan2(endY2 - endY1, endX2 - endX1);

  const enddX = endX2 + gap * Math.cos(endMainAngle);
  const enddY = endY2 + gap * Math.sin(endMainAngle);

  const endCrushFoldButton = new Circle({
    left: enddX,
    top: enddY,
    radius: buttonRadius,
    stroke: "rgba(51, 85, 255, 1)",
    strokeLineCap: "round",
    strokeWidth: 2,
    fill: "rgba(0, 0, 0, 0)",
    originX: "center",
    originY: "center",
    hasControls: false,
    hasBorders: false,
    lockRotation: true,
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    selectable: false,
    evented: true,
    objectCaching: true,
    statefullCache: true,
  });

  return { startCrushFoldButton, endCrushFoldButton, startCircle, endCircle };
};
