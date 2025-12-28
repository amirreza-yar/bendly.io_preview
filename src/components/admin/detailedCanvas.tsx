"use client";
import useGrid from "@/hooks/canvas/useGrid";
import { useCanvasContext } from "@/providers/canvas_providers/canvasContextProvider";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Canvas, config, Group, Line, Point, Rect, Text } from "fabric";
import { useEffect, useRef, useState } from "react";
import PreviewCanvas from "../flashing/preview/previewCanvas";
import {
  addColorSideFlashing,
  centerDrawingGroup,
  create3DFlashing,
  drawingBounds,
  loadFlashing,
} from "@/hooks/canvas/useFlashingLoader";
import { createCrushFoldObject } from "@/utilities/canvas/crushFoldUtils";
import { usePreviewCanvas } from "../flashing/preview/hooks/usePreviewCanvas";
import usePanning from "@/hooks/canvas/usePanning";
import useControls from "@/hooks/canvas/useControls";
import {
  createAngleAnnotationObj,
  getAllCircles,
} from "@/utilities/canvas/canvasUtils";
import { IconButton } from "../uikit/buttons/iconButton";
import {
  Crosshair,
  Ruler,
  RulerBold,
  Taper,
  TaperBold,
  XIcon,
} from "../uikit/icons";
import { IconButtonGroup } from "../uikit/buttons/iconButtonGroup";
import { ZoomIn, ZoomOut } from "lucide-react";
import NavButton from "../flashing/canvas/canvasUI/navbarButton";
import { removeAnnotations } from "@/utilities/canvas/annotationUtils";

export default function DetailedCanvas({
  setShowDetailedCanvas,
  showDetailedCanvas,
  flashing,
}: {
  setShowDetailedCanvas: (param: boolean) => void;
  showDetailedCanvas: boolean;
  flashing: any;
}) {
  //   const canvasRef = useRef<HTMLCanvasElement | null>(null)
  //   const canvasInstance = useRef<Canvas | null>(null)

  const { canvasInstance, canvasRef } = useCanvasContext();
  const [canvasView, setCanvasView] = useState<"ME" | "TA" | "CO">("ME");
  const { createGrid } = useGrid();

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
    // const lengthAnno = new Group([dimLine, tick1, tick2, a1, a2, a3, a4, bg, txt], {
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
      .filter((o) => o.type === "line" && (o.circle1 || o.circle2));

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

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: "#F5F5F5",
      selection: false,
    });

    canvas.setWidth(window.innerWidth - 128);
    canvas.setHeight(window.innerHeight - 128);

    canvasInstance.current = canvas;

    return () => {
      canvasInstance.current?.dispose();
      canvasInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasInstance.current;
    if (!canvas || !flashing) return;

    canvas.clear();
    loadFlashing(canvas, flashing);

    canvasView === "ME" && createAnnotations(false);

    if (flashing.color && canvasView === "CO") {
      const bounds = drawingBounds(canvas);

      removeAnnotations(canvas);

      const groupHeight = bounds?.groupHeight ?? 0;
      addColorSideFlashing(
        canvas,
        flashing.crushFoldDir,
        flashing.startCrushFold,
        flashing.endCrushFold,
        0.8 * Math.sqrt(groupHeight),
        8 * Math.sqrt(groupHeight)
      );
    } else {
      if (flashing.startCrushFold) {
        const startCircle = canvas
          .getObjects()
          .find((obj) => obj.line2 && !obj.line1);

        canvas.add(
          createCrushFoldObject(startCircle, flashing.crushFoldDir, "start")
        );
      }
      if (flashing.endCrushFold) {
        const endCircle = canvas
          .getObjects()
          .find((obj) => !obj.line2 && obj.line1);

        canvas.add(
          createCrushFoldObject(endCircle, flashing.crushFoldDir, "end")
        );
      }
    }

    canvasView === "TA" && create3DFlashing(canvas, true);

    centerDrawingGroup(canvas, 0);
    canvas.renderAll();

    createGrid();
  }, [flashing, canvasView]);

  usePanning();

  useControls();

  return (
    <div className="w-full h-full relative">
      <canvas ref={canvasRef} />

      <IconButton
        className="absolute top-4 right-4 z-200"
        black
        onClick={() => setShowDetailedCanvas(false)}
      >
        <XIcon />
      </IconButton>

      {/* <IconButton
        className="absolute bottom-20 right-4 z-200"
        black
        onClick={() => centerDrawingGroup(canvasInstance.current, -200)}
      >
        <Crosshair />
      </IconButton> */}

      <div
        className="absolute bottom-4 left-[50%] z-50 translate-x-[-50%] flex gap-4 justify-between items-center bg-white rounded-xl px-3 h-16 overflow-scroll no-scrollbar"
        style={{
          boxShadow:
            "0px 2px 16px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        <NavButton
          icon={Ruler}
          iconActive={RulerBold}
          label="Measure"
          active={canvasView === "ME"}
          disabled={false}
          onClick={() => setCanvasView("ME")}
        />
        <NavButton
          icon={Taper}
          iconActive={TaperBold}
          label="Taper"
          active={canvasView === "TA"}
          disabled={false}
          onClick={() => setCanvasView("TA")}
        />
        {flashing?.color && (
          <NavButton
            icon={Crosshair}
            iconActive={ZoomIn}
            label="Color"
            active={canvasView === "CO"}
            disabled={false}
            onClick={() => setCanvasView("CO")}
          />
        )}
      </div>
    </div>
  );
}
