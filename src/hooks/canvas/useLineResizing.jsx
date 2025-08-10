// hooks/useLineResizing.jsx
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

/**
 * Manages line-resize mode: attaches handlers, tracks lengths, commits or rolls back.
 */
export default function useLineResizing() {
  const {
    canvasInstance,
    isResizing,
    setIsResizing,
    setIsDrawing,
    // setIsPanning,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    setIsPinchZooming,
    objectsZoomScale,
  } = useCanvasContext()
  const { addHistory, snapshotCircles, tempUndo } = useHistory()

  // State
  const [objValue, setObjValue] = useState(0)
  const [objOriginalValue, setObjOriginalValue] = useState(0)
  const [isResizingDrawerOpen, setIsResizingDrawerOpen] = useState(false)
  const [hasPendingChange, setHasPendingChange] = useState(false)
  const triggerRef = useRef(null)
  const prevOpenRef = useRef(isResizingDrawerOpen)
  const inputRef = useRef(null)
  const closeButtonRef = useRef(null)
  const checkButtonRef = useRef(null)
  const listenersRef = useRef({})

  const [isCircleSelected, setIsCircleSelected] = useState(false)

  const {
    setTopBarVisible,
    setActionBarVisible,
    setResizingTopBarVisible,
    setResizingActionBarVisible,
  } = useUIVisibility()

  const { centerDrawingGroup } = useObjectUtils()

  // Openning the drawer and hiding top and action bar
  useEffect(() => {
    // only click if the value actually changed
    if (prevOpenRef.current !== isResizingDrawerOpen) {
      triggerRef.current?.click()
      prevOpenRef.current = isResizingDrawerOpen
    }

    if (isResizingDrawerOpen) {
      setResizingActionBarVisible(false)
      setResizingTopBarVisible(false)
      centerDrawingGroup(50, 500, 20)
    }
  }, [isResizingDrawerOpen])

  const clearInputValue = () => {
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  const focusInput = () => {
    inputRef.current?.focus()
  }

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

  function removeAnnotations(canvas) {
    canvas
      .getObjects()
      .filter((obj) => obj._isMeasurement)
      .forEach((obj) => {
        canvas.remove(obj)
      })
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

      let isLineTapered = false
      if (line.side === 'A') {
        Math.round(Math.round(calculateLineLength(line.bSideLine))) !==
          Math.round(calculateLineLength(line)) && (isLineTapered = true)
      }

      console.log(isLineTapered, line.isTapered, shouldAddTapered)

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

    createAnnotations()
  }

  const changeCircleAngle = (newAngle) => {
    console.log('circle angle reseted!: ', newAngle)
    if (typeof newAngle !== 'number' || isNaN(newAngle)) return
    const canvas = canvasInstance.current
    if (!canvas) return
    const selectedCircle = canvas.getActiveObject()
    if (!selectedCircle || selectedCircle.type !== 'circle') return

    if (newAngle === selectedCircle.angle) return
    const finalAngle = selectedCircle.isAngleInverted
      ? newAngle - selectedCircle.angle
      : selectedCircle.angle - newAngle

    const { x, y } = selectedCircle.getCenterPoint()
    const rotationPoint = new Point(x, y)

    const objectsToRotate = []

    objectsToRotate.push(selectedCircle)

    let obj = selectedCircle.line2
    while (obj) {
      objectsToRotate.push(obj)
      objectsToRotate.push(obj.hitboxLine)
      objectsToRotate.push(obj.circle2)
      console.log(obj.circle2.crushFoldObject)
      obj.circle2.crushFoldObject && objectsToRotate.push(obj.circle2.crushFoldObject)

      obj = obj.circle2.line2
    }

    rotateObjectsAroundPoint(objectsToRotate, rotationPoint, finalAngle)
    createAnnotations()
  }

  // Commit: store current lengths as original
  const applyChange = () => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const circles = canvas.getObjects().filter((o) => o.type === 'circle')
    circles.forEach((circle) => {
      circle._redoPosition_resize = circle.getCenterPoint()
    })

    const snap = snapshotCircles(circles, '_undoPosition_resize', '_redoPosition_resize')
    addHistory('resize', snap)

    hasPendingChange &&
      getAllMainLines(canvas).forEach((line) => {
        delete line.bSideLineLength
        line.isTapered = false
      })

    // addHistory("resize", circles);
    canvas.isChanged = false
    setHasPendingChange(false)

    // setIsPanning(true)

    // setIsDrawing(true)
  }

  // Rollback: restore original lengths
  const resetChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return
    canvas
      .getObjects()
      .filter((o) => o.type === 'line' && !o.isHitboxLine)
      .forEach((line) => {
        if (typeof line.originalLength === 'number') {
          canvas._setActiveObject(line)
          changeLineLength(line.originalLength)
        }
        hasPendingChange && delete line.bSideLineLength
      })

    canvas
      .getObjects()
      .filter((o) => o.type === 'circle')
      .forEach((cir) => {
        // if (typeof cir.originalAngle === "number") {
        canvas._setActiveObject(cir)
        changeCircleAngle(cir.originalAngle)
        // }
      })
    canvas.isChanged = false
    setHasPendingChange(false)
    canvas.requestRenderAll()

    // setIsPanning(true)

    // setIsDrawing(true)
  }

  const bringCirclesForward = () => {
    const canvas = canvasInstance.current
    if (!canvasInstance) return

    const circles = canvas.getObjects().filter((obj) => obj.type === 'circle')
    circles.forEach((cir) => {
      canvas.bringObjectToFront(cir)
    })
  }

  // Attach/detach when entering/leaving resize mode
  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    if (isResizing) {
      setTopBarVisible(false)
      setActionBarVisible(false)
      setResizingActionBarVisible(true)
      setResizingTopBarVisible(true)

      // init lines
      canvas.isChanged = false

      getAllMainLines(canvas).forEach((line) => {
        line.set({ selectable: true })
        line.hitboxLine.set({
          selectable: true,
          stroke: 'rgba(0, 0, 0, 0.005)',
        })
        line.originalLength = calculateLineLength(line)
      })

      const circles = getAllCircles(canvas)

      circles.forEach((circle) => {
        if (circle.line1 && circle.line2)
          circle.set({
            selectable: true,
            padding: 12,
            hasControls: false,
            hasBorders: false,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementX: true,
            lockMovementY: true,
          })

        circle._undoPosition_resize = circle.getCenterPoint()

        circle._temp_undoPosition_resize = circle.getCenterPoint()
      })

      startCrushFoldObjectRef.current?.set({ evented: false })
      endCrushFoldObjectRef.current?.set({ evented: false })

      removeAnnotations(canvas)

      createAnnotations(true)

      bringCirclesForward()

      // selection handlers
      const onCreate = (e) => {
        const selected = e.selected[0]
        if (selected.type === 'circle') {
          selected.set({
            fill: 'rgba(51, 85, 255, 1)',
          })

          customizeAnnotationStyle(selected.angleAnno, {
            fill: 'rgba(51, 85, 255, 1)',
            stroke: 'rgba(51, 85, 255, 1)',
            bgFill: 'rgba(51, 85, 255, 1)',
          })

          setObjOriginalValue(selected.angle)
          setObjValue(selected.angle)

          setIsCircleSelected(true)
        } else if (selected._isMeasurement) {
          if (selected._measurementType === 'length') {
            const selectedLine = selected.mainLine
            canvas._setActiveObject(selectedLine)
            selectedLine.set({ stroke: 'blue', fill: 'blue' })

            customizeAnnotationStyle(selectedLine.lengthAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })

            const len = calculateLineLength(selectedLine)
            setObjOriginalValue(len)
            setObjValue(len)
            setIsCircleSelected(false)
          } else if (selected._measurementType === 'angle') {
            const selectedCircle = selected.mainCircle
            canvas._setActiveObject(selectedCircle)

            selectedCircle.set({
              fill: 'rgba(51, 85, 255, 1)',
            })

            customizeAnnotationStyle(selectedCircle.angleAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })

            setObjOriginalValue(selectedCircle.angle)
            setObjValue(selectedCircle.angle)

            setIsCircleSelected(true)
          }
        } else {
          if (selected.isHitboxLine) {
            canvas._setActiveObject(selected.originalLine)
            selected.originalLine.set({ stroke: 'blue' })
          } else {
            selected.set({ stroke: 'blue' })
          }
          const selectedLine = canvas.getActiveObject()
          selectedLine.set({ stroke: 'blue', fill: 'blue' })

          customizeAnnotationStyle(selectedLine.lengthAnno, {
            fill: 'rgba(51, 85, 255, 1)',
            stroke: 'rgba(51, 85, 255, 1)',
            bgFill: 'rgba(51, 85, 255, 1)',
          })

          const len = calculateLineLength(selectedLine)
          setObjOriginalValue(len)
          setObjValue(len)
          setIsCircleSelected(false)

          // enableInteractions();
        }
        setIsResizingDrawerOpen(true)
        bringCirclesForward()
      }

      const onUpdate = (e) => {
        const deselected = e.deselected[0]
        const selected = e.selected[0]
        if (hasPendingChange) applyChange()

        if (deselected.type === 'circle') {
          deselected.set({ fill: '#000' })

          customizeAnnotationStyle(deselected.angleAnno, {
            fill: '#9145E2',
            stroke: '#9145E2',
            bgFill: '#9145E2',
          })
        } else {
          deselected.set({ stroke: '#000' })

          customizeAnnotationStyle(deselected.lengthAnno, {
            fill: '#E50000',
            stroke: '#E50000',
            bgFill: '#E50000',
          })
        }

        if (selected.type === 'circle') {
          selected.set({
            fill: 'rgba(51, 85, 255, 1)',
          })

          customizeAnnotationStyle(selected.angleAnno, {
            fill: 'rgba(51, 85, 255, 1)',
            stroke: 'rgba(51, 85, 255, 1)',
            bgFill: 'rgba(51, 85, 255, 1)',
          })

          clearInputValue()
          setObjOriginalValue(selected.angle)
          setObjValue(selected.angle)

          setIsCircleSelected(true)
        } else if (selected._isMeasurement) {
          if (selected._measurementType === 'length') {
            const selectedLine = selected.mainLine
            canvas._setActiveObject(selectedLine)
            selectedLine.set({ stroke: 'blue', fill: 'blue' })

            customizeAnnotationStyle(selectedLine.lengthAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })

            const len = calculateLineLength(selectedLine)
            clearInputValue()
            setObjOriginalValue(len)
            setObjValue(len)
            setIsCircleSelected(false)
          } else if (selected._measurementType === 'angle') {
            const selectedCircle = selected.mainCircle
            canvas._setActiveObject(selectedCircle)

            selectedCircle.set({
              fill: 'rgba(51, 85, 255, 1)',
            })

            customizeAnnotationStyle(selectedCircle.angleAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })

            clearInputValue()

            setObjOriginalValue(selectedCircle.angle)
            setObjValue(selectedCircle.angle)

            setIsCircleSelected(true)
          }
        } else {
          if (selected.isHitboxLine) {
            canvas._setActiveObject(selected.originalLine)
            selected.originalLine.set({ fill: 'blue', stroke: 'blue' })

            customizeAnnotationStyle(selected.originalLine.lengthAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })
          } else {
            selected.set({ fill: 'blue', stroke: 'blue' })

            customizeAnnotationStyle(selected.lengthAnno, {
              fill: 'rgba(51, 85, 255, 1)',
              stroke: 'rgba(51, 85, 255, 1)',
              bgFill: 'rgba(51, 85, 255, 1)',
            })
          }

          const selectedLine = canvas.getActiveObject()
          canvas.setActiveObject(selectedLine)
          selectedLine.set({ stroke: 'blue', fill: 'blue' })
          const len = calculateLineLength(selectedLine)
          clearInputValue()
          setObjOriginalValue(len)
          setObjValue(len)

          setIsCircleSelected(false)
        }

        bringCirclesForward()
      }

      const onClear = (e) => {
        const deselected = e.deselected[0]
        canvas.setActiveObject(deselected)
      }

      canvas.on('selection:created', onCreate)
      canvas.on('selection:updated', onUpdate)
      canvas.on('selection:cleared', onClear)
      listenersRef.current = { onCreate, onUpdate, onClear }
    }

    return () => {
      setTopBarVisible(true)
      setActionBarVisible(true)
      setResizingActionBarVisible(false)
      setResizingTopBarVisible(false)

      startCrushFoldObjectRef.current?.set({ evented: true })
      endCrushFoldObjectRef.current?.set({ evented: true })

      // teardown
      const { onCreate, onUpdate, onClear } = listenersRef.current
      canvas.off('selection:created', onCreate)
      canvas.off('selection:updated', onUpdate)
      canvas.off('selection:cleared', onClear)

      inputRef.current?.removeEventListener('blur', focusInput)

      // reset lines
      canvas
        .getObjects()
        .filter((o) => o.type === 'line' && !o.isHitboxLine)
        .forEach((line) => {
          line.set({ selectable: false, stroke: '#000', fill: '#000' })
          line.hitboxLine.set({
            selectable: false,
            stroke: 'rgba(0, 0, 0, 0)',
          })
          delete line.originalLength
          // canvas.remove(line.lengthAnno);
          // delete line.lengthAnno;
        })

      canvas
        .getObjects()
        .filter((o) => o.type === 'circle')
        .forEach((cir) => {
          // cir.set({ selectable: false, fill: '#000' })

          delete cir.originalAngle
          // canvas.remove(cir.angleAnno);
          // delete cir.lengthAnno;

          canvas.bringObjectToFront(cir)
        })

      canvas.discardActiveObject()
      canvas.requestRenderAll()

      setIsPinchZooming(true)

      // setIsDrawing(true)

      centerDrawingGroup(50, 150, 130)

      removeAnnotations(canvas)

      createAnnotations(false, true )

      // setIsResizingDrawerOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isResizing])

  // Debounce live changes
  useDebouncedEffect(
    () => {
      if (isResizingDrawerOpen && typeof objValue === 'number' && !isNaN(objValue)) {
        isCircleSelected ? changeCircleAngle(objValue) : changeLineLength(objValue)
        canvasInstance.current.isChanged = true

        const circles = canvasInstance.current.getObjects().filter((o) => o.type === 'circle')

        if (hasAnyOverlap(canvasInstance.current)) {
          circles.forEach((cir) => {
            moveCircle(cir, cir._temp_undoPosition_resize)
            repositionHitboxLine(cir)
          })
          createAnnotations()
          document.getElementById('trigger-overlap-alert-dialog').click()
        } else {
          circles.forEach((cir) => {
            cir._temp_undoPosition_resize = cir.getCenterPoint()
          })
          centerDrawingGroup(50, 500, 20)
        }
        canvasInstance.current.requestRenderAll()
      }
    },
    [objValue],
    1000,
  )

  return {
    objValue,
    setObjValue,
    objOriginalValue,
    isResizingDrawerOpen,
    setIsResizingDrawerOpen,
    hasPendingChange,
    setHasPendingChange,
    applyChange,
    resetChanges,
    changeLineLength,
    setIsResizing,
    triggerRef,
    inputRef,
    closeButtonRef,
    checkButtonRef,
    focusInput,
    isCircleSelected,
  }
}
