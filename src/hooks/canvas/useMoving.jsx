'use client'
import { useEffect, useRef, useState } from 'react'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
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
import { useCancelChangesModalContext } from '@/providers/canvas_providers/cancelChangesModalProvider'
import { useBreakLineContext } from '@/providers/canvas_providers/breakLineProvider'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'

export default function useMoving() {
  const {
    canvasInstance,
    isBreakLining,
    isMoving,
    setIsPanning,
    isCanvasChanged,
    setIsCanvasChanged,
    setIsDrawing,
    setShowBreakLineIcon,
    setIsBreakLining,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    objectsZoomScale,
    crushFoldObjectDirectionRef,
  } = useCanvasContext()

  const { onModalApply, onModalDiscard } = useCancelChangesModalContext()

  const { addHistory, snapshotCircles, tempUndo } = useHistory()

  const { activateBreakLine, deactivateBreakLine } = useBreakLineContext()

  const { centerDrawingGroup } = useObjectUtils()

  const hasStartCrushFoldObject = startCrushFoldObjectRef.current ? true : false
  const hasEndCrushFoldObject = endCrushFoldObjectRef.current ? true : false

  const {
    setTopBarVisible,
    setActionBarVisible,
    setMovingTopBarVisible,
    setMovingActionBarVisible,
  } = useUIVisibility()

  const listenersRef = useRef({})

  function removeAnnotations(canvas) {
    canvas
      .getObjects()
      .filter((obj) => obj._isMeasurement)
      .forEach((obj) => {
        canvas.remove(obj)
      })
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

  const createAnnotations = (shoudCreateTapered = false) => {
    const canvas = canvasInstance.current
    if (!canvas) return
    createAngleAnnos()

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

      console.log(isLineTapered, line.isTapered, shoudCreateTapered)

      // ======= Tapered Flag (custom path) ========
      if (line.isTapered && !isMoving) {
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
      movingCircle.bufferCircle.set({ left: x, top: y })
    } else {
      const { x, y } = movingCircle.getCenterPoint()
      movingCircle.bufferCircle.set({ left: x, top: y })
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

    // canvas.requestRenderAll();
  }

  const moveCircle2 = (movingCircle, position) => {
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

  const repositionHitboxLine2 = (movingCircle) => {
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

  const applyChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return
    console.log('move apply changes called')

    const circles = canvas.getObjects().filter((o) => o.type === 'circle')
    circles.forEach((circle) => {
      circle._redoPosition_move = circle.getCenterPoint()
    })

    isCanvasChanged &&
      getAllMainLines(canvas).forEach((line) => {
        delete line.bSideLineLength
        line.isTapered = false
      })

    const snap = snapshotCircles(circles, '_undoPosition_move', '_redoPosition_move')

    createAnnotations()

    addHistory('move', snap)
    canvas.isChanged = false

    setIsCanvasChanged(false)
  }

  const resetChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return
    canvas
      .getObjects()
      .filter((o) => o.type === 'circle' && !o.isBufferCircle)
      .forEach((circle) => {
        moveCircle(circle, circle.originalPosition)
        repositionHitboxLine(circle)
      })
    // isCanvasChanged && getAllMainLines(canvas).forEach((line) => delete line.bSideLineLength)
    setIsCanvasChanged(false)
    createAnnotations(true)
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

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

    removeAnnotations(canvas)
    createAnnotations()

    const addCrushFoldObject = (canvas, circle, position) => {
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
    }

    // unGroupDrawings();

    if (isMoving) {
      setShowBreakLineIcon(false)
      if (isBreakLining) {
        deactivateBreakLine(canvas)
      }
      setTopBarVisible(false)
      setActionBarVisible(false)
      setMovingTopBarVisible(true)
      setMovingActionBarVisible(true)
      // init circles
      let currentZoom = canvas.getZoom()

      onModalApply.current = applyChanges
      onModalDiscard.current = resetChanges

      createAnnotations()

      const circles = canvas
        .getObjects()
        .filter((o) => o.type === 'circle' && !o.bufferCircle && !o.isBufferCircle && !o.mainCircle)

      console.log('circles length: ', circles.length)

      const objectSelectHnad = () => {
        setIsPanning(false)
      }

      const objectDeselectHnad = () => {
        setIsPanning(true)
      }

      circles.forEach((circle) => {
        if (
          true
          // startCrushFoldObjectRef.current !== circle &&
          // endCrushFoldObjectRef.current !== circle
        ) {
          if (circle.line1 || circle.line2) {
            if (circle.CrushFoldObject) {
              canvas.remove(circle.CrushFoldObject)
            }
            const { x, y } = circle.getCenterPoint()
            const bufferCircle = new Circle({
              left: x,
              top: y,
              radius: 10 / objectsZoomScale.current,
              stroke: 'rgba(0, 153, 51, 1)',
              strokeLineCap: 'round',
              strokeDashArray: [4, 4],
              fill: 'rgba(0, 153, 51, 0.2)',
              originX: 'center',
              originY: 'center',
              hasControls: false,
              hasBorders: false,
              selectable: true,
              evented: true,
              objectCaching: true,
              statefullCache: true,
            })

            circle.set({
              radius: 4,
              selectable: true,
              fill: '#009933',
              lockScalingX: false,
              lockScalingY: false,
              lockMovementX: false,
              lockMovementY: false,
              padding: 15,
            })

            circle._undoPosition_move = circle.getCenterPoint()

            circle._temp_undoPosition_move = circle.getCenterPoint()

            const originalPosition = circle.getCenterPoint()
            circle.originalPosition = originalPosition

            canvas.add(bufferCircle)

            bufferCircle.isBufferCircle = true
            bufferCircle.mainCircle = circle
            circle.bufferCircle = bufferCircle

            canvas.bringObjectToFront(circle)

            circle.on('mousedown', objectSelectHnad)

            circle.on('mouseup', objectDeselectHnad)

            circle.crushFoldObject && canvas.remove(circle.crushFoldObject)
          } else {
            circle.set({ padding: 0 })
            circle.mainCircle.set({ radius: 4 })
          }
        }
      })

      const onSelect = (e) => {
        // setIsPanning(false)
      }

      const onDeselect = (e) => {
        // setIsPanning(true)
      }

      const onUpdate = (e) => {
        // setIsPanning(false)

        const selected = e.selected[0]

        console.log('circle has been updated: ', e.selected[0].type)

        if (selected._measurementType === 'angle') {
          console.log("selected._measurementType === 'angle'")
          const selectedCircle = selected.mainCircle
          canvas._setActiveObject(selectedCircle)
        }
      }

      const onMove = (e) => {
        // setIsPanning(false)
        let movingCircle = e.target
        if (movingCircle.bufferCircle) {
          moveCircle(movingCircle)
        } else if (selected._measurementType === 'angle') {
          console.log("selected._measurementType === 'angle'")
          const selectedCircle = selected.mainCircle
          canvas._setActiveObject(selectedCircle)
        } else {
          movingCircle = movingCircle.mainCircle
          moveCircle(movingCircle)
        }
        createAnnotations()
      }

      const onModified = (e) => {
        setIsCanvasChanged(true)
        let movingCircle = e.target

        repositionHitboxLine(movingCircle)

        if (hasAnyOverlap(canvasInstance.current)) {
          circles.forEach((cir) => {
            moveCircle2(cir, cir._temp_undoPosition_move)
            repositionHitboxLine2(cir)
          })
          createAnnotations()
          canvas.discardActiveObject()
          document.getElementById('trigger-overlap-alert-dialog').click()
        } else {
          circles.forEach((cir) => {
            cir._temp_undoPosition_move = cir.getCenterPoint()
          })
        }

        circles.forEach((cir) => {
          canvas.bringObjectToFront(cir.angleAnno)
          canvas.bringObjectToFront(cir)
        })

        // centerDrawingGroup(50, 150, 150)
      }

      canvas.on('object:moving', onMove)
      canvas.on('selection:created', onSelect)
      canvas.on('selection:updated', onUpdate)
      canvas.on('before:selection:cleared', onDeselect)
      canvas.on('object:modified', onModified)

      listenersRef.current = {
        onMove,
        onModified,
        onSelect,
        onDeselect,
        onUpdate,
        objectSelectHnad,
        objectDeselectHnad,
      }
    }
    // else {

    return () => {
      const {
        onMove,
        onModified,
        onSelect,
        onDeselect,
        onUpdate,
        objectSelectHnad,
        objectDeselectHnad,
      } = listenersRef.current
      canvas.off('object:moving', onMove)
      canvas.off('object:modified', onModified)
      canvas.off('selection:created', onSelect)
      canvas.off('selection:updated', onUpdate)
      canvas.off('before:selection:cleared', onDeselect)

      removeAnnotations(canvas)
      createAnnotations(true)

      // if (isDrawing) return;

      const circles = canvas.getObjects().filter((o) => o.type === 'circle' && o.bufferCircle)

      circles.forEach((circle) => {
        circle.set({
          selectable: false,
          fill: '#000',
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 0,
        })

        canvas.remove(circle.bufferCircle)
        circle.bufferCircle = null
        delete circle.originalPosition

        circle.off('mousedown', objectSelectHnad)

        circle.off('mouseup', objectDeselectHnad)

        canvas.bringObjectToFront(circle)
      })

      const lines = canvas.getObjects().filter((o) => o.type === 'line' && o.hitboxLine)

      let shouldBreakLine = false

      lines.forEach((line) => {
        if (calculateLineLength(line) > 500) {
          shouldBreakLine = true
        }
      })

      console.log('shouldBreakLine: ', shouldBreakLine)
      setIsBreakLining(false)

      if (shouldBreakLine) {
        setShowBreakLineIcon(true)
      } else {
        setShowBreakLineIcon(false)
      }

      var startCircle, endCircle

      circles.forEach((cir) => {
        if (!cir.line1 && cir.line2) {
          startCircle = cir
        }
        if (cir.line1 && !cir.line2) {
          endCircle = cir
        }
      })

      if (startCircle && startCrushFoldObjectRef.current) {
        console.log('start crush fold')
        startCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, startCircle, 'start')
      }

      if (endCircle && endCrushFoldObjectRef.current) {
        console.log('end crush fold')
        endCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, endCircle, 'end')
      }

      centerDrawingGroup(50, 150, 150)

      setTopBarVisible(true)
      setActionBarVisible(true)
      setMovingTopBarVisible(false)
      setMovingActionBarVisible(false)

      canvas.requestRenderAll()
    }
  }, [isMoving])

  return {
    applyChanges,
    resetChanges,
  }
}
