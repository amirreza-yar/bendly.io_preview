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
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'
import { useDebouncedEffect } from '@/utilities/canvas/useDebounce'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
import { Point, Text, Group, Rect, Line, Circle, Path, loadSVGFromString, util } from 'fabric'
import { useHistory } from './useHistory'
import useObjectUtils from './useObjectUtils'
import { toast } from 'sonner'

const svgMarkup = `
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17.0814 3.34912V15.023C17.0814 16.4031 15.9631 17.5219 14.5836 17.5219C12.8288 17.5219 11.6211 15.7594 12.2538 14.122L13.5132 10.8628M2.91675 13.1438L8.33341 7.72717M2.91675 7.72717L8.33341 13.1438"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    </svg>
                    `.trim()

function removeAnnotations(canvas) {
  canvas
    .getObjects()
    .filter((obj) => obj._isMeasurement)
    .forEach((obj) => {
      canvas.remove(obj)
    })
}

export default function useCrushFold() {
  const {
    canvasInstance,
    isCrushFolding,
    activeCircle,
    // setIsDrawing,
    setCrushFoldDirection,
    crushFoldDirection,
    setShowBreakLineIcon,
    showBreakLineIcon,
    setIsCrushFolding,
    setIsCanvasChanged,
    isCanvasChanged,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    crushFoldObjectDirectionRef,
  } = useCanvasContext()

  const { centerDrawingGroup } = useObjectUtils()

  const {
    setCrushFoldingTopBarVisible,
    setCrushFoldingActionBarVisible,
    setTopBarVisible,
    setActionBarVisible,
  } = useUIVisibility()

  const startCrushFoldButtonRef = useRef(null)
  const endCrushFoldButtonRef = useRef(null)

  const hadStartCrushFoldObjRef = useRef(false)
  const hadEndCrushFoldObjRef = useRef(false)

  const startCircleRef = useRef(null)
  const endCircleRef = useRef(null)

  const wasBreakLineIconShown = useRef(false)

  const eventListeners = useRef({})

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

  const createAnnotations = (setOriginalAngle = false, shouldAddTapered = false) => {
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

      const color = line === activeObj ? '#3355FF' : '#E50000'

      const lengthAnno = createLengthAnnotation(
        line,
        line.circle1.angleAnno,
        line.circle2.angleAnno,
        { color: color },
      )

      // ======= Tapered Flag (custom path) ========
      if (line.isTapered && shouldAddTapered) {
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

  const applyChanges = (message) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    message && toast(message)
    setIsCrushFolding(false)
    setIsCanvasChanged(false)
    // setIsDrawing(true)
  }

  const resetChanges = (message) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    message && toast(message)
    setIsCrushFolding(false)

    // setIsDrawing(true)

    hadStartCrushFoldObjRef.current.had
      ? addCrushFoldObject(hadStartCrushFoldObjRef.current.mainCircle, 'start', false)
      : removeCrushFoldObject('start')
    hadEndCrushFoldObjRef.current.had
      ? addCrushFoldObject(hadEndCrushFoldObjRef.current.mainCircle, 'end', false)
      : removeCrushFoldObject('end')
    setIsCanvasChanged(false)
  }

  const removeCrushFoldObject = (position) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    if (startCrushFoldObjectRef.current && position === 'start') {
      delete startCrushFoldObjectRef.current.mainCircle.crushFoldObject
      canvas.remove(startCrushFoldObjectRef.current)
      startCrushFoldObjectRef.current = null
    } else if (endCrushFoldObjectRef.current && position === 'end') {
      delete endCrushFoldObjectRef.current.mainCircle.crushFoldObject
      canvas.remove(endCrushFoldObjectRef.current)
      endCrushFoldObjectRef.current = null
    }
  }

  const addCrushFoldObject = (circle, position, canvasChanged = true) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    removeCrushFoldObject(position)

    const crushFoldObject = createCrushFoldObject(
      circle,
      crushFoldObjectDirectionRef.current,
      position,
    )
    canvas.add(crushFoldObject)
    circle.crushFoldObject = crushFoldObject
    crushFoldObject.mainCircle = circle

    if (circle.line1) {
      endCrushFoldObjectRef.current = crushFoldObject
    } else {
      startCrushFoldObjectRef.current = crushFoldObject
    }

    setIsCanvasChanged(canvasChanged)
  }

  const toggleCrushFoldButton = (canvas, circle) => {
    // console.log('crush button: ', circle.crushButton.icon)
    if (circle.crushButton?.icon) {
      circle.crushButton.set({ fill: '' })
      canvas.remove(circle.crushButton.icon)
      delete circle.crushButton.icon
    } else {
      console.log(circle.crushButton)
      const { x, y } = circle.crushButton.getCenterPoint()

      circle.crushButton.set({ fill: '#3355FF' })

      /* load it; Fabric ≥ 5 returns a Promise */
      loadSVGFromString(svgMarkup).then(({ objects, options }) => {
        // merge the individual <path> nodes into one Fabric object
        const icon = util.groupSVGElements(objects, options)

        /* optional: scale so it sits neatly inside the 120‑px‑diameter circle */
        const scale = 12 / Math.max(icon.width, icon.height) // 50 px ≈ circle radius – padding
        icon.set({
          originX: 'center',
          originY: 'center',
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
        })

        icon.on('mousedown', () => {
          circle.crushButton.fire('mousedown', { e: null })
          // toggleCrushFoldButton(canvas, circle)
        })

        circle.crushButton.icon = icon

        canvas.add(icon)
        canvas.requestRenderAll()
      })
    }
  }

  const changeCrushFoldDirection = () => {
    const canvas = canvasInstance.current
    if (!canvas) return

    setCrushFoldDirection(!crushFoldDirection)
    crushFoldObjectDirectionRef.current = !crushFoldObjectDirectionRef.current
    startCrushFoldObjectRef.current !== null && addCrushFoldObject(startCircleRef.current, 'start')
    endCrushFoldObjectRef.current !== null && addCrushFoldObject(endCircleRef.current, 'end')
  }

  const createCrushFoldButtons = (canvas) => {
    let startCircle, endCircle

    const circles = canvas.getObjects().filter((obj) => obj.type === 'circle')

    // console.log(circles)
    if (!circles.length) return

    circles.forEach((cir) => {
      // console.log(cir, cir.line1, cir.line2)
      if (!cir.line1 && cir.line2) {
        startCircle = cir
      }
      if (cir.line1 && !cir.line2) {
        endCircle = cir
      }
    })

    // console.log(startCircle, endCircle)
    const gap = 30
    const buttonRadius = 20

    const startLine = startCircle.line2

    const startX1 = startLine.x1
    const startX2 = startLine.x2
    const startY1 = startLine.y1
    const startY2 = startLine.y2
    const startMainAngle = Math.atan2(startY2 - startY1, startX2 - startX1)

    const startdX = startX1 - gap * Math.cos(startMainAngle)
    const startdY = startY1 - gap * Math.sin(startMainAngle)

    const startCrushFoldButton = new Circle({
      left: startdX,
      top: startdY,
      radius: buttonRadius,
      stroke: 'rgba(51, 85, 255, 1)',
      strokeLineCap: 'round',
      strokeWidth: 2,
      fill: 'rgba(0, 0, 0, 0)',
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

    const endLine = endCircle.line1

    const endX1 = endLine.x1
    const endX2 = endLine.x2
    const endY1 = endLine.y1
    const endY2 = endLine.y2
    const endMainAngle = Math.atan2(endY2 - endY1, endX2 - endX1)

    const enddX = endX2 + gap * Math.cos(endMainAngle)
    const enddY = endY2 + gap * Math.sin(endMainAngle)

    const endCrushFoldButton = new Circle({
      left: enddX,
      top: enddY,
      radius: buttonRadius,
      stroke: 'rgba(51, 85, 255, 1)',
      strokeLineCap: 'round',
      strokeWidth: 2,
      fill: 'rgba(0, 0, 0, 0)',
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

    startCrushFoldButton.mainCircle = startCircle
    endCrushFoldButton.mainCircle = endCircle

    console.log(startCrushFoldButton)

    startCircle.crushButton = startCrushFoldButton
    endCircle.crushButton = endCrushFoldButton

    startCrushFoldButton.on('mousedown', () => {
      setIsCanvasChanged(true)
      if (startCrushFoldObjectRef.current) {
        removeCrushFoldObject('start')
      } else {
        addCrushFoldObject(startCircle, 'start')
      }
      toggleCrushFoldButton(canvas, startCircle)
    })

    endCrushFoldButton.on('mousedown', () => {
      setIsCanvasChanged(true)
      if (endCrushFoldObjectRef.current) {
        removeCrushFoldObject('end')
      } else {
        addCrushFoldObject(endCircle, 'end')
      }
      toggleCrushFoldButton(canvas, endCircle)
    })

    startCircleRef.current = startCircle
    endCircleRef.current = endCircle

    canvas.add(startCrushFoldButton)
    canvas.add(endCrushFoldButton)

    startCrushFoldButtonRef.current = startCrushFoldButton
    endCrushFoldButtonRef.current = endCrushFoldButton

    canvas.requestRenderAll()
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    if (isCrushFolding) {
      removeAnnotations(canvas)

      setTopBarVisible(false)
      setActionBarVisible(false)
      setCrushFoldingTopBarVisible(true)
      setCrushFoldingActionBarVisible(true)

      if (showBreakLineIcon) {
        setShowBreakLineIcon(false)
        wasBreakLineIconShown.current = true
      }

      hadStartCrushFoldObjRef.current = {
        had: Boolean(startCrushFoldObjectRef.current),
        mainCircle: startCrushFoldObjectRef.current?.mainCircle,
      }
      hadEndCrushFoldObjRef.current = {
        had: Boolean(endCrushFoldObjectRef.current),
        mainCircle: endCrushFoldObjectRef.current?.mainCircle,
      }

      const circles = getAllCircles(canvas)

      circles.forEach((cir) => {
        if (
          startCrushFoldObjectRef.current !== cir &&
          endCrushFoldObjectRef.current !== cir &&
          startCrushFoldObjectRef.current?.mainCircle !== cir &&
          endCrushFoldObjectRef.current?.mainCircle !== cir
        ) {
          cir.set({ radius: 0.2, padding: 0 })
        }

        if (cir.crushFoldObject) {
          // toggleCrushFoldButton(canvas, cir)
        }
      })

      console.log(startCrushFoldObjectRef.current)

      createCrushFoldButtons(canvas, circles)
      startCrushFoldObjectRef.current && toggleCrushFoldButton(canvas, startCircleRef.current)
      endCrushFoldObjectRef.current && toggleCrushFoldButton(canvas, endCircleRef.current)

      centerDrawingGroup(50, 150, 130)
    }
    return () => {
      canvas.remove(
        startCrushFoldButtonRef.current,
        endCrushFoldButtonRef.current,
        startCrushFoldButtonRef.current?.icon,
        endCrushFoldButtonRef.current?.icon,
      )

      const circles = getAllCircles(canvas)

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

      canvas.requestRenderAll()

      setCrushFoldDirection(crushFoldObjectDirectionRef.current)

      setShowBreakLineIcon()

      // activeCircle.current = null

      // setIsDrawing(true)

      wasBreakLineIconShown.current && setShowBreakLineIcon(true)

      createAnnotations(false, true)

      setTopBarVisible(true)
      setActionBarVisible(true)
      setCrushFoldingTopBarVisible(false)
      setCrushFoldingActionBarVisible(false)

      centerDrawingGroup(50, 150, 130)
    }
  }, [isCrushFolding])

  return { changeCrushFoldDirection, removeCrushFoldObject, applyChanges, resetChanges }
}
