'use client'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import { Circle, Text, Line, Point, Rect, Group } from 'fabric'
import {
  createAngleAnnotationObj,
  getAllCircles,
  getAllMainLines,
  // createLengthAnnotation,
} from '@/utilities/canvas/canvasUtils'

export function useHistory() {
  const {
    canvasInstance,
    undoStack,
    redoStack,
    activeCircle,
    isDrawing,
    drwDirRevRef,
    canUndo,
    setCanUndo,
    canRedo,
    setCanRedo,
    tempUndoStack,
    objectsZoomScale,
    setCanvasIsEmpty,
  } = useCanvasContext()

  /**
   * Returns true if any “main” line intersects another non‑neighbor line.
   */
  function hasAnyOverlap(canvas) {
    // Collect only your “real” lines
    const lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)

    // Standard segment–segment intersection test
    function segmentsIntersect(l1, l2) {
      const x1 = l1.x1,
        y1 = l1.y1,
        x2 = l1.x2,
        y2 = l1.y2
      const x3 = l2.x1,
        y3 = l2.y1,
        x4 = l2.x2,
        y4 = l2.y2
      const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4)
      if (denom === 0) return false // parallel or colinear
      const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom
      const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom
      return t >= 0 && t <= 1 && u >= 0 && u <= 1
    }

    for (const line of lines) {
      // Build a Set of its neighbors (which we allow to touch)
      const neighbors = new Set()
      if (line.circle1?.line1) neighbors.add(line.circle1.line1)
      if (line.circle2?.line2) neighbors.add(line.circle2.line2)

      for (const other of lines) {
        if (other === line) continue // skip itself
        if (neighbors.has(other)) continue // skip immediate neighbors

        if (segmentsIntersect(line, other)) {
          return true // found a bad overlap
        }
      }
    }

    return false // no problematic intersections
  }

  const createAngleAnnos = (setOriginalAngle) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const circles = getAllCircles(canvas)

    const activeObj = canvas.getActiveObject()

    circles.forEach((circle) => {
      if (circle.line1 && circle.line2) {
        if (circle.angleAnno) {
          canvas.remove(circle.angleAnno)
        }
        // circle is the common vertex P
        const P = circle.getCenterPoint() // { x:…, y:… }

        // for each connected line, find its other endpoint
        const L1 = circle.line1,
          L2 = circle.line2
        // circle2 is always the “far” endpoint, circle1 is the “start”:
        const A = L1.circle1 === circle ? L1.circle2.getCenterPoint() : L1.circle1.getCenterPoint()
        const B = L2.circle1 === circle ? L2.circle2.getCenterPoint() : L2.circle1.getCenterPoint()

        const color = circle === activeObj ? '#3355FF' : '#9145E2'

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
          },
        )

        circle.angleAnno = angAnno
        angAnno.mainCircle = circle

        circle.isAngleInverted = isAngleInverted
        angAnno.isAngleInverted = isAngleInverted

        angAnno.mainCircle = circle

        setOriginalAngle && (circle.originalAngle = deg)

        circle.angle = deg
        if (angAnno) {
          angAnno._measurementType = 'angle'
          angAnno.perPixelTargetFind = true
          canvas.add(angAnno)
        }
      }
    })
  }

  function createLengthAnnotation(line, prevAngleAnno = null, nextAngleAnno = null, options = {}) {
    let { baseOffset = 10, textGap = 2, endGap = 15, color = '#E50000' } = options
    const canvas = canvasInstance.current
    if (!canvas) return
    const { x1, y1, x2, y2 } = line
    const dx = x2 - x1,
      dy = y2 - y1
    const length = Math.hypot(dx, dy)
    if (length === 0) return null

    // 1) normals on each side of the line
    const n1 = { x: -dy / length, y: dx / length }
    const n2 = { x: dy / length, y: -dx / length }

    // 2) pick the “quietest” side as before...
    function countOnSide(normal) {
      let c = 0
      ;[prevAngleAnno, nextAngleAnno].forEach((anno) => {
        if (!anno) return

        const mx = (x1 + x2) / 2,
          my = (y1 + y2) / 2
        const vx = anno.mid.x - mx,
          vy = anno.mid.y - my
        if (vx * normal.x + vy * normal.y > 0) c++
      })
      return c
    }
    const c1 = countOnSide(n1),
      c2 = countOnSide(n2)
    let normal
    if (c1 < c2) normal = n1
    else if (c2 < c1) normal = n2
    else {
      // tie → side of the larger adjacent angle
      const aPrev = prevAngleAnno?.δAbs || 0
      const aNext = nextAngleAnno?.δAbs || 0

      // pick whichever is bigger; if still tie default to n1
      const chosenAnno = aPrev >= aNext ? prevAngleAnno : nextAngleAnno
      if (chosenAnno) {
        const circle = chosenAnno.mainCircle

        // circle is the common vertex P
        const P = circle.getCenterPoint() // { x:…, y:… }

        // for each connected line, find its other endpoint
        const L1 = circle.line1,
          L2 = circle.line2
        // circle2 is always the “far” endpoint, circle1 is the “start”:
        let A
        try {
          A = L1.circle1 === circle ? L1.circle2.getCenterPoint() : L1.circle1.getCenterPoint()
        } catch {}

        let B
        try {
          B = L2.circle1 === circle ? L2.circle2.getCenterPoint() : L2.circle1.getCenterPoint()
        } catch {}

        // createAngleAnnotation(ax,ay, px,py, bx,by, radius)
        if (A && B) {
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
            },
          )
          circle.angleAnno = angAnno
          angAnno.mainCircle = circle

          circle.isAngleInverted = isAngleInverted
          angAnno.isAngleInverted = isAngleInverted

          angAnno.mainCircle = circle

          baseOffset = 20

          circle.angle = deg
          if (angAnno) {
            angAnno._measurementType = 'angle'
            canvas.remove(chosenAnno)
            canvas.add(angAnno)
          }
        }

        // chosenAnno.mainCircle;

        // see which normal that anno.mid sits on
        const mx = (x1 + x2) / 2,
          my = (y1 + y2) / 2
        const dot = (chosenAnno.mid.x - mx) * n1.x + (chosenAnno.mid.y - my) * n1.y
        normal = dot > 0 ? n1 : n2
      } else {
        normal = n1
      }
    }

    // 3) compute the two candidate base points (un‑shortened)
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2
    const offset = baseOffset
    const p1 = new Point(x1 + normal.x * baseOffset, y1 + normal.y * baseOffset)
    const p2 = new Point(x2 + normal.x * baseOffset, y2 + normal.y * baseOffset)

    // 4) decide per‑end if we should shorten by endGap (angle<90°)
    // const shortenStart = prevAngleAnno && prevAngleAnno.δAbs < Math.PI / 2;
    // const shortenEnd = nextAngleAnno && nextAngleAnno.δAbs < Math.PI / 2;

    const shortenStart = false
    const shortenEnd = false

    // unit along line
    const ux = dx / length,
      uy = dy / length
    // final dim‑line endpoints
    // const q1 = new Point(
    //   p1.x + (shortenStart ? endGap * ux : 0),
    //   p1.y + (shortenStart ? endGap * uy : 0)
    // );
    // const q2 = new Point(
    //   p2.x - (shortenEnd ? endGap * ux : 0),
    //   p2.y - (shortenEnd ? endGap * uy : 0)
    // );

    const q1 = new Point(p1.x, p1.y)
    const q2 = new Point(p2.x, p2.y)

    // 5) draw the parallel dimension line
    const dimLine = new Line([q1.x, q1.y, q2.x, q2.y], {
      stroke: color,
      strokeWidth: 0.5,
      strokeLineCap: 'round',
      selectable: false,
    })

    // 6) arrowheads at q1, q2
    const arrowLen = 4
    // const arrowAngle = 30;
    function makeArrow(pt, dirX, dirY, inverted) {
      // two little lines at ±arrowAngle from the direction
      const tangent = Math.atan2(dirY, dirX)
      const lines = []
      if (inverted) {
        ;[(30 * Math.PI) / 180, (-30 * Math.PI) / 180].forEach((a) => {
          const ang = tangent + Math.PI + a
          lines.push(
            new Line(
              [pt.x, pt.y, pt.x + arrowLen * Math.cos(ang), pt.y + arrowLen * Math.sin(ang)],
              {
                stroke: color,
                strokeWidth: 0.5,
                strokeLineCap: 'round',
                selectable: false,
              },
            ),
          )
        })
      } else {
        ;[(210 * Math.PI) / 180, (-210 * Math.PI) / 180].forEach((a) => {
          const ang = tangent + Math.PI + a
          lines.push(
            new Line(
              [pt.x, pt.y, pt.x + arrowLen * Math.cos(ang), pt.y + arrowLen * Math.sin(ang)],
              {
                stroke: color,
                strokeWidth: 0.5,
                strokeLineCap: 'round',
                selectable: false,
              },
            ),
          )
        })
      }
      return lines
    }
    const [a1, a2] = makeArrow(q1, ux, uy)
    const [a3, a4] = makeArrow(q2, ux, uy, true)

    // 7) little perpendicular tick at the original p1, p2
    const tickLen = 5
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
        strokeLineCap: 'round',
      },
    )
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
        strokeLineCap: 'round',
      },
    )

    // 8) text + background exactly as before
    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
    if (angleDeg > 90 || angleDeg < -90) angleDeg += 180

    const str = `${Math.round(length)}`,
      tx = mx + normal.x * offset,
      ty = my + normal.y * offset

    const txt = new Text(str, {
      left: tx,
      top: ty,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Roboto Flex',
      fontWeight: '500',
      fontSize: 8,
      lineHeight: 10 / 8,
      fill: 'white',
      angle: angleDeg,
      selectable: false,
    })

    const padding = 2,
      bgW = txt.width + padding * 2,
      bgH = 10,
      bg = new Rect({
        left: tx,
        top: ty,
        originX: 'center',
        originY: 'center',
        width: bgW,
        height: bgH,
        rx: 4,
        fill: color,
        angle: angleDeg,
        selectable: false,
      })

    // 9) group everything
    const lengthAnno = new Group([dimLine, tick1, tick2, a1, a2, a3, a4, bg, txt], {
      selectable: true,
      hasControls: false,
      hasBorders: false,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
      _isMeasurement: true,
      _measurementType: 'length',
    })

    return lengthAnno
  }

  function removeAnnotations(canvas) {
    canvas
      .getObjects()
      .filter((obj) => obj._isMeasurement)
      .forEach((obj) => {
        canvas.remove(obj)
      })
  }

  const createAnnotations = (setOriginalAngle) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    removeAnnotations(canvas)

    createAngleAnnos(setOriginalAngle)

    // const lines = getAllMainLines(canvas);

    const lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)

    const activeObj = canvas.getActiveObject()

    lines.forEach((line) => {
      if (line.lengthAnno) {
        canvas.remove(line.lengthAnno)
      }

      const color = '#E50000'

      const lengthAnno = createLengthAnnotation(
        line,
        line.circle1.angleAnno,
        line.circle2.angleAnno,
        { color: color },
      )
      line.lengthAnno = lengthAnno
      lengthAnno.mainLine = line
      lengthAnno.perPixelTargetFind = true
      canvas.add(lengthAnno)
    })
    canvas.requestRenderAll()
  }

  const moveCircle = (movingCircle, position) => {
    if (position) {
      const { x, y } = position
      movingCircle.set({ left: x, top: y })
    } else {
      const { x, y } = movingCircle.getCenterPoint()
    }
    movingCircle.line1 &&
      movingCircle.line1.set({
        x2: movingCircle.left,
        y2: movingCircle.top,
      }) &&
      movingCircle.line1.setCoords()
    movingCircle.line2 &&
      movingCircle.line2.set({
        x1: movingCircle.left,
        y1: movingCircle.top,
      })
    movingCircle.line1 && movingCircle.line1.setCoords()
    movingCircle.line2 && movingCircle.line2.setCoords()
    movingCircle.setCoords()
  }

  const repositionHitboxLine = (movingCircle) => {
    const { x, y } = movingCircle.getCenterPoint()
    movingCircle.line1?.hitboxLine &&
      movingCircle.line1.hitboxLine.set({
        x2: movingCircle.left,
        y2: movingCircle.top,
      }) &&
      movingCircle.line1.hitboxLine.setCoords()
    movingCircle.line2?.hitboxLine &&
      movingCircle.line2.hitboxLine.set({
        x1: movingCircle.left,
        y1: movingCircle.top,
      })
    movingCircle.bufferCircle?.set({ left: x, top: y })
    movingCircle.line1?.hitboxLine && movingCircle.line1.hitboxLine.setCoords()
    movingCircle.line2?.hitboxLine && movingCircle.line2.hitboxLine.setCoords()
  }

  // 1) before you actually delete anything, build a snapshot
  function makeRemoveSnapshot(selectedLines) {
    return selectedLines.map((line) => {
      return {
        // fabric objects themselves
        line: line,
        hitboxLine: line.hitboxLine,
        circle1: line.circle1,
        circle2: line.circle2,
        x1: line.x1,
        y1: line.y1,
        x2: line.x2,
        y2: line.y2,
        // original coords
        // lineCoords: { x1: line.x1, y1: line.y1, x2: line.x2, y2: line.y2 },
        c1Coords: line.circle1.getCenterPoint(),
        c2Coords: line.circle2.getCenterPoint(),
        // neighbor pointers so we can re‐link
        n1: line.circle1.line1, // whatever was pointing into circle1
        n2: line.circle2.line2, // …
      }
    })
  }

  const restoreRemovedLine = (selectedLine) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    selectedLine.line.set({
      selectable: false,
      stroke: '#000',
      strokeDashArray: [0, 0],
    })

    selectedLine.hitboxLine.set({
      selectable: false,
      stroke: 'rgba(0, 0, 0, 0.05)',
    })

    canvas.add(selectedLine.line)
    canvas.add(selectedLine.hitboxLine)

    // selectedLine.line.circle1 = selectedLine.circle1;
    // selectedLine.line.circle2 = selectedLine.circle2;

    // selectedLine.circle1.line2 = selectedLine.line;
    // selectedLine.circle2.line1 = selectedLine.line;

    if (selectedLine.circle2.line2) {
      const dx = selectedLine.x2 - selectedLine.x1
      const dy = selectedLine.y2 - selectedLine.y1

      let obj = selectedLine
      while (obj) {
        obj = obj.circle2
        obj.set({
          left: obj.left + dx,
          top: obj.top + dy,
        })
        obj.setCoords()
        if (obj.line1) {
          obj.line1.set({ x2: obj.left, y2: obj.top })
          obj.line1.hitboxLine.set({ x2: obj.left, y2: obj.top })
          obj.line1.setCoords()
          obj.line1.hitboxLine.setCoords()
        }
        if (obj.line2) {
          obj.line2.set({ x1: obj.left, y1: obj.top })
          obj.line2.hitboxLine.set({ x1: obj.left, y1: obj.top })
          obj.line2.setCoords()
          obj.line2.hitboxLine.setCoords()
        }

        obj.setCoords()

        obj = obj.line2
      }

      // selectedLine.circle1.line1.circle2.line2 = selectedLine.line;
      selectedLine.circle2.line2.circle1 = selectedLine.circle2
      selectedLine.circle1.line2 = selectedLine.line
    } else {
      // !selectedLine.circle2.line2 &&
      //   !selectedLine.circle1.line1 &&
      //   (drwDirRevRef.current = false);

      selectedLine.circle1.line2 = selectedLine.line

      if (selectedLine.circle1 === activeCircle.current) {
        canvas.remove(activeCircle.current.bufferCircle)
        activeCircle.current.set({ fill: '#000' })
        activeCircle.current = selectedLine.circle2
        if (isDrawing) {
          // create a fresh buffer around the now‑active circle
          activeCircle.current.bufferCircle && canvas.remove(activeCircle.current.bufferCircle)

          const zoom = canvas.getZoom()
          const { x, y } = activeCircle.current.getCenterPoint()
          const buffer = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
            strokeLineCap: 'round',
            fill: 'rgba(51, 85, 255, 0.2)',
            originX: 'center',
            originY: 'center',
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
          })
          activeCircle.current.bufferCircle = buffer
          buffer.mainCircle = activeCircle.current
          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: 'rgba(51, 85, 255, 1)',
          })
          canvas.add(buffer)
        }
      }
    }
    canvas.add(selectedLine.line.circle2)
  }

  const removeLine = (selectedLine) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    if (selectedLine.circle2.line2) {
      const dx = selectedLine.x1 - selectedLine.x2
      const dy = selectedLine.y1 - selectedLine.y2
      let obj = selectedLine
      while (obj) {
        obj = obj.circle2
        obj.set({
          left: obj.left + dx,
          top: obj.top + dy,
        })
        obj.setCoords()
        if (obj.line1) {
          obj.line1.set({ x2: obj.left, y2: obj.top })
          obj.line1.hitboxLine.set({ x2: obj.left, y2: obj.top })
          obj.line1.setCoords()
          obj.line1.hitboxLine.setCoords()
        }
        if (obj.line2) {
          obj.line2.set({ x1: obj.left, y1: obj.top })
          obj.line2.hitboxLine.set({ x1: obj.left, y1: obj.top })
          obj.line2.setCoords()
          obj.line2.hitboxLine.setCoords()
        }

        obj.setCoords()

        obj = obj.line2
      }

      selectedLine.circle2.line2.circle1 = selectedLine.circle1
      selectedLine.circle1.line2 = selectedLine.circle2.line2
    }
    // else if (!selectedLine.circle2.line2 && !selectedLine.circle1.line1) {
    //   canvas.remove(selectedLine.circle1);
    //   // drwDirRevRef.current = false;
    //   activeCircle.current = null;
    //   // canvas.remove(activeCircle.current.bufferCircle);
    // }
    else {
      selectedLine.circle1.line2 = null
      if (selectedLine.circle2 === activeCircle.current) {
        canvas.remove(activeCircle.current.bufferCircle)
        activeCircle.current.set({ fill: '#000' })
        activeCircle.current = selectedLine.circle1
        if (isDrawing) {
          // create a fresh buffer around the now‑active circle

          const zoom = canvas.getZoom()
          const { x, y } = activeCircle.current.getCenterPoint()
          const buffer = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
            strokeLineCap: 'round',
            fill: 'rgba(51, 85, 255, 0.2)',
            originX: 'center',
            originY: 'center',
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
          })
          activeCircle.current.bufferCircle = buffer
          buffer.mainCircle = activeCircle.current
          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: 'rgba(51, 85, 255, 1)',
          })
          canvas.add(buffer)
        }
      }
    }
    canvas.remove(selectedLine.circle2)
    canvas.remove(selectedLine.line)
    canvas.remove(selectedLine.hitboxLine)
  }

  // Deep snapshot helper
  const snapshotCircles = (circles, keyA, keyB = null) => {
    // keyA: undoPosition field, keyB: redoPosition field
    return circles.map((circle) => ({
      type: 'circle',
      circle,
      undoPosition: keyA && circle[keyA] ? { ...circle[keyA] } : null,
      redoPosition: keyB && circle[keyB] ? { ...circle[keyB] } : null,
    }))
  }

  const addHistory = (type, snapshot, isTemp = false) => {
    if (isTemp) {
      tempUndoStack.current.push({ type, snapshot })
    } else {
      undoStack.current.push({ type, snapshot })
    }
    redoStack.current = []
    setCanRedo(false)
    setCanUndo(true)
  }

  const tempUndo = () => {
    const canvas = canvasInstance.current
    if (!canvas || !undoStack.current.length) return
    const prev = tempUndoStack.current.pop()
    switch (prev.type) {
      case 'drawing':
        const cir = prev.snapshot
        // if it was the active, remove its buffer & restore activeCircle
        if (cir === activeCircle.current) {
          canvas.remove(activeCircle.current.bufferCircle)

          if (drwDirRevRef.current) {
            cir.line2 && (activeCircle.current = cir.line2.circle2)
          } else {
            cir.line1 && (activeCircle.current = cir.line1.circle1)
          }
        }

        canvas.bringObjectToFront(activeCircle.current)

        // remove the connecting line + hitbox
        if (cir.line2) {
          delete cir.line2.circle2.line1
          canvas.remove(cir.line2.hitboxLine)
          canvas.remove(cir.line2)
        } else if (cir.line1) {
          delete cir.line1.circle1.line2
          canvas.remove(cir.line1.hitboxLine)
          canvas.remove(cir.line1)
        }
        // finally remove the circle itself
        canvas.remove(cir)

        const line = cir.line2 || cir.line1

        // if still in drawing mode, re‑buffer the new active
        if (isDrawing && activeCircle.current && line) {
          // create a fresh buffer around the now‑active circle
          activeCircle.current.bufferCircle && canvas.remove(activeCircle.current.bufferCircle)

          const zoom = canvas.getZoom()
          const { x, y } = activeCircle.current.getCenterPoint()
          const buffer = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
            strokeLineCap: 'round',
            fill: 'rgba(51, 85, 255, 0.2)',
            originX: 'center',
            originY: 'center',
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
          })
          activeCircle.current.bufferCircle = buffer
          buffer.mainCircle = activeCircle.current
          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: 'rgba(51, 85, 255, 1)',
          })
          canvas.add(buffer)
        }
        createAnnotations()
        break

      case 'resize': {
        console.log('current temp undo stack: ', tempUndoStack.current)
        prev.snapshot.forEach((item) => {
          // console.log();
          if (item.type === 'circle' && item.undoPosition) {
            moveCircle(item.circle, item.undoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'move': {
        prev.snapshot.forEach((item) => {
          if (item.type === 'circle' && item.undoPosition) {
            moveCircle(item.circle, item.undoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'remove': {
        // undo: re‐add everything
        prev.snapshot
          .slice()
          .reverse()
          .forEach((line) => {
            restoreRemovedLine(line)
          })
        createAnnotations()
        break
      }
    }
    canvas.renderAll()
  }

  const undo = () => {
    const canvas = canvasInstance.current
    if (!canvas || !undoStack.current.length) return
    const prev = undoStack.current.pop()
    setCanUndo(Boolean(undoStack.current.length))
    setCanRedo(true)
    switch (prev.type) {
      case 'drawing':
        const cir = prev.snapshot
        // if it was the active, remove its buffer & restore activeCircle
        if (cir === activeCircle.current) {
          canvas.remove(activeCircle.current.bufferCircle)

          if (drwDirRevRef.current) {
            cir.line2 && (activeCircle.current = cir.line2.circle2)
          } else {
            cir.line1 && (activeCircle.current = cir.line1.circle1)
          }
        }

        canvas.bringObjectToFront(activeCircle.current)

        // remove the connecting line + hitbox
        if (cir.line2) {
          delete cir.line2.circle2.line1
          canvas.remove(cir.line2.hitboxLine)
          canvas.remove(cir.line2)
        } else if (cir.line1) {
          delete cir.line1.circle1.line2
          canvas.remove(cir.line1.hitboxLine)
          canvas.remove(cir.line1)
        }
        // finally remove the circle itself
        canvas.remove(cir)

        const line = cir.line2 || cir.line1

        // if still in drawing mode, re‑buffer the new active
        if (isDrawing && activeCircle.current && line) {
          // create a fresh buffer around the now‑active circle
          activeCircle.current.bufferCircle && canvas.remove(activeCircle.current.bufferCircle)

          const zoom = canvas.getZoom()
          const { x, y } = activeCircle.current.getCenterPoint()
          const buffer = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
            strokeLineCap: 'round',
            fill: 'rgba(51, 85, 255, 0.2)',
            originX: 'center',
            originY: 'center',
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
          })
          activeCircle.current.bufferCircle = buffer
          buffer.mainCircle = activeCircle.current
          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: 'rgba(51, 85, 255, 1)',
          })
          canvas.add(buffer)
        }

        createAnnotations()
        break

      case 'resize': {
        prev.snapshot.forEach((item) => {
          if (item.type === 'circle' && item.undoPosition) {
            moveCircle(item.circle, item.undoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'move': {
        prev.snapshot.forEach((item) => {
          if (item.type === 'circle' && item.undoPosition) {
            moveCircle(item.circle, item.undoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'remove': {
        // undo: re‐add everything
        prev.snapshot
          .slice()
          .reverse()
          .forEach((line) => {
            restoreRemovedLine(line)
          })
        createAnnotations()
        break
      }
    }

    const allLines = getAllMainLines(canvas)
    allLines.length === 0 ? setCanvasIsEmpty(true) : setCanvasIsEmpty(false)

    // push onto redo
    redoStack.current.push(prev)
    // canvas.renderAll();
  }

  const redo = () => {
    const canvas = canvasInstance.current
    if (!canvas || !redoStack.current.length) return
    const next = redoStack.current.pop()
    setCanRedo(Boolean(redoStack.current.length))
    setCanUndo(true)
    switch (next.type) {
      case 'drawing':
        const cir = next.snapshot
        // re‑add the circle

        // re‑add its connecting line + hitbox
        const line = cir.line2 || cir.line1
        line && canvas.add(line.hitboxLine) && canvas.add(line)
        canvas.add(cir)
        line && cir.line1 && (line.circle1.line2 = line)
        line && cir.line2 && (line.circle2.line1 = line)
        if (line) {
          if (line.circle1 === activeCircle.current && !drwDirRevRef.current) {
            console.log('line.circle1')
            canvas.remove(activeCircle.current.bufferCircle)
            activeCircle.current.set({
              fill: '#000',
            })
            activeCircle.current = cir
          } else if (line.circle2 === activeCircle.current && drwDirRevRef.current) {
            console.log('line.circle2')
            canvas.remove(activeCircle.current.bufferCircle)
            activeCircle.current.set({
              fill: '#000',
            })
            activeCircle.current = cir
          }
        }

        canvas.bringObjectToFront(cir)

        // re‑buffer it
        if (isDrawing) {
          activeCircle.current.bufferCircle && canvas.remove(activeCircle.current.bufferCircle)
          let currentZoom = canvas.getZoom()
          const { x, y } = activeCircle.current.getCenterPoint()

          const bufferCircle = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
            strokeLineCap: 'round',
            fill: 'rgba(51, 85, 255, 0.2)',
            originX: 'center',
            originY: 'center',
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
          })

          activeCircle.current.set({
            radius: 4 / objectsZoomScale.current,
            fill: 'rgba(51, 85, 255, 1)',
          })

          bufferCircle.mainCircle = activeCircle.current
          activeCircle.current.bufferCircle = bufferCircle

          canvas.add(bufferCircle)
        }
        createAnnotations()
        break

      case 'resize': {
        next.snapshot.forEach((item) => {
          if (item.type === 'circle' && item.redoPosition) {
            moveCircle(item.circle, item.redoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'move': {
        next.snapshot.forEach((item) => {
          if (item.type === 'circle' && item.redoPosition) {
            moveCircle(item.circle, item.redoPosition)
            repositionHitboxLine(item.circle)
          }
        })
        createAnnotations()
        break
      }

      case 'remove': {
        // undo: re‐add everything
        next.snapshot.forEach((line) => {
          removeLine(line)
        })
        createAnnotations()
        break
      }
    }
    const allLines = getAllMainLines(canvas)
    allLines.length === 0 ? setCanvasIsEmpty(true) : setCanvasIsEmpty(false)
    // push back to undo
    undoStack.current.push(next)
    // canvas.renderAll();
  }

  return {
    undo,
    redo,
    tempUndo,
    addHistory,
    snapshotCircles,
    makeRemoveSnapshot,
  }
}
