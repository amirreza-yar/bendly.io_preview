import { useEffect, useRef, useState } from 'react'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import {
  calculateLineLength,
  rotateObjectsAroundPoint,
  createAngleAnnotationObj,
  getAllMainLines,
  getAllCircles,
  calculateCircleAngle,
  hasAnyOverlap,
  // createLengthAnnotation,
} from '@/utilities/canvas/canvasUtils'
import { useDebouncedEffect } from '@/utilities/canvas/useDebounce'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
import { Point, Text, Group, Rect, Line, Circle } from 'fabric'
import { useHistory } from './useHistory'
import useObjectUtils from './useObjectUtils'

export default function useBreakLine() {
  const { canvasInstance, isBreakLining, setIsBreakLining, isDrawing, activeCircle, objectsZoomScale } =
    useCanvasContext()

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

    let str

    if (line.breakLineActualLength) {
      str = `${Math.round(line.breakLineActualLength)}`
    } else {
      str = `${Math.round(length)}`
    }
    const tx = mx + normal.x * offset,
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

  // ... existing code ...
  function addBreakLineMarkers(line, canvas, options = {}) {
    // Remove existing markers if any
    removeBreakLineMarkers(line, canvas)

    const { x1, y1, x2, y2 } = line
    const midX = (x1 + x2) / 2
    const midY = (y1 + y2) / 2
    const mainAngle = Math.atan2(y2 - y1, x2 - x1)
    const markerLength = options.markerLength || 11
    const markerAngle = options.markerAngle || (60 * Math.PI) / 180 // 30 degrees in radians
    const color = options.color || '#000'
    const strokeWidth = options.strokeWidth || 2

    // Angles for the two markers
    const angles = [mainAngle + markerAngle, mainAngle - markerAngle]
    const halfMarker = markerLength / 2
    const dx = halfMarker * Math.cos(mainAngle + markerAngle)
    const dy = halfMarker * Math.sin(mainAngle + markerAngle)
    const gapX = 2.5 * Math.cos(mainAngle)
    const gapY = 2.5 * Math.sin(mainAngle)
    const marker2 = new Line(
      [midX - dx + gapX, midY - dy + gapY, midX + dx + gapX, midY + dy + gapY],
      {
        stroke: color,
        strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        excludeFromExport: true,
        breakLineMarker: true,
        strokeLineCap: 'round',
      },
    )

    const marker1 = new Line(
      [midX - dx - gapX, midY - dy - gapY, midX + dx - gapX, midY + dy - gapY],
      {
        stroke: color,
        strokeWidth,
        selectable: false,
        evented: false,
        hoverCursor: 'default',
        excludeFromExport: true,
        breakLineMarker: true,
        strokeLineCap: 'round',
      },
    )

    canvas.add(marker1, marker2)

    line.breakLineMarker1 = marker1
    line.breakLineMarker2 = marker2

    // line.breakLineMarkers = markers
  }
  // ... existing code ...

  // Utility to remove marker lines from a line
  function removeBreakLineMarkers(line, canvas) {
    if (line.breakLineMarker1 && line.breakLineMarker2) {
      canvas.remove(line.breakLineMarker1)
      canvas.remove(line.breakLineMarker2)

      delete line.breakLineMarker1
      delete line.breakLineMarker2
    }
  }

  // Core: scale endpoints and connected circles
  const changeLineLength = (newLength) => {
    if (typeof newLength !== 'number' || isNaN(newLength)) return
    const canvas = canvasInstance.current
    if (!canvas) return
    const selectedLine = canvas.getActiveObject()
    if (!selectedLine || selectedLine.type !== 'line') return

    const oldLen = calculateLineLength(selectedLine)
    if (newLength === oldLen) return
    if (oldLen === 0) return
    const factor = newLength / oldLen
    const dx = (selectedLine.x2 - selectedLine.x1) * (factor - 1)
    const dy = (selectedLine.y2 - selectedLine.y1) * (factor - 1)

    selectedLine.set({
      x2: selectedLine.x2 + dx,
      y2: selectedLine.y2 + dy,
    })

    selectedLine.hitboxLine.set({
      x2: selectedLine.hitboxLine.x2 + dx,
      y2: selectedLine.hitboxLine.y2 + dy,
    })

    selectedLine.setCoords()
    selectedLine.hitboxLine.setCoords()

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

      obj = obj.line2
    }
  }

  const toggleBreakLine = () => {
    // setIsBreakLining(!isBreakLining)
  }

  const activateBreakLine = (canvas) => {
    const allLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.hitboxLine)

    allLines.forEach((line) => {
      if (calculateLineLength(line) > 500) {
        line.breakLineActualLength = calculateLineLength(line)
        canvas.setActiveObject(line)
        changeLineLength(500)
        addBreakLineMarkers(line, canvas)
      }
    })

    if (isDrawing) {
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
  }

  const deactivateBreakLine = (canvas) => {
    const allLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.hitboxLine)

    allLines.forEach((line) => {
      if (line.breakLineActualLength) {
        canvas.setActiveObject(line)
        changeLineLength(line.breakLineActualLength)
        removeBreakLineMarkers(line, canvas)
        delete line.breakLineActualLength
        if (isDrawing) {
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
    })
    createAnnotations()
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const allLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.hitboxLine)

    if (isBreakLining) {
      activateBreakLine(canvas)
    } else {
      deactivateBreakLine(canvas)
    }

    canvas.requestRenderAll()
  }, [isBreakLining])

  useEffect(() => {}, [isBreakLining])

  // useEffect(() => {
  //   if (showBreakLineIcon) {
  //     console.log('breaking')
  //   }
  // }, [showBreakLineIcon])

  return { toggleBreakLine, activateBreakLine, deactivateBreakLine }
}
