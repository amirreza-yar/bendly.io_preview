"use client";
import { useEffect, useRef } from "react";
import { Circle, Text, Line, Point, Rect, Group, util } from "fabric";

import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider";
import useGrid from "./useGrid";
import { useHistory } from "./useHistory";
import {
  calculateLineLength,
  rotateObjectsAroundPoint,
  createAngleAnnotationObj,
  getAllMainLines,
  getAllCircles,
  calculateCircleAngle,
  hasAnyOverlap,
  // createLengthAnnotation,
} from "@/utilities/canvas/canvasUtils";
import { AlertModal } from "@/components/uikit/alertModal";
import { useBreakLineContext } from "@/providers/canvas_providers/breakLineProvider";
import { RemoveCrushFoldOnDrawingModal } from "@/components/flashing/canvas/canvasUI/removeCrushFoldOnDrawingModal";
import { Button } from "@/components/ui/button";

export default function useDrawing() {
  const {
    canvasInstance,
    isDrawing,
    isMoving,
    setCanvasIsEmpty,
    activeCircle,
    drwDirRevRef,
    undoStack,
    redoStack,
    canUndo,
    canRedo,
    setCanRedo,
    tempUndoStack,
    setShowOverlapDialog,
    setShowBreakLineIcon,
    isBreakLining,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    objectsZoomScale,
    canvasIsEmpty,
    setIsCanvasChanged,
    setHasEditModalChanges,
  } = useCanvasContext();

  const { addHistory, tempUndo, undo } = useHistory();

  const { activateBreakLine, deactivateBreakLine } = useBreakLineContext();

  const listenersRef = useRef({});
  // let drwDirRev = false;

  const { snapToGrid } = useGrid();

  const createAngleAnnos = (setOriginalAngle) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;

    const circles = getAllCircles(canvas);

    const activeObj = canvas.getActiveObject();

    circles.forEach((circle) => {
      if (circle.line1 && circle.line2) {
        if (circle.angleAnno) {
          canvas.remove(circle.angleAnno);
        }
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

        const color = circle === activeObj ? "#3355FF" : "#9145E2";

        // createAngleAnnotation(ax,ay, px,py, bx,by, radius)
        const { angAnno, deg, isAngleInverted } = createAngleAnnotationObj(
          A.x,
          A.y,
          P.x,
          P.y,
          B.x,
          B.y,
          {
            radius: 20,
            color: color,
          }
        );

        circle.angleAnno = angAnno;
        angAnno.mainCircle = circle;

        circle.isAngleInverted = isAngleInverted;
        angAnno.isAngleInverted = isAngleInverted;

        angAnno.mainCircle = circle;

        setOriginalAngle && (circle.originalAngle = deg);

        circle.angle = deg;
        if (angAnno) {
          angAnno._measurementType = "angle";
          angAnno.perPixelTargetFind = true;
          canvas.add(angAnno);
        }
      }
    });
  };

  function createLengthAnnotation(
    line,
    prevAngleAnno = null,
    nextAngleAnno = null,
    options = {}
  ) {
    let {
      baseOffset = 10,
      textGap = 2,
      endGap = 15,
      color = "#E50000",
    } = options;
    const canvas = canvasInstance.current;
    if (!canvas) return;
    const { x1, y1, x2, y2 } = line;
    const dx = x2 - x1,
      dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length === 0) return null;

    // 1) normals on each side of the line
    const n1 = { x: -dy / length, y: dx / length };
    const n2 = { x: dy / length, y: -dx / length };

    // 2) pick the “quietest” side as before...
    function countOnSide(normal) {
      let c = 0;
      [prevAngleAnno, nextAngleAnno].forEach((anno) => {
        if (!anno) return;

        const mx = (x1 + x2) / 2,
          my = (y1 + y2) / 2;
        const vx = anno.mid.x - mx,
          vy = anno.mid.y - my;
        if (vx * normal.x + vy * normal.y > 0) c++;
      });
      return c;
    }
    const c1 = countOnSide(n1),
      c2 = countOnSide(n2);
    let normal;
    if (c1 < c2) normal = n1;
    else if (c2 < c1) normal = n2;
    else {
      // tie → side of the larger adjacent angle
      const aPrev = prevAngleAnno?.δAbs || 0;
      const aNext = nextAngleAnno?.δAbs || 0;

      // pick whichever is bigger; if still tie default to n1
      const chosenAnno = aPrev >= aNext ? prevAngleAnno : nextAngleAnno;
      if (chosenAnno) {
        const circle = chosenAnno.mainCircle;

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

        const activeObj = canvas.getActiveObject();
        // createAngleAnnotation(ax,ay, px,py, bx,by, radius)
        const { angAnno, deg, isAngleInverted } = createAngleAnnotationObj(
          A.x,
          A.y,
          P.x,
          P.y,
          B.x,
          B.y,
          {
            radius: 13, // you can tweak the radius
            lineStroke: 1.5,
            arrowInLen: 4,
            arrowInAngle: 26,
            txtOffset: -35,
            // color: activeObj ? "#3355FF" : "#9145E2",
          }
        );

        circle.angleAnno = angAnno;
        angAnno.mainCircle = circle;

        circle.isAngleInverted = isAngleInverted;
        angAnno.isAngleInverted = isAngleInverted;

        angAnno.mainCircle = circle;

        baseOffset = 20;

        circle.angle = deg;
        if (angAnno) {
          angAnno._measurementType = "angle";
          canvas.remove(chosenAnno);
          canvas.add(angAnno);
        }

        // chosenAnno.mainCircle;

        // see which normal that anno.mid sits on
        const mx = (x1 + x2) / 2,
          my = (y1 + y2) / 2;
        const dot =
          (chosenAnno.mid.x - mx) * n1.x + (chosenAnno.mid.y - my) * n1.y;
        normal = dot > 0 ? n1 : n2;
      } else {
        normal = n1;
      }
    }

    // 3) compute the two candidate base points (un‑shortened)
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2;
    const offset = baseOffset;
    const p1 = new Point(
      x1 + normal.x * baseOffset,
      y1 + normal.y * baseOffset
    );
    const p2 = new Point(
      x2 + normal.x * baseOffset,
      y2 + normal.y * baseOffset
    );

    // 4) decide per‑end if we should shorten by endGap (angle<90°)
    // const shortenStart = prevAngleAnno && prevAngleAnno.δAbs < Math.PI / 2;
    // const shortenEnd = nextAngleAnno && nextAngleAnno.δAbs < Math.PI / 2;

    const shortenStart = false;
    const shortenEnd = false;

    // unit along line
    const ux = dx / length,
      uy = dy / length;
    // final dim‑line endpoints
    // const q1 = new Point(
    //   p1.x + (shortenStart ? endGap * ux : 0),
    //   p1.y + (shortenStart ? endGap * uy : 0)
    // );
    // const q2 = new Point(
    //   p2.x - (shortenEnd ? endGap * ux : 0),
    //   p2.y - (shortenEnd ? endGap * uy : 0)
    // );

    const q1 = new Point(p1.x, p1.y);
    const q2 = new Point(p2.x, p2.y);

    // 5) draw the parallel dimension line
    const dimLine = new Line([q1.x, q1.y, q2.x, q2.y], {
      stroke: color,
      strokeWidth: 0.5,
      strokeLineCap: "round",
      selectable: false,
    });

    // 6) arrowheads at q1, q2
    const arrowLen = 4;
    // const arrowAngle = 30;
    function makeArrow(pt, dirX, dirY, inverted) {
      // two little lines at ±arrowAngle from the direction
      const tangent = Math.atan2(dirY, dirX);
      const lines = [];
      if (inverted) {
        [(30 * Math.PI) / 180, (-30 * Math.PI) / 180].forEach((a) => {
          const ang = tangent + Math.PI + a;
          lines.push(
            new Line(
              [
                pt.x,
                pt.y,
                pt.x + arrowLen * Math.cos(ang),
                pt.y + arrowLen * Math.sin(ang),
              ],
              {
                stroke: color,
                strokeWidth: 0.5,
                strokeLineCap: "round",
                selectable: false,
              }
            )
          );
        });
      } else {
        [(210 * Math.PI) / 180, (-210 * Math.PI) / 180].forEach((a) => {
          const ang = tangent + Math.PI + a;
          lines.push(
            new Line(
              [
                pt.x,
                pt.y,
                pt.x + arrowLen * Math.cos(ang),
                pt.y + arrowLen * Math.sin(ang),
              ],
              {
                stroke: color,
                strokeWidth: 0.5,
                strokeLineCap: "round",
                selectable: false,
              }
            )
          );
        });
      }
      return lines;
    }
    const [a1, a2] = makeArrow(q1, ux, uy);
    const [a3, a4] = makeArrow(q2, ux, uy, true);

    // 7) little perpendicular tick at the original p1, p2
    const tickLen = 5;
    const tick1 = new Line(
      [
        p1.x - (normal.x * tickLen) / 2,
        p1.y - (normal.y * tickLen) / 2,
        p1.x + (normal.x * tickLen) / 2,
        p1.y + (normal.y * tickLen) / 2,
      ],
      {
        stroke: color,
        strokeWidth: 0.5,
        selectable: false,
        strokeLineCap: "round",
      }
    );
    const tick2 = new Line(
      [
        p2.x - (normal.x * tickLen) / 2,
        p2.y - (normal.y * tickLen) / 2,
        p2.x + (normal.x * tickLen) / 2,
        p2.y + (normal.y * tickLen) / 2,
      ],
      {
        stroke: color,
        strokeWidth: 0.5,
        selectable: false,
        strokeLineCap: "round",
      }
    );

    // 8) text + background exactly as before
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angleDeg > 90 || angleDeg < -90) angleDeg += 180;

    const str = `${Math.round(length)}`,
      tx = mx + normal.x * offset,
      ty = my + normal.y * offset;

    const txt = new Text(str, {
      left: tx,
      top: ty,
      originX: "center",
      originY: "center",
      fontFamily: "Roboto Flex",
      fontWeight: "500",
      fontSize: 8,
      lineHeight: 10 / 8,
      fill: "white",
      angle: angleDeg,
      selectable: false,
    });

    const padding = 2,
      bgW = txt.width + padding * 2,
      bgH = 10,
      bg = new Rect({
        left: tx,
        top: ty,
        originX: "center",
        originY: "center",
        width: bgW,
        height: bgH,
        rx: 4,
        fill: color,
        angle: angleDeg,
        selectable: false,
      });

    // 9) group everything
    const lengthAnno = new Group(
      [dimLine, tick1, tick2, a1, a2, a3, a4, bg, txt],
      {
        selectable: true,
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        _isMeasurement: true,
        _measurementType: "length",
      }
    );

    return lengthAnno;
  }

  const createAnnotations = (setOriginalAngle) => {
    const canvas = canvasInstance.current;
    if (!canvas) return;
    createAngleAnnos(setOriginalAngle);

    // const lines = getAllMainLines(canvas);

    const lines = canvas
      .getObjects()
      .filter((o) => o.type === "line" && o.hitboxLine);

    const activeObj = canvas.getActiveObject();

    lines.forEach((line) => {
      if (line.lengthAnno) {
        canvas.remove(line.lengthAnno);
      }

      const color = line === activeObj ? "#3355FF" : "#E50000";

      const lengthAnno = createLengthAnnotation(
        line,
        line.circle1.angleAnno,
        line.circle2.angleAnno,
        { color: color }
      );
      line.lengthAnno = lengthAnno;
      lengthAnno.mainLine = line;
      lengthAnno.perPixelTargetFind = true;
      canvas.add(lengthAnno);
    });
    canvas.requestRenderAll();
  };

  const changeDrawingDirectionOnCrushFold = () => {
    document.getElementById("trigger-remove-crush-fold-alert-dialog").click();
  };

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas) {
      return;
    }

    let currentZoom = canvas.getZoom();
    let clickedCircle, otherSideCircle, otherCrushFoldObject;

    var drwDirRev = drwDirRevRef.current;

    const onDrawing = (event) => {
      const pointer = canvas.getPointer(event.e);
      const { x, y } = snapToGrid(pointer.x, pointer.y);

      // if (!undoStack.current.length && redoStack.current.length) {
      //   activeCircle.current = null;

      // }

      if (event.target) {
        let clickedCircle = event.target;

        const isCircleEdgeValidated =
          Boolean(clickedCircle.line1) ^ Boolean(clickedCircle.line2);
        if (clickedCircle !== activeCircle.current && isCircleEdgeValidated) {
          const { x, y } = clickedCircle.getCenterPoint();

          const bufferCircle = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: "rgba(51, 85, 255, 1)",
            strokeLineCap: "round",
            fill: "rgba(51, 85, 255, 0.2)",
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

          clickedCircle.set({
            fill: "rgba(51, 85, 255, 1)",
            radius: 4 / objectsZoomScale.current,
          });

          bufferCircle.mainCircle = clickedCircle;
          clickedCircle.bufferCircle = bufferCircle;

          const prevActiveCircle = activeCircle.current;
          canvas.remove(prevActiveCircle.bufferCircle);
          prevActiveCircle.set({
            fill: "#000",
          });

          activeCircle.current = clickedCircle;

          drwDirRev = !drwDirRev;
          drwDirRevRef.current = drwDirRev;

          canvas.add(bufferCircle);
        }
        return;
      }

      const circleExisting = canvas
        .getObjects()
        .find(
          (obj) => obj.type === "circle" && obj.left === x && obj.top === y
        );

      if (!circleExisting) {
        const circleObjs = canvas
          .getObjects()
          .filter((obj) => obj.type === "circle" && obj.bufferCircle);

        const prevCircle = activeCircle.current;

        const circle = new Circle({
          left: x,
          top: y,
          originX: "center",
          originY: "center",
          radius: 4 / objectsZoomScale.current,
          fill: "rgba(51, 85, 255, 1)",
          hasControls: false,
          hasBorders: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 12,
          // strokeWidth: 20, // Acts as a hitbox
          selectable: false,
          evented: true,

          // dirty: true,
          objectCaching: true,
          statefullCache: true,
          // active: true,
        });

        const bufferCircle = new Circle({
          left: x,
          top: y,
          radius: 10 / objectsZoomScale.current,
          stroke: "rgba(51, 85, 255, 1)",
          // strokeDashArray: [1, 1],
          strokeLineCap: "round",
          fill: "rgba(51, 85, 255, 0.2)",
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

        circle.bufferCircle = bufferCircle;
        bufferCircle.mainCircle = circle;

        // Draw a line if there's a previous dot
        if (
          (prevCircle && undoStack.current.length) ||
          (prevCircle && !canvasIsEmpty)
        ) {
          const prevActiveCircle = activeCircle.current;
          canvas.remove(prevActiveCircle.bufferCircle);
          prevActiveCircle?.set({
            fill: "#000",
          });

          // circleObjs.length !== 1 && prevCircle.set({ padding: 0 });

          activeCircle.current = circle;

          const mainLine = new Line(
            [
              prevCircle.getCenterPoint().x,
              prevCircle.getCenterPoint().y,
              circle.getCenterPoint().x,
              circle.getCenterPoint().y,
            ],
            {
              stroke: "#000",
              strokeWidth: 2 / objectsZoomScale.current,
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
            }
          );

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
              stroke: "rgba(0, 0, 0, 0.0005)",
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

          // Flag this group
          mainLine.hitboxLine = hitboxLine;
          hitboxLine.originalLine = mainLine;
          hitboxLine.isHitboxLine = true;

          hitboxLine.perPixelTargetFind = true;
          mainLine.perPixelTargetFind = true;

          canvas.add(hitboxLine);

          canvas.add(mainLine);

          circleObjs.forEach((cir) => {
            canvas.bringObjectToFront(cir);
          });

          setCanvasIsEmpty(false);

          if (!drwDirRev) {
            circle.line1 = mainLine;
            prevCircle.line2 = mainLine;

            mainLine.circle1 = prevCircle;
            mainLine.circle2 = circle;
          } else {
            circle.line2 = mainLine;
            prevCircle.line1 = mainLine;

            mainLine.circle2 = prevCircle;
            mainLine.circle1 = circle;

            circle.line2 &&
              circle.line2.set({
                x1: circle.left,
                y1: circle.top,
              }) &&
              circle.line2.setCoords();

            prevCircle.line1 &&
              prevCircle.line1.set({
                x2: prevCircle.left,
                y2: prevCircle.top,
              }) &&
              prevCircle.line1.setCoords();

            circle.line2?.hitboxLine &&
              circle.line2?.hitboxLine.set({
                x1: circle.left,
                y1: circle.top,
              }) &&
              circle.line2?.hitboxLine.setCoords();

            prevCircle.line1?.hitboxLine &&
              prevCircle.line1?.hitboxLine.set({
                x2: prevCircle.left,
                y2: prevCircle.top,
              }) &&
              prevCircle.line1?.hitboxLine.setCoords();
          }
          calculateLineLength(mainLine) > 500 && setShowBreakLineIcon(true);
        } else {
          activeCircle.current = circle;
        }

        canvas.add(bufferCircle);

        canvas.add(circle);

        addHistory("drawing", circle, true);

        if (hasAnyOverlap(canvas)) {
          tempUndo();
          document.getElementById("trigger-overlap-alert-dialog").click();
          createAnnotations();
        } else {
          createAnnotations();
          addHistory("drawing", circle);
          setHasEditModalChanges(true);
        }
      }

      canvas.requestRenderAll();

      if (isBreakLining) {
        activateBreakLine(canvas);
      }
    };

    if (isDrawing && !isMoving) {
      createAnnotations();

      const circles = canvas.getObjects().filter((o) => o.type === "circle");
      canvas
        .getObjects()
        .filter(
          (o) => o.type === "circle" && !o.bufferCircle && !o.isBufferCircle
        )
        .forEach((circle) => {
          circle.set({
            // selectable: true,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementX: true,
            lockMovementY: true,
            padding: 15,
          });

          canvas.bringObjectToFront(circle);
        });

      if (startCrushFoldObjectRef.current || endCrushFoldObjectRef.current) {
        if (startCrushFoldObjectRef.current && !endCrushFoldObjectRef.current) {
          circles.forEach((cir) => {
            if (!cir.line2 && cir.line1) {
              clickedCircle = cir;
            } else if (cir.line2 && !cir.line1) {
              otherSideCircle = cir;
              otherCrushFoldObject = startCrushFoldObjectRef.current;
            }
          });

          const isCircleEdgeValidated =
            Boolean(clickedCircle.line1) ^ Boolean(clickedCircle.line2);
          if (clickedCircle !== activeCircle.current && isCircleEdgeValidated) {
            const { x, y } = clickedCircle.getCenterPoint();

            const bufferCircle = new Circle({
              left: x,
              top: y,
              radius: 10 / objectsZoomScale.current,
              stroke: "rgba(51, 85, 255, 1)",
              strokeLineCap: "round",
              fill: "rgba(51, 85, 255, 0.2)",
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

            clickedCircle.set({
              fill: "rgba(51, 85, 255, 1)",
              radius: 4 / objectsZoomScale.current,
            });

            bufferCircle.mainCircle = clickedCircle;
            clickedCircle.bufferCircle = bufferCircle;

            const prevActiveCircle = activeCircle.current;
            canvas.remove(prevActiveCircle.bufferCircle);
            prevActiveCircle.set({
              fill: "#000",
            });

            activeCircle.current = clickedCircle;

            drwDirRev = !drwDirRev;
            drwDirRevRef.current = drwDirRev;

            canvas.add(bufferCircle);
          }

          if (activeCircle.current) {
            canvas.remove(activeCircle.current.bufferCircle);

            const { x, y } = activeCircle.current.getCenterPoint();

            const bufferCircle = new Circle({
              left: x,
              top: y,
              radius: 10 / objectsZoomScale.current,
              stroke: "rgba(51, 85, 255, 1)",
              strokeLineCap: "round",
              fill: "rgba(51, 85, 255, 0.2)",
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

            activeCircle.current.set({
              radius: 4 / objectsZoomScale.current,
              fill: "rgba(51, 85, 255, 1)",
            });

            bufferCircle.mainCircle = activeCircle.current;
            activeCircle.current.bufferCircle = bufferCircle;

            canvas.add(bufferCircle);
          }

          canvas.on("mouse:down", onDrawing);
          listenersRef.current = { onDrawing };
        } else if (
          !startCrushFoldObjectRef.current &&
          endCrushFoldObjectRef.current
        ) {
          circles.forEach((cir) => {
            if (cir.line2 && !cir.line1) {
              clickedCircle = cir;
            } else if (!cir.line2 && cir.line1) {
              otherSideCircle = cir;
              otherCrushFoldObject = endCrushFoldObjectRef.current;
            }
          });

          const isCircleEdgeValidated =
            Boolean(clickedCircle.line1) ^ Boolean(clickedCircle.line2);
          if (clickedCircle !== activeCircle.current && isCircleEdgeValidated) {
            const { x, y } = clickedCircle.getCenterPoint();

            const bufferCircle = new Circle({
              left: x,
              top: y,
              radius: 10 / objectsZoomScale.current,
              stroke: "rgba(51, 85, 255, 1)",
              strokeLineCap: "round",
              fill: "rgba(51, 85, 255, 0.2)",
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

            clickedCircle.set({
              fill: "rgba(51, 85, 255, 1)",
              radius: 4 / objectsZoomScale.current,
            });

            bufferCircle.mainCircle = clickedCircle;
            clickedCircle.bufferCircle = bufferCircle;

            const prevActiveCircle = activeCircle.current;
            canvas.remove(prevActiveCircle.bufferCircle);
            prevActiveCircle.set({
              fill: "#000",
            });

            activeCircle.current = clickedCircle;

            drwDirRev = !drwDirRev;
            drwDirRevRef.current = drwDirRev;

            canvas.add(bufferCircle);
          }

          if (activeCircle.current) {
            canvas.remove(activeCircle.current.bufferCircle);

            const { x, y } = activeCircle.current.getCenterPoint();

            const bufferCircle = new Circle({
              left: x,
              top: y,
              radius: 10 / objectsZoomScale.current,
              stroke: "rgba(51, 85, 255, 1)",
              strokeLineCap: "round",
              fill: "rgba(51, 85, 255, 0.2)",
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

            activeCircle.current.set({
              radius: 4 / objectsZoomScale.current,
              fill: "rgba(51, 85, 255, 1)",
            });

            bufferCircle.mainCircle = activeCircle.current;
            activeCircle.current.bufferCircle = bufferCircle;

            canvas.add(bufferCircle);
          }

          canvas.on("mouse:down", onDrawing);
          listenersRef.current = { onDrawing };
        }

        if (otherCrushFoldObject && otherSideCircle) {
          otherSideCircle?.set({
            padding: 0,
          });

          otherCrushFoldObject?.set({
            padding: 20,
          });

          otherSideCircle?.on("mousedown", changeDrawingDirectionOnCrushFold);
          otherCrushFoldObject?.on(
            "mousedown",
            changeDrawingDirectionOnCrushFold
          );
        } else if (
          startCrushFoldObjectRef.current &&
          endCrushFoldObjectRef.current
        ) {
          canvas.on("mouse:down", () => {
            document
              .getElementById(
                "trigger-both-ends-closed-crush-fold-alert-dialog"
              )
              .click();
          });
        }
      } else {
        if (activeCircle.current) {
          canvas.remove(activeCircle.current.bufferCircle);

          const { x, y } = activeCircle.current.getCenterPoint();

          const bufferCircle = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: "rgba(51, 85, 255, 1)",
            strokeLineCap: "round",
            fill: "rgba(51, 85, 255, 0.2)",
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

          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: "rgba(51, 85, 255, 1)",
          });

          bufferCircle.mainCircle = activeCircle.current;
          activeCircle.current.bufferCircle = bufferCircle;

          canvas.add(bufferCircle);
        }

        canvas.on("mouse:down", onDrawing);
        listenersRef.current = { onDrawing };
      }
    }

    canvas.requestRenderAll();

    return () => {
      const { onDrawing } = listenersRef.current;
      canvas.off("mouse:down");

      if (activeCircle.current) {
        canvas.remove(activeCircle.current.bufferCircle);
        activeCircle.current.set({
          selectable: false,
          padding: 0,
          fill: "#000",
        });
        delete activeCircle.current.bufferCircle;
      }

      tempUndoStack.current = [];

      otherSideCircle?.off("mousedown");
      otherCrushFoldObject?.off("mousedown");

      // canvas
      //   .getObjects()
      //   .filter((o) => o.type === "line" && !o.isHitboxLine)
      //   .forEach((line) => {
      //     canvas.remove(line.lengthAnno);
      //     delete line.lengthAnno;
      //   });

      // canvas
      //   .getObjects()
      //   .filter((o) => o.type === "circle")
      //   .forEach((cir) => {
      //     canvas.remove(cir.angleAnno);
      //     delete cir.lengthAnno;

      //     canvas.bringObjectToFront(cir);
      //   });
    };
  }, [isDrawing]);
}
