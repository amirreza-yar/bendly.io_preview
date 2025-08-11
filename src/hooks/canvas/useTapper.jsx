import { useEffect, useRef, useState } from 'react'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import { Point, Line, Group, Rect, Text, Path, Gradient, Circle } from 'fabric'
import {
  calculateLineLength,
  createAngleAnnotationObj,
  getAllCircles,
  getAllMainLines,
  hasAnyOverlap,
} from '@/utilities/canvas/canvasUtils'
import { removeAnnotations } from '@/utilities/canvas/annotationUtils'
import { useDebouncedEffect } from '@/utilities/canvas/useDebounce'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
import useObjectUtils from './useObjectUtils'

/**
 * useTapper: Handles tapper mode, 2D-to-3D transformation, and line length editing for flashing.
 */
export default function useTapper() {
  const {
    canvasInstance,
    isTappering,
    // setIsDrawing,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    objectsZoomScale,
    setHasEditModalChanges,
  } = useCanvasContext()
  const {
    setTopBarVisible,
    setActionBarVisible,
    setTapperingTopBarVisible,
    setTapperingActionBarVisible,
  } = useUIVisibility()
  const [activeSide, setActiveSide] = useState(null) // 'A' or 'B'
  const activeLine = useRef(null)
  const [isTaperingDrawerOpen, setIsTaperingDrawerOpen] = useState(false)
  const [objValue, setObjValue] = useState(0)
  const [objOriginalValue, setObjOriginalValue] = useState(0)
  const [objName, setObjName] = useState('')
  const triggerRef = useRef(null)
  const inputRef = useRef(null)
  const prevOpenRef = useRef(isTaperingDrawerOpen)
  const shouldUseNegativeXOffsetRef = useRef(false)

  function customizeAnnotationStyle(annoGroup, { stroke, fill, bgFill, textFill }) {
    // Children are in annoGroup._objects
    annoGroup._objects.forEach((obj) => {
      if (obj instanceof Text) {
        if (textFill) obj.set('fill', textFill)
      } else if (obj instanceof Rect) {
        if (bgFill) obj.set('fill', bgFill)
      } else {
        // lines, ticks, arrows, paths, etc.
        if (stroke) obj.set('stroke', stroke)
        // if (fill && obj.set("fill")) obj.set("fill", fill);
      }
      obj.setCoords()
    })

    // re‑render
    // annoGroup.canvas.requestRenderAll();
  }

  const createAngleAnnos = (setOriginalAngle) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const circles = getAllCircles(canvas)

    // const activeObj = canvas.getActiveObject()

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

        const color = '#9145E2'

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
        const A = L1.circle1 === circle ? L1.circle2.getCenterPoint() : L1.circle1.getCenterPoint()
        const B = L2.circle1 === circle ? L2.circle2.getCenterPoint() : L2.circle1.getCenterPoint()

        const activeObj = canvas.getActiveObject()
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

  const createAnnotations = (setOriginalAngle) => {
    const canvas = canvasInstance.current
    if (!canvas) return
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

      if (line.isTapered) {
        const x1 = line.x1
        const y1 = line.y1
        const x2 = line.x2
        const y2 = line.y2

        // Compute 3/4 point on the line
        const px = x1 + 0.75 * (x2 - x1)
        const py = y1 + 0.75 * (y2 - y1)

        const dx = x2 - x1
        const dy = y2 - y1
        const length = Math.sqrt(dx * dx + dy * dy)

        // Perpendicular unit vector for offsetting the flag
        const ux = -dy / length
        const uy = dx / length

        // Offsets to avoid overlap with line
        const flagOffset = 20
        const textOffsetX = ux * flagOffset
        const textOffsetY = uy * flagOffset

        // Final flag position
        const fx = px + textOffsetX
        const fy = py + textOffsetY

        const flagText = new Text('Tapered', {
          fontSize: 8,
          fontFamily: 'Roboto Flex',
          fontWeight: 500,
          fill: 'white',
          originX: 'center',
          originY: 'center',
          left: fx,
          top: fy,
          selectable: false,
        })

        const flagBg = new Rect({
          left: fx,
          top: fy,
          rx: 4,
          originX: 'center',
          originY: 'center',
          height: 10,
          width: flagText.width + 6,
          fill: '#F97316',
          selectable: false,
          evented: false,
        })

        const circle = new Circle({
          radius: 3,
          fill: '#F97316',
          left: px,
          top: py,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        })

        const lineConnector = new Line([px, py, fx, fy], {
          stroke: '#F97316',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })

        const flagGroup = new Group([flagBg, lineConnector, circle, flagText], {
          selectable: false,
          evented: false,
        })

        flagGroup._isMeasurement = true
        canvasInstance.current.add(flagGroup)
      }

      line.lengthAnno = lengthAnno
      lengthAnno.mainLine = line
      lengthAnno.perPixelTargetFind = true
      canvas.add(lengthAnno)
    })
    canvas.requestRenderAll()
  }

  const setActiveLine = (line) => (activeLine.current = line)

  const { centerDrawingGroup } = useObjectUtils()

  // Parameters for 3D effect
  const offset3D = { x: 180, y: -145 }
  const drawConnectingLines = true // Flag to control drawing connecting lines
  const annotationOffset = 22 // Distance of annotations from lines

  // Helper: Determine if a line is likely horizontal or vertical
  function isLineHorizontal(line) {
    const dx = Math.abs(line.x2 - line.x1)
    const dy = Math.abs(line.y2 - line.y1)
    return dx > dy
  }

  // Helper: Determine if the shape is like the second image (negative x offset)
  function shouldUseNegativeXOffset(aLines) {
    if (aLines.length >= 2) {
      const firstLine = aLines[0]
      const secondLine = aLines[1]
      return isLineHorizontal(firstLine) && !isLineHorizontal(secondLine)
    }
    return false
  }

  // Helper: Create gradient path between two lines
  function createGradientPath(aLine, bLine) {
    // Create a trapezoid path using the four points
    const pathData = `M ${aLine.x1} ${aLine.y1} 
                     L ${aLine.x2} ${aLine.y2} 
                     L ${bLine.x2} ${bLine.y2} 
                     L ${bLine.x1} ${bLine.y1} 
                     Z`

    const gradient = new Gradient({
      type: 'linear',
      gradientUnits: 'percentage', // or 'percentage'
      coords: { x1: 0, y1: 0, x2: 1, y2: 0 },
      colorStops: [
        { offset: 0, color: 'rgba(100, 116, 139, 0.15)' },
        { offset: 1, color: 'rgba(255, 255, 255, 0.15)' },
      ],
    })

    return new Path(pathData, {
      fill: gradient,
      selectable: false,
      evented: false,
      // opacity: 0.08,
    })
  }

  function removeLengthAnnotations(canvas) {
    const annos = canvas.getObjects().filter((obj) => obj.type === 'group' && obj._isMeasurement)
    //console.log('annos: ', annos)
    for (let i = 0; i < annos.length; i++) {
      canvas.remove(annos[i])
    }

    canvas.requestRenderAll()
  }

  // Helper: Add a length annotation to a line
  function addLengthAnnotation(line, side, negativeOffset, showTaperedFlag = true) {
    const length = Math.round(calculateLineLength(line))
    const isHorizontal = isLineHorizontal(line)

    let mx = (line.x1 + line.x2) / 2
    let my = (line.y1 + line.y2) / 2
    let myf, mxf

    if (negativeOffset) {
      if (isHorizontal) {
        my -= annotationOffset
      } else {
        mx -= annotationOffset
      }
    } else {
      if (isHorizontal) {
        my += annotationOffset
      } else {
        mx += annotationOffset
      }
    }

    const color = line.isActive ? '#3355FF' : line.side === 'A' ? '#E50000' : '#475569'
    const label = `${side}-${length}`

    const txt = new Text(label, {
      left: mx,
      top: my,
      originX: 'center',
      originY: 'center',
      fontFamily: 'Roboto Flex',
      fontWeight: '500',
      fontSize: 8,
      lineHeight: 10 / 8,
      fill: 'white',
      selectable: false,
    })

    const bg = new Rect({
      left: mx,
      top: my,
      originX: 'center',
      originY: 'center',
      width: txt.width + 8,
      height: 10,
      rx: 4,
      fill: color,
      selectable: false,
      evented: false,
    })

    const group = new Group([bg, txt], {
      selectable: false,
      opacity: 1,
    })
    group._isMeasurement = true
    canvasInstance.current.add(group)

    line.tapperAnno = group
    group.on('mousedown', () => handleLineClick(line))

    let isLineTapered = false

    if (line.side === 'A') {
      Math.round(Math.round(calculateLineLength(line.bSideLine))) !==
        Math.round(calculateLineLength(line)) && (isLineTapered = true)
    }

    // ======= Tapered Flag (custom path) ========
    if (isLineTapered) {
      const x1 = line.x1
      const y1 = line.y1
      const x2 = line.x2
      const y2 = line.y2

      // Compute 3/4 point on the line
      const px = x1 + 0.75 * (x2 - x1)
      const py = y1 + 0.75 * (y2 - y1)

      const dx = x2 - x1
      const dy = y2 - y1
      const length = Math.sqrt(dx * dx + dy * dy)

      // Perpendicular unit vector for offsetting the flag
      const ux = -dy / length
      const uy = dx / length

      // Offsets to avoid overlap with line
      const flagOffset = -20
      const textOffsetX = ux * flagOffset
      const textOffsetY = uy * flagOffset

      // Final flag position
      const fx = px + textOffsetX
      const fy = py + textOffsetY

      const flagText = new Text('Tapered', {
        fontSize: 8,
        fontFamily: 'Roboto Flex',
        fontWeight: 500,
        fill: 'white',
        originX: 'center',
        originY: 'center',
        left: fx,
        top: fy,
        selectable: false,
      })

      const flagBg = new Rect({
        left: fx,
        top: fy,
        rx: 4,
        originX: 'center',
        originY: 'center',
        height: 10,
        width: flagText.width + 6,
        fill: '#F97316',
        selectable: false,
        evented: false,
      })

      const circle = new Circle({
        radius: 3,
        fill: '#F97316',
        left: px,
        top: py,
        originX: 'center',
        originY: 'center',
        selectable: false,
        evented: false,
      })

      const lineConnector = new Line([px, py, fx, fy], {
        stroke: '#F97316',
        strokeWidth: 1,
        selectable: false,
        evented: false,
      })

      const flagGroup = new Group([flagBg, lineConnector, circle, flagText], {
        selectable: false,
        evented: false,
      })

      flagGroup._isMeasurement = true
      canvasInstance.current.add(flagGroup)

      line.taperedAnno = flagGroup
    }
  }

  // Function to handle line selection
  function handleLineSelection(line, isSelected) {
    if (!line) return

    const strokeColor = isSelected ? '#3355FF' : '#000'
    const annotationColor = isSelected ? '#3355FF' : line.side === 'A' ? '#E50000' : '#475569'

    // Update line stroke
    line.set({ stroke: strokeColor })
    if (line.hitboxLine) line.hitboxLine.set({ stroke: strokeColor })
    if (line.hitboxLine_B) line.hitboxLine_B.set({ stroke: strokeColor })

    // Update annotation color if exists
    if (line.tapperAnno) {
      const bg = line.tapperAnno._objects[0]
      bg.set({ fill: annotationColor })
    }

    canvasInstance.current.requestRenderAll()
  }

  // Function to create circle for B side
  function createBCircle(x, y) {
    const circle = new Circle({
      left: x,
      top: y,
      radius: 0.3,
      originX: 'center',
      originY: 'center',
      fill: '#CBD5E1',
      stroke: '#CBD5E1',
      strokeWidth: 1,
      selectable: false,
      hasControls: false,
      hasBorders: false,
      lockRotation: true,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
      padding: 0,
      selectable: false,
      evented: false,
    })
    circle.side = 'B'

    return circle
  }

  // Core: scale endpoints and connected circles
  const changeLineLength = (newLength) => {
    if (typeof newLength !== 'number' || isNaN(newLength)) return
    const canvas = canvasInstance.current
    if (!canvas) return
    const selectedLine = canvas.getActiveObject()
    //console.log(selectedLine)
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

    if (selectedLine.side === 'A') {
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

        obj.crushFoldObject?.set({
          left: obj.crushFoldObject.left + dx,
          top: obj.crushFoldObject.top + dy,
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

      // Math.round(calculateLineLength(selectedLine.bSideLine)) !== newLength
      //   ? (selectedLine.isTapered = true)
      //   : (selectedLine.isTapered = false)
    } else {
      selectedLine.hitboxLine_B.set({
        x2: selectedLine.hitboxLine_B.x2 + dx,
        y2: selectedLine.hitboxLine_B.y2 + dy,
      })

      selectedLine.setCoords()
      selectedLine.hitboxLine_B.setCoords()

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
          obj.line1.hitboxLine_B.set({ x2: obj.left, y2: obj.top })
          obj.line1.setCoords()
          obj.line1.hitboxLine_B.setCoords()
        }
        if (obj.line2) {
          obj.line2.set({ x1: obj.left, y1: obj.top })
          obj.line2.hitboxLine_B.set({ x1: obj.left, y1: obj.top })
          obj.line2.setCoords()
          obj.line2.hitboxLine_B.setCoords()
        }

        obj = obj.line2
      }
      selectedLine.aSideLine.bSideLineLength = newLength
      // Math.round(calculateLineLength(selectedLine.aSideLine)) !== newLength
      //   ? (selectedLine.aSideLine.isTapered = true)
      //   : (selectedLine.aSideLine.isTapered = false)
    }
    createAllSideAnnotations(canvas)
    removeGradientsAndConnectingLines(canvas)
    createAndAddGradientsAndConnectingLines(canvas)

    // selectedLine.__temp_undo = calculateLineLength(selectedLine)
  }

  const clearInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  // Openning the drawer and hiding top and action bar
  useEffect(() => {
    // only click if the value actually changed
    if (prevOpenRef.current !== isTaperingDrawerOpen) {
      triggerRef.current?.click()
      prevOpenRef.current = isTaperingDrawerOpen
    }

    if (isTaperingDrawerOpen) {
      setTapperingTopBarVisible(false)
      setTapperingActionBarVisible(false)
      centerDrawingGroup(50, 500, 20)
    }
  }, [isTaperingDrawerOpen])

  // Handler: Handle line click for length editing
  function handleLineClick(line) {
    // Reset previous selection
    if (activeLine.current) {
      // handleLineSelection(activeLine.current, false)
      activeLine.current.isActive = false

      if (activeLine.current.side === 'A') {
        activeLine.current.set({ stroke: '#000' })
        activeLine.current.hitboxLine.set({ stroke: 'rgba(0, 0, 0, 0.005)' })

        canvasInstance.current.remove(activeLine.current.tapperAnno)

        addLengthAnnotation(activeLine.current, 'A', !shouldUseNegativeXOffsetRef.current)
      } else {
        activeLine.current.set({ stroke: '#CBD5E1' })
        activeLine.current.hitboxLine_B.set({ stroke: 'rgba(0, 0, 0, 0.005)' })
        addLengthAnnotation(activeLine.current, 'B', shouldUseNegativeXOffsetRef.current)
      }
    }

    activeLine.current = line
    setActiveSide(line.side)
    setObjValue(Math.round(calculateLineLength(line)))
    setObjOriginalValue(Math.round(calculateLineLength(line)))
    setObjName(`${line.side}-${Math.round(calculateLineLength(line))}`)
    setIsTaperingDrawerOpen(true)

    clearInputValue()

    canvasInstance.current.setActiveObject(line)

    line.isActive = true

    if (activeLine.current.side === 'A') {
      activeLine.current.set({ stroke: '#3355FF' })

      canvasInstance.current.remove(activeLine.current.tapperAnno)

      addLengthAnnotation(activeLine.current, 'A', !shouldUseNegativeXOffsetRef.current)
    } else {
      activeLine.current.set({ stroke: '#3355FF' })
      addLengthAnnotation(activeLine.current, 'B', shouldUseNegativeXOffsetRef.current)
    }
  }

  // Function to create and add gradients and connecting lines between A and B sides
  function createAndAddGradientsAndConnectingLines(
    canvas,
    // aPoints,
    // bPoints,
    // aLines,
    // bLines,
    drawConnectingLines = true,
  ) {
    const aLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.side === 'A')
    // const bLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.side === 'B')

    // //console.log(aLines[1].x1)

    let aLinesInOrder = []

    let baseLine

    for (let i = 0; i < aLines.length; i++) {
      if (!aLines[i].circle1.line1) {
        baseLine = aLines[i]
      }
    }

    for (let i = 0; i < aLines.length; i++) {
      aLinesInOrder.push(baseLine)

      baseLine = baseLine.circle2.line2
    }

    let points = [
      {
        x1: aLinesInOrder[0].x1,
        y1: aLinesInOrder[0].y1,
        x2: aLinesInOrder[0].bSideLine.x1,
        y2: aLinesInOrder[0].bSideLine.y1,
      },
    ]

    for (let i = 0; i < aLinesInOrder.length; i++) {
      points.push({
        x1: aLinesInOrder[i].x2,
        y1: aLinesInOrder[i].y2,
        x2: aLinesInOrder[i].bSideLine.x2,
        y2: aLinesInOrder[i].bSideLine.y2,
      })
    }

    //console.log('points length: ', points.length)

    const createdObjects = []
    for (let i = 0; i <= aLines.length; i++) {
      // Add connecting line if enabled
      if (drawConnectingLines) {
        //console.log(aLines[i])
        const line = new Line([points[i].x1, points[i].y1, points[i].x2, points[i].y2], {
          stroke: '#CBD5E1',
          strokeWidth: 1,
          selectable: false,
          evented: false,
          strokeLineCap: 'round',
          hasControls: false,
          hasBorders: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          objectCaching: true,
          statefullCache: true,
        })

        line.connetingLine = true

        canvas.add(line)
        canvas.sendObjectToBack(line)
        createdObjects.push(line)
      }
      if (i !== aLines.length) {
        // Add gradient path between corresponding A and B lines
        const path = createGradientPath(aLines[i], aLines[i].bSideLine)
        path.connetingPath = true
        canvas.add(path)
        createdObjects.push(path)
      }
    }
    return createdObjects
  }

  // Function to remove gradients and connecting lines
  function removeGradientsAndConnectingLines(canvas) {
    const objectsToRemove = canvas
      .getObjects()
      .filter((obj) => obj.connetingLine || obj.connetingPath)
    objectsToRemove.forEach((obj) => canvas.remove(obj))
    canvas.requestRenderAll()
  }

  function create3DFlashing() {
    const canvas = canvasInstance.current
    if (!canvas) return

    // Clear existing 3D elements
    const existingElements = canvas
      .getObjects()
      .filter((obj) => obj.side === 'B' || obj._isMeasurement || obj.type === 'path')
    existingElements.forEach((obj) => canvas.remove(obj))

    // DEBUG: Log all lines
    const allLines = getAllMainLines(canvas)
    //console.log('All lines on canvas:', allLines)

    // 1. Get the original (A side) points/lines
    const aLines = allLines.filter((obj) => obj.side === 'A')
    //console.log('Filtered A side lines:', aLines)

    // 2. For each endpoint, create a B side point by offsetting
    const aPoints = []
    const bLines = []

    let aLinesInOrder = []
    let baseLine

    for (let i = 0; i < aLines.length; i++) {
      if (!aLines[i].circle1.line1) {
        baseLine = aLines[i]
      }
    }

    aPoints.push({ x: baseLine.x1, y: baseLine.y1 })

    for (let i = 0; i < aLines.length; i++) {
      aPoints.push({ x: baseLine.x2, y: baseLine.y2 })
      aLinesInOrder.push(baseLine)

      baseLine = baseLine.circle2.line2
    }

    // aLines.forEach((line, idx) => {
    //   aPoints.push({ x: line.x1, y: line.y1 })
    //   //console.log(`A side line ${idx}: (${line.x1}, ${line.y1}) to (${line.x2}, ${line.y2})`)
    // })
    // aPoints.push({ x: aLines[aLines.length - 1].x2, y: aLines[aLines.length - 1].y2 })
    // //console.log('A side points:', aPoints)

    const negativeOffset = shouldUseNegativeXOffset(aLines)
    shouldUseNegativeXOffsetRef.current = negativeOffset
    negativeOffset ? (offset3D.x = offset3D.x * -1) : {}

    // 3. Create B side points
    let bPoints = aPoints.map((pt, idx) => {
      const bp = { x: pt.x + offset3D.x, y: pt.y + offset3D.y }
      //console.log(`B side point ${idx}:`, bp)
      return bp
    })

    //console.log(bPoints)

    let circle1 = createBCircle(bPoints[0].x, bPoints[0].y)
    canvas.add(circle1)
    circle1.side = 'B'
    let circle2

    //console.log(canvas.getObjects().filter((obj) => obj.type === 'circle'))

    // 4. Draw B side lines
    for (let i = 0; i < bPoints.length - 1; i++) {
      const hitboxLine = new Line(
        [bPoints[i].x, bPoints[i].y, bPoints[i + 1].x, bPoints[i + 1].y],
        {
          stroke: 'rgba(0, 0, 0, 0.005)',
          strokeWidth: 20,
          selectable: false,
          side: 'B',
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

          hoverCursor: 'pointer',
          strokeLineCap: 'round',
          isHitboxLine: true,
        },
      )

      hitboxLine.perPixelTargetFind = true

      const line = new Line([bPoints[i].x, bPoints[i].y, bPoints[i + 1].x, bPoints[i + 1].y], {
        stroke: '#CBD5E1',
        strokeWidth: 2,
        selectable: false,
        side: 'B',
        isMainLine: true,
        strokeLineCap: 'round',
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

        hoverCursor: 'pointer',
      })

      line.__temp_undo = calculateLineLength(line)

      line.hitboxLine_B = hitboxLine
      line.perPixelTargetFind = true

      aLinesInOrder[i].bSideLine = line

      line.aSideLine = aLinesInOrder[i]

      circle2 = createBCircle(bPoints[i + 1].x, bPoints[i + 1].y)

      circle2.side = 'B'

      canvas.add(circle2)

      // Set up circle and line relationships
      line.circle1 = circle1
      line.circle2 = circle2
      circle1.line2 = line
      circle2.line1 = line

      canvas.add(hitboxLine)
      line.on('mousedown', () => handleLineClick(line))
      hitboxLine.on('mousedown', () => handleLineClick(line))
      // hitboxLine.on('mousedown', () => handleLineClick(line))

      canvas.add(line)
      bLines.push(line)
      //console.log(
      //   `Added B side line ${i}: (${bPoints[i].x}, ${bPoints[i].y}) to (${bPoints[i + 1].x}, ${bPoints[i + 1].y})`,
      // )

      circle1 = circle2
    }

    //console.log(canvas.getObjects().filter((obj) => obj.type === 'circle'))

    // 5. Draw connecting lines and gradient paths between A and B sides
    createAndAddGradientsAndConnectingLines(
      canvas,
      // aPoints,
      // bPoints,
      // aLines,
      // bLines,
      drawConnectingLines,
    )

    // 6. Add length annotations for A and B sides
    aLines.forEach((line, idx) => {
      addLengthAnnotation(line, 'A', !shouldUseNegativeXOffsetRef.current)
      //console.log(`Added annotation for A side line ${idx}`)
    })
    bLines.forEach((line, idx) => {
      addLengthAnnotation(line, 'B', shouldUseNegativeXOffsetRef.current)
      //console.log(`Added annotation for B side line ${idx}`)
    })

    canvas.requestRenderAll()
    //console.log('3D flashing created and rendered!')

    //console.log(canvas.getObjects().filter((obj) => obj.type === 'circle'))
  }

  const createAllSideAnnotations = (canvas) => {
    const sideLines = canvas.getObjects().filter((obj) => obj.type === 'line' && obj.side)

    removeLengthAnnotations(canvas)

    for (let i = 0; i < sideLines.length; i++) {
      addLengthAnnotation(
        sideLines[i],
        sideLines[i].side,
        sideLines[i].side === 'A'
          ? !shouldUseNegativeXOffsetRef.current
          : shouldUseNegativeXOffsetRef.current,
      )
    }
  }

  const resetChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return

    console.log('taper reset changes called')

    const aLines = getAllMainLines(canvas).filter((line) => line.side === 'A')

    console.log(aLines)

    aLines.forEach((line) => {
      console.log(calculateLineLength(line), line.originalLength, line.originalBLength)
      if (calculateLineLength(line) !== line.originalLength) {
        canvas.setActiveObject(line)
        changeLineLength(line.originalLength)
      }

      if (calculateLineLength(line.bSideLine) !== line.originalBLength) {
        canvas.setActiveObject(line.bSideLine)
        changeLineLength(line.originalBLength)
      }
    })
  }

  // Handler: Activate tapper mode and create 3D effect
  useEffect(() => {
    if (!isTappering) return
    //console.log('Tapper mode triggered')
    const canvas = canvasInstance.current
    if (!canvas) return

    setTopBarVisible(false)
    setActionBarVisible(false)
    setTapperingTopBarVisible(true)
    setTapperingActionBarVisible(true)

    const circles = getAllCircles(canvas)

    //console.log(circles)

    circles.forEach((cir) => {
      if (
        startCrushFoldObjectRef.current !== cir &&
        endCrushFoldObjectRef.current !== cir &&
        startCrushFoldObjectRef.current?.mainCircle !== cir &&
        endCrushFoldObjectRef.current?.mainCircle !== cir
      ) {
        cir.set({ radius: 0.2, padding: 0 })
      }
      // cir.side = 'A'
    })

    removeAnnotations(canvas)

    const allLines = getAllMainLines(canvas)

    allLines.forEach((line) => {
      line.hitboxLine.set({ stroke: 'rgba(0, 0, 0, 0.005)' })

      // if (!line.bSideLineLength) {
      //   line.bSideLineLength = calculateLineLength(line)
      // }

      line.originalLength = calculateLineLength(line)
      line.originalBLength = line.bSideLineLength ? line.bSideLineLength : calculateLineLength(line)

      line.__temp_undo = calculateLineLength(line)

      delete line.isTapered

      //console.log('a length: ', calculateLineLength(line), ' b length: ', line.bSideLineLength)

      line.hitboxLine.on('mousedown', () => handleLineClick(line))

      line.side = 'A'
      // Add click handler for line length editing
      line.on('mousedown', () => handleLineClick(line))
    })

    shouldUseNegativeXOffsetRef.current = shouldUseNegativeXOffset(allLines)

    create3DFlashing()

    allLines.forEach((line) => {
      if (
        Math.round(calculateLineLength(line)) !== Math.round(line.bSideLineLength) &&
        line.bSideLineLength
      ) {
        console.log(line.bSideLineLength)
        canvas.setActiveObject(line.bSideLine)
        changeLineLength(line.bSideLineLength)
        // Math.round(calculateLineLength(line)) !== Math.round(calculateLineLength(line.bSideLine)) && (line.isTapered = true)
      }
    })

    centerDrawingGroup(35, 200, 150)

    //console.log(canvas.getObjects().filter((obj) => obj.type === 'circle'))

    return () => {
      removeGradientsAndConnectingLines(canvas)

      removeLengthAnnotations(canvas)

      const circles = getAllCircles(canvas)

      const bSideElements = canvas.getObjects().filter((obj) => obj.side === 'B')
      bSideElements.forEach((obj) => canvas.remove(obj))

      circles.forEach((cir) => {
        if (
          startCrushFoldObjectRef.current !== cir &&
          endCrushFoldObjectRef.current !== cir &&
          startCrushFoldObjectRef.current?.mainCircle !== cir &&
          endCrushFoldObjectRef.current?.mainCircle !== cir
        ) {
          cir.set({ radius: 4, padding: 12 })
        }
      })

      !isTappering && canvas.setActiveObject()

      const allLines = getAllMainLines(canvas)

      allLines.forEach((line) => {
        line.hitboxLine.set({ stroke: 'rgba(0, 0, 0, 0.0005)' })
        line.set({ stroke: '#000' })

        Math.round(calculateLineLength(line)) !== Math.round(calculateLineLength(line.bSideLine)) ?
          (line.isTapered = true) : (line.isTapered = false)

        line.hitboxLine.off('mousedown')

        line.isActive = false

        line.bSideLineLength = calculateLineLength(line.bSideLine)

        delete line.side

        canvas.remove(line.bSideLine)
        // Add click handler for line length editing
        line.off('mousedown')
      })

      createAnnotations()

      setTopBarVisible(true)
      setActionBarVisible(true)
      setTapperingTopBarVisible(false)
      setTapperingActionBarVisible(false)

      // setIsDrawing(true)

      centerDrawingGroup(50, 200, 150)
    }
  }, [isTappering])

  // Debounce live changes
  useDebouncedEffect(
    () => {
      if (isTaperingDrawerOpen && typeof objValue === 'number' && !isNaN(objValue)) {
        // removeAllAnnotations()
        // removeConnectingElements()

        //console.log(objValue)

        changeLineLength(objValue)
        // recreateConnectingElements()
        // addLengthAnnotationForAll()
        canvasInstance.current.isChanged = true
        // const allLines = canvasInstance.current
        //   .getObjects()
        //   .filter((obj) => obj.type === 'line' && (obj.hitboxLine || obj.hitboxLine_B))

        // allLines.forEach((line) => {
        //   canvasInstance.current.bringObjectToFront(line)
        // })

        const activeLine = canvasInstance.current.getActiveObject()

        try {
          if (hasAnyOverlap(canvasInstance.current, activeLine.side)) {
            //console.log('temp undo: ', activeLine.__temp_undo)
            changeLineLength(activeLine.__temp_undo)
            document.getElementById('trigger-overlap-alert-dialog').click()
          } else {
            activeLine.__temp_undo = objValue
          }
        } catch {}

        centerDrawingGroup(50, 500, 20)
        //console.log(
        //   'object on side ',
        //   activeLine.side,
        //   ' has overlap? ',
        //   hasAnyOverlap(canvasInstance.current, activeLine.side),
        // )
      }
      canvasInstance.current.requestRenderAll()
    },
    [objValue],
    1000,
  )

  return {
    isTaperingDrawerOpen,
    setIsTaperingDrawerOpen,
    objValue,
    setObjValue,
    objOriginalValue,
    objName,
    setActiveSide,
    setActiveLine,
    triggerRef,
    inputRef,
    resetChanges,
    setHasEditModalChanges
  }
}
