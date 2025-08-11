'use client'
import { useEffect, useRef, useState } from 'react'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
import { toast } from 'sonner'
import { useCancelChangesModalContext } from '@/providers/canvas_providers/cancelChangesModalProvider'
import { useHistory } from './useHistory'
import { Circle, Text, Line, Point, Rect, Group } from 'fabric'
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
import useObjectUtils from './useObjectUtils'

export default function useRemoving() {
  const {
    canvasInstance,
    setLastDotRef,
    lastDotRef,
    isRemoving,
    setIsPanning,
    isDrawing,
    isCanvasChanged,
    // setIsCanvasChanged,
    setIsRemoving,
    activeCircle,
    drwDirRevRef,
    redoStack,
    setCanRedo,
    setIsDrawing,
    objectsZoomScale,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    setCanvasIsEmpty,
    setHasEditModalChanges,
  } = useCanvasContext()

  const {
    setTopBarVisible,
    setActionBarVisible,
    setRemovingTopBarVisible,
    setRemovingActionBarVisible,
  } = useUIVisibility()

  const { addHistory, makeRemoveSnapshot, undo } = useHistory()

  const { centerDrawingGroup } = useObjectUtils()

  const listenersRef = useRef({})
  const selectedLinesRef = useRef([])

  const [isAnyLineSelected, setIsAnyLineSelected] = useState(false)

  const { onModalApply, onModalDiscard } = useCancelChangesModalContext()

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

  const removeLine = (selectedLine) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    canvas.remove(selectedLine.shadowLine)

    const dx = selectedLine.x1 - selectedLine.x2
    const dy = selectedLine.y1 - selectedLine.y2

    if (selectedLine.circle2.line2) {
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

        obj.setCoords()

        obj = obj.line2
      }

      

      selectedLine.circle2.line2.circle1 = selectedLine.circle1
      selectedLine.circle1.line2 = selectedLine.circle2.line2

      setHasEditModalChanges(true)
    }
    // else if (!selectedLine.circle2.line2 && !selectedLine.circle1.line1) {
    //   canvas.remove(selectedLine.circle1);
    //   activeCircle.current = null;
    //   console.log(
    //     "!selectedLine.circle2.line2 && !selectedLine.circle1.line1 is running"
    //   );
    //   // drwDirRevRef.current = false;
    //   // canvas.remove(activeCircle.current.bufferCircle);
    // }
    else {
      selectedLine.circle1.line2 = null

      selectedLine.circle2 === activeCircle.current && (activeCircle.current = selectedLine.circle1)
    }

    if (selectedLine.circle1.crushFoldObject) {
      canvas.remove(selectedLine.circle1.crushFoldObject.shadow)
      canvas.remove(selectedLine.circle1.crushFoldObject)
      selectedLine.circle1.set({ radius: 4 })
      startCrushFoldObjectRef.current = null
      delete selectedLine.circle1.crushFoldObject
    }

    if (selectedLine.circle2.crushFoldObject) {
      canvas.remove(selectedLine.circle2.crushFoldObject.shadow)
      canvas.remove(selectedLine.circle2.crushFoldObject)
      selectedLine.circle2.set({ radius: 4 })
      endCrushFoldObjectRef.current = null
      delete selectedLine.circle2.crushFoldObject
    }

    canvas.remove(selectedLine.circle2)
    canvas.remove(selectedLine.circle2.angleAnno)
    canvas.remove(selectedLine)
    canvas.remove(selectedLine.lengthAnno)
    canvas.remove(selectedLine.hitboxLine)
  }

  const applyChanges = (message) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const snapshot = makeRemoveSnapshot(selectedLinesRef.current)
    addHistory('remove', snapshot)

    selectedLinesRef.current.forEach((selectedLine) => {
      removeLine(selectedLine)
    })

    if (hasAnyOverlap(canvas)) {
      undo()
      // redoStack.current = [];
      // setCanRedo(false);
      document.getElementById('trigger-overlap-alert-dialog').click()
      removeAnnotations(canvas)
      selectedLinesRef.current = []
      setIsAnyLineSelected(false)
    } else {
      toast(message)
      setIsRemoving(false)
      setIsAnyLineSelected(false)
      setIsPanning(true)
      setIsDrawing(true)
    }

    console.log('remove line applied')

    setHasEditModalChanges(true)
  }

  const resetChanges = (message) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    toast(message)
    setIsRemoving(false)

    console.log('resetChanges running')

    setIsAnyLineSelected(false)
    setIsPanning(true)
  }

  const selectLine = (selectedLine) => {
    const canvas = canvasInstance.current
    if (!canvas) return
    let currentZoom = canvas.getZoom()
    selectedLine.set({
      stroke: 'rgb(229, 0, 0)',
      strokeDashArray: [4, 4],
    })

    if (selectedLine.circle1.crushFoldObject) {
      const crushFoldObject = selectedLine.circle1.crushFoldObject

      crushFoldObject.set({ stroke: 'rgb(229, 0, 0)', strokeDashArray: [4, 4] })

      const crushFoldObjectShadow = new Circle({
        radius: crushFoldObject.radius,
        left: crushFoldObject.left,
        top: crushFoldObject.top,
        angle: crushFoldObject.angle,
        startAngle: crushFoldObject.startAngle,
        endAngle: crushFoldObject.endAngle,
        stroke: 'rgba(229, 0, 0, 0.25)',
        strokeWidth: 7 / objectsZoomScale.current, // Hitbox size
        originX: 'center',
        originY: 'center',
        fill: '',
        strokeLineCap: 'round',
        selectable: false,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        evented: false,
      })

      crushFoldObject.shadow = crushFoldObjectShadow

      canvas.add(crushFoldObjectShadow)
    }

    if (selectedLine.circle2.crushFoldObject) {
      const crushFoldObject = selectedLine.circle2.crushFoldObject

      crushFoldObject.set({ stroke: 'rgb(229, 0, 0)', strokeDashArray: [4, 4] })

      const crushFoldObjectShadow = new Circle({
        radius: crushFoldObject.radius,
        left: crushFoldObject.left,
        top: crushFoldObject.top,
        angle: crushFoldObject.angle,
        startAngle: crushFoldObject.startAngle,
        endAngle: crushFoldObject.endAngle,
        stroke: 'rgba(229, 0, 0, 0.25)',
        strokeWidth: 7 / objectsZoomScale.current, // Hitbox size
        originX: 'center',
        originY: 'center',
        fill: '',
        strokeLineCap: 'round',
        selectable: false,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        evented: false,
      })

      crushFoldObject.shadow = crushFoldObjectShadow

      canvas.add(crushFoldObjectShadow)
    }

    const shadowLine = new Line(
      [selectedLine.x1, selectedLine.y1, selectedLine.x2, selectedLine.y2],
      {
        strokeWidth: 7 / objectsZoomScale.current, // Hitbox size
        // stroke: "rgba(0,0,0,0)", // Fully transparent
        stroke: 'rgba(229, 0, 0, 0.25)',
        strokeLineCap: 'round',
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        selectable: true,
        objectCaching: true,
        statefullCache: true,
        hoverCursor: 'pointer',
      },
    )

    shadowLine.perPixelTargetFind = true

    canvas.add(shadowLine)

    selectedLine.isSelected = true
    selectedLine.shadowLine = shadowLine
    shadowLine.originalLine = selectedLine

    selectedLinesRef.current.push(selectedLine)

    setIsAnyLineSelected(true)
  }

  const deselectLine = (deselectedLine) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    deselectedLine.set({
      stroke: '#000',
      strokeDashArray: [0, 0],
    })

    if (deselectedLine.circle1.crushFoldObject) {
      deselectedLine.circle1.crushFoldObject.set({
        stroke: '#000',
        strokeDashArray: [0, 0],
      })

      canvas.remove(deselectedLine.circle1.crushFoldObject.shadow)
    }

    if (deselectedLine.circle2.crushFoldObject) {
      deselectedLine.circle2.crushFoldObject.set({
        stroke: '#000',
        strokeDashArray: [0, 0],
      })

      canvas.remove(deselectedLine.circle2.crushFoldObject.shadow)
    }

    canvas.remove(deselectedLine.shadowLine)

    delete deselectedLine.shadowLine
    deselectedLine.isSelected = false

    selectedLinesRef.current = selectedLinesRef.current.filter((line) => line !== deselectedLine)

    selectedLinesRef.current.length === 0 && setIsAnyLineSelected(false)
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    // unGroupDrawings();

    if (isRemoving) {
      removeAnnotations(canvas)
      const circles = canvas.getObjects().filter((o) => o.type === 'circle')

      circles.forEach((circle) => {
        canvas.remove(circle.bufferCircle)
        delete circle.originalPosition
        canvas.remove(circle.angleAnno)
      })

      onModalApply.current = applyChanges
      onModalDiscard.current = resetChanges

      setTopBarVisible(false)
      setActionBarVisible(false)
      setRemovingTopBarVisible(true)
      setRemovingActionBarVisible(true)
      // init circles
      canvas
        .getObjects()
        .filter((o) => o.type === 'line' && !o.isHitboxLine)
        .forEach((line) => {
          line.set({
            selectable: true,
          })

          line.isSelected = false

          line.hitboxLine.set({
            selectable: true,
            stroke: 'rgba(0, 0, 0, 0.005)',
          })

          canvas.remove(line.lengthAnno)
        })

      const onObjectClick = (e) => {
        let selectedLine = e.target

        if (!selectedLine || selectedLine.type !== 'line') return

        if (selectedLine.originalLine) {
          selectedLine = selectedLine.originalLine
        }

        if (!selectedLine.isSelected) {
          selectLine(selectedLine)
        } else if (selectedLine.isSelected) {
          deselectLine(selectedLine)
        }
      }

      canvas.on('mouse:down', onObjectClick)

      listenersRef.current = {
        onObjectClick,
      }
    }
    // else {

    return () => {
      const { onObjectClick } = listenersRef.current
      canvas.off('mouse:down', onObjectClick)

      const allLines = canvas.getObjects().filter((o) => o.type === 'line' && !o.originalLine)
      allLines.forEach((line) => {
        line.set({
          selectable: false,
          stroke: '#000',
          strokeDashArray: [0, 0],
        })

        delete line.isSelected

        line.hitboxLine.set({
          selectable: false,
          stroke: 'rgba(0, 0, 0, 0.001)',
        })

        line.shadowLine && canvas.remove(line.shadowLine)

        line.shadowLine && delete line.shadowLine
      })

      allLines.length === 0 && setCanvasIsEmpty(true)

      onModalApply.current = () => {}
      onModalDiscard.current = () => {}

      setTopBarVisible(true)
      setActionBarVisible(true)
      setRemovingTopBarVisible(false)
      setRemovingActionBarVisible(false)

      selectedLinesRef.current = []

      removeAnnotations(canvas)

      createAnnotations(false, true)

      centerDrawingGroup(50, 150, 130)

      setIsPanning(true)

      // canvas.requestRenderAll();
    }
  }, [isRemoving])

  return {
    applyChanges,
    resetChanges,
    isAnyLineSelected,
  }
}
