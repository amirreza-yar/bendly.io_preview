export const attachLineSelectionHandlers = (lines, selectLine) => {
  lines.forEach((line) => {
    line.on("mousedown", (event) => {
      event.e.stopPropagation();
      line.isHitboxLine ? selectLine(line.originalLine) : selectLine(line);
    });
  });
};

export const removeLineHandlers = (lines) => {
  lines.forEach((line) => line.off("mousedown"));
};

export const updateLineStyles = (canvas, selectedLine) => {
  const zoom = canvas.getZoom();

  canvas.getObjects().forEach((obj) => {
    if (obj.type === "line" && !obj.isHitboxLine) {
      obj.set({
        stroke: "#000",
        strokeWidth: 3 / Math.max(0.9, Math.min(4, zoom)),
        x1: obj.circle1?.left,
        y1: obj.circle1?.top,
        x2: obj.circle2?.left,
        y2: obj.circle2?.top,
      });
    }
    else if (obj.type === "circle") {
      obj.set({
        fill: "#000",
      });
    }
    obj.setCoords();
  });

  if (selectedLine) {
    selectedLine.set({
      stroke: "blue",
      strokeWidth: 3 / Math.max(0.9, Math.min(4, zoom)),
      x1: selectedLine.circle1.left,
      y1: selectedLine.circle1.top,
      x2: selectedLine.circle2.left,
      y2: selectedLine.circle2.top,
    });
    selectedLine.setCoords();
    selectedLine.hitboxLine.setCoords();
  }

  canvas.requestRenderAll();
};
