"use client";
import { useEffect, useState } from "react";
import { Circle, Line, Shadow, util, Text, Group, Path } from "fabric";

import { calculateLineLength } from "@/utilities/canvas/canvasUtils";

import { useCanvasContext } from "@/providers/canvasContextProvider";
import useGrid from "../useGrid";
import { saveCanvasState } from "@/lib/(dev)/db";

export default function DEVuseDrawing() {
  const {
    canvasInstance,
    isDrawing,
    lastDotRef,
    setLastDotRef,
    setCanvasIsEmpty, objectsZoomScale,} = useCanvasContext();

  const { snapToGrid } = useGrid();

  function getCentroid(points) {
    // points = [ {x,y}, {x,y}, … ] in drawing order
    let A = 0, // polygon area
      Cx = 0, // centroid x * 6A
      Cy = 0; // centroid y * 6A

    for (let i = 0; i < points.length; i++) {
      const { x: x0, y: y0 } = points[i];
      const { x: x1, y: y1 } = points[(i + 1) % points.length];
      const cross = x0 * y1 - x1 * y0;
      A += cross;
      Cx += (x0 + x1) * cross;
      Cy += (y0 + y1) * cross;
    }
    A *= 0.5;
    return { x: Cx / (6 * A), y: Cy / (6 * A) };
  }

  /**
   * Given a line from (x1,y1) to (x2,y2) and an approximate
   * “drawing center” point, returns:
   *   • an offset normal vector [nx,ny] pointing away from the center
   *   • the midpoint [mx,my]
   */
  function createLengthAnnotation(
    line,
    offset = 20,
    textGap = 8,
    polygonCentroid = null
  ) {
    const { x1, y1, x2, y2 } = line;
    const dx = x2 - x1,
      dy = y2 - y1;
    const len = Math.hypot(dx, dy);
    if (len === 0) return null;

    // two perpendicular normals
    let n1 = { x: -dy / len, y: dx / len };
    let n2 = { x: dy / len, y: -dx / len };
    // pick the one pointing more upward
    // By default pick the normal pointing “up”:
    const normal = n1.y < n2.y ? n1 : n2;

    if (polygonCentroid) {
      // Compute midpoint
      const mx = (x1 + x2) / 2,
        my = (y1 + y2) / 2;
      // Dot product of normal with vector (centroid - midpoint):
      const toCenter = {
        x: polygonCentroid.x - mx,
        y: polygonCentroid.y - my,
      };
      // If normal currently points *away* from polygon interior,
      // flip it so the label ends up *inside*:
      if (normal.x * toCenter.x + normal.y * toCenter.y < 0) {
        normal.x = -normal.x;
        normal.y = -normal.y;
        offset = -offset;
        textGap = -textGap;
      }
    }

    // midpoint
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;

    // arrow bases
    const ax = mx + normal.x * offset;
    const ay = my + normal.y * offset;
    const bx = mx - normal.x * offset;
    const by = my - normal.y * offset;

    // arrow pennons
    const arrowLen = 6;
    const arr1 = new Line(
      [ax, ay, ax - normal.x * arrowLen, ay - normal.y * arrowLen],
      { stroke: "red", selectable: false }
    );
    const arr2 = new Line(
      [bx, by, bx + normal.x * arrowLen, by + normal.y * arrowLen],
      { stroke: "red", selectable: false }
    );

    // dimension line
    const dim = new Line([ax, ay, bx, by], {
      stroke: "red",
      selectable: false,
    });

    // text label
    const tx = mx + normal.x * (offset + textGap);
    const ty = my + normal.y * (offset + textGap);
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    // ensure text is upright
    if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

    const txt = new Text(`${Math.round(len)}`, {
      left: tx,
      top: ty,
      angle: angleDeg,
      fontSize: 14,
      fill: "white",
      backgroundColor: "red",
      selectable: false,
      originX: "center",
      originY: "center",
    });

    const group = new Group([arr1, arr2, dim, txt], {
      selectable: false,
      _isMeasurement: true,
      _measurementType: "length",
    });
    return group;
  }

  /**
   * Create a smaller interior‐angle annotation at vertex P.
   * Ensures angle arc and text face the interior and text is upright.
   */
  function createAngleAnnotation(ax, ay, px, py, bx, by, radius = 30) {
    const ux = ax - px,
      uy = ay - py;
    const vx = bx - px,
      vy = by - py;
    const lu = Math.hypot(ux, uy),
      lv = Math.hypot(vx, vy);
    if (lu === 0 || lv === 0) return null;

    const θ1 = Math.atan2(uy, ux);
    const θ2 = Math.atan2(vy, vx);
    let δ = θ2 - θ1;
    if (δ <= -Math.PI) δ += 2 * Math.PI;
    else if (δ > Math.PI) δ -= 2 * Math.PI;

    const sweepFlag = δ >= 0 ? 1 : 0;
    const startAngle = θ1;
    const endAngle = θ1 + δ;

    // arc path
    const xS = px + radius * Math.cos(startAngle);
    const yS = py + radius * Math.sin(startAngle);
    const xE = px + radius * Math.cos(endAngle);
    const yE = py + radius * Math.sin(endAngle);
    const pathData = [
      ["M", xS, yS],
      ["A", radius, radius, 0, 0, sweepFlag, xE, yE],
    ];
    const arc = new Path(pathData, {
      stroke: "purple",
      fill: "",
      selectable: false,
    });

    // text on bisector, ensure upright
    const mid = θ1 + δ / 2;
    const txtOff = 12;
    const tx = px + (radius + txtOff) * Math.cos(mid);
    const ty = py + (radius + txtOff) * Math.sin(mid);
    let textAngle = (mid * 180) / Math.PI + 90;
    if (textAngle > 90 || textAngle < -90) textAngle += 180;

    const deg = Math.round((Math.abs(δ) * 180) / Math.PI);
    const txt = new Text(`${deg}°`, {
      left: tx,
      top: ty,
      angle: textAngle,
      fontSize: 14,
      fill: "white",
      backgroundColor: "purple",
      selectable: false,
      originX: "center",
      originY: "center",
    });

    const group = new Group([arc, txt], {
      selectable: false,
      _isMeasurement: true,
      _measurementType: "angle",
    });
    return group;
  }

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const handleDrawing = (event) => {
      if (!isDrawing) return;
      const pointer = canvas.getPointer(event.e);
      const { x, y } = snapToGrid(pointer.x, pointer.y);

      const existing = canvas
        .getObjects()
        .find(
          (obj) => obj.type === "circle" && obj.left === x && obj.top === y
        );

      let currentZoom = canvas.getZoom();

      const objectScale = Math.max(0.7, Math.min(7, currentZoom));

      if (!existing) {
        const circleObjs = canvas
          .getObjects()
          .filter((obj) => obj.type === "circle");

        const prevCircle = circleObjs[circleObjs.length - 1];

        const circle = new Circle({
          left: x,
          top: y,
          radius: 3 / objectsZoomScale.current,
          fill: "#000",
          originX: "center",
          originY: "center",
          // stroke: "transparent", // Invisible by default
          hasControls: false,
          hasBorders: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 15,
          // strokeWidth: 20, // Acts as a hitbox
          selectable: false,
          evented: true,

          // dirty: true,
          objectCaching: true,
          statefullCache: true,
          // active: true,
        });

        // circle.on("moving", (e) => {
        //   console.log("circle is moving: " + e);
        //   console.log(circle.canvas.getZoom());
        // });

        // circle.onSelect = (e) => {
        //   // console.log(e);
        //   // const currentZoom = canvas.getZoom();
        //   // console.log(circle.canvas.getZoom());

        //   circle.set({
        //     fill: "blue",
        //   });
        //   console.log(circle.canvas.getActiveObject());
        // };

        // circle.onDeselect = (e) => {
        //   circle.set({
        //     fill: "#000",
        //   });
        // };

        // circle.originalRadius = 5;

        // Draw a line if there's a previous dot
        if (lastDotRef.current) {
          const mainLine = new Line(
            [
              // lastDotRef.current.x,
              // lastDotRef.current.y,
              prevCircle.getCenterPoint().x,
              prevCircle.getCenterPoint().y,
              circle.getCenterPoint().x,
              circle.getCenterPoint().y,
            ],
            // [circle.getCenterPoint().x, circle.getCenterPoint().y, x, y],
            {
              stroke: "#000",
              strokeWidth: 3 / objectsZoomScale.current,
              strokeLineCap: "round",
              hasControls: false,
              hasBorders: false,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
              lockMovementX: true,
              lockMovementY: true,
              // padding: 50,
              selectable: false, // Prevent direct selection
              // evented: false, // Pass events to the group

              // dirty: true,
              objectCaching: true,
              statefullCache: true,

              // active: true,

              // shadow: new Shadow({
              //   color: "#000",
              //   blur: 2,
              //   affectStroke: true,
              //   nonScaling: false,
              //   // offsetX: 0,
              //   // offsetY: 0,
              // }),
            }
          );

          const annotationGroup = createLengthAnnotation(mainLine);
          canvas.add(annotationGroup);

          const hitboxLine = new Line(
            [
              prevCircle.getCenterPoint().x,
              prevCircle.getCenterPoint().y,
              circle.getCenterPoint().x,
              circle.getCenterPoint().y,
            ],
            {
              strokeWidth: 20 / objectsZoomScale.current, // Hitbox size
              // stroke: "rgba(0,0,0,0)", // Fully transparent
              stroke: "rgba(0, 0, 0, 0.2)",
              strokeLineCap: "round",
              hasControls: false,
              hasBorders: false,
              lockRotation: true,
              lockScalingX: true,
              lockScalingY: true,
              lockMovementX: true,
              lockMovementY: true,
              // padding: 50,
              selectable: false, // Prevent direct selection
              // evented: false, // Pass events to the group

              // dirty: true,
              objectCaching: true,
              statefullCache: true,

              // active: true,

              hoverCursor: "pointer",
            }
          );

          // const group = new Group([hitboxLine, obj], {
          //   selectable: true,
          //   evented: true,
          //   name: "resizable_line_group",
          // });

          // Flag this group
          mainLine.hitboxLine = hitboxLine;
          hitboxLine.originalLine = mainLine;
          hitboxLine.isHitboxLine = true;
          // hitboxLine.type = "hitboxLine";

          // Replace original with group
          // canvas.remove(obj);
          hitboxLine.perPixelTargetFind = true;
          // canvas.sendObjectToBack(hitboxLine);

          // mainLine.onSelect = (e) => {
          //   // console.log(e);
          //   // const currentZoom = canvas.getZoom();
          //   // console.log(mainLine.canvas.getZoom());

          //   mainLine.set({
          //     stroke: "blue",
          //   });
          //   console.log(mainLine.canvas.getActiveObject());
          // };

          // mainLine.onDeselect = (e) => {
          //   mainLine.set({
          //     stroke: "#000",
          //   });
          // };

          // hitboxLine.onSelect = (e) => {
          //   // console.log(e);
          //   // const currentZoom = canvas.getZoom();
          //   // console.log(mainLine.canvas.getZoom());
          //   canvas.discardActiveObject(hitboxLine);
          //   canvas.setActiveObject(mainLine);
          //   // hitboxLine.mainLine.set({
          //   //   stroke: "#000",
          //   // });
          // };

          // hitboxLine.onDeselect = (e) => {
          //   hitboxLine.originalLine.set({
          //     stroke: "#000",
          //   });
          // };

          canvas.add(hitboxLine);

          mainLine.perPixelTargetFind = true;

          console.log("viewportTransform: " + canvas.viewportTransform);

          // mainLine.originalStrokeWidth = 2;

          // const line = new Group([mainLine, hitboxLine], { selectable: false });

          canvas.add(mainLine);
          // console.log(circleOb[0]);

          circle.line1 = mainLine;
          prevCircle.line2 = mainLine;
          circleObjs.forEach((cir) => {
            cir.isEdge = false;
            canvas.bringObjectToFront(cir);
            // console.log({line1: cir.line1?.angle, line2: cir.line2?.angle});
          });

          mainLine.circle1 = prevCircle;
          mainLine.circle2 = circle;

          // lastCircle.line2 = mainLine;

          // mainLine.on("mousedown", (event) => {
          //   if (!changeLine) return;
          //   event.e.stopPropagation();
          //   selectLine(mainLine);
          // });
        }

        // console.log("last circle line1: ", circle.line1);
        // console.log("last circle line2: ", circle.line2);

        circle.isEdge = true;

        // 1) Remove any old angle‐measure annotations:
        canvas
          .getObjects()
          .filter((o) => o._isMeasurement && o._measurementType === "angle")
          .forEach((m) => canvas.remove(m));

        const points = [];

        // 2) For each circle endpoint that has two lines, create an angle annotation:
        canvas
          .getObjects()
          .filter((o) => o.type === "circle" && o.line1 && o.line2)
          .forEach((circle) => {
            const pos = circle.getCenterPoint();
            points.push({ x: pos.x, y: pos.y });
            // circle is the common vertex P
            const P = circle.getCenterPoint(); // { x:…, y:… }

            // for each connected line, find its other endpoint
            const L1 = circle.line1,
              L2 = circle.line2;
            // circle2 is always the “far” endpoint, circle1 is the “start”:
            const A =
              L1.circle1 === circle
                ? L1.circle2.getCenterPoint()
                : L1.circle1.getCenterPoint();
            const B =
              L2.circle1 === circle
                ? L2.circle2.getCenterPoint()
                : L2.circle1.getCenterPoint();

            // createAngleAnnotation(ax,ay, px,py, bx,by, radius)
            const angAnno = createAngleAnnotation(
              A.x,
              A.y,
              P.x,
              P.y,
              B.x,
              B.y,
              30 // you can tweak the radius
            );
            if (angAnno) {
              angAnno._measurementType = "angle";
              canvas.add(angAnno);
            }
          });

        const centroid = getCentroid(points);

        canvas
          .getObjects()
          .filter((o) => o._isMeasurement && o._measurementType === "length")
          .forEach((m) => canvas.remove(m));

        canvas
          .getObjects()
          .filter((o) => o.type === "line" && !o.isHitboxLine)
          .forEach((line) => {
            const lengthAnno = createLengthAnnotation(line, 20, 8, centroid);
            canvas.add(lengthAnno);
          });

        // 3) Finally, re‑bring all measurements to front:
        canvas
          .getObjects()
          .filter((o) => o._isMeasurement)
          .forEach((m) => canvas.bringObjectToFront(m));

        canvas.add(circle);

        setLastDotRef({ x, y }); // Update last dot
        setCanvasIsEmpty(false);
      }
      // canvas.renderAll();
      // saveCanvasState(canvas, lastDotRef);
    };

    canvas.on("mouse:down", handleDrawing);

    // canvas.on({
    //   "mouse:down": function (e) {
    //     if (e.target) {
    //       e.target.opacity = 0.5;
    //       canvas.renderAll();
    //     }
    //   },
    //   "mouse:up": function (e) {
    //     if (e.target) {
    //       e.target.opacity = 1;
    //       canvas.renderAll();
    //     }
    //   },
    //   "object:moved": function (e) {
    //     e.target.opacity = 0.5;
    //   },
    //   "object:modified": function (e) {
    //     e.target.opacity = 1;
    //   },
    // });

    return () => {
      canvas.off("mouse:down", handleDrawing);
    };
  }, [isDrawing]);
}
