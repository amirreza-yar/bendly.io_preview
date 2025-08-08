'use client'
import { useEffect, useRef } from 'react'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import { useUIVisibility } from '@/providers/UICanvasContext'
import { removeAnnotations } from '@/utilities/canvas/annotationUtils'
import useObjectUtils from './useObjectUtils'
import { useHistory } from './useHistory'
import { Circle, Text, Line, Point, Rect, Group } from 'fabric'
import {
  moveCircle,
  repositionHitboxLine,
  getAllCircles,
  getAllMainLines,
  hasAnyOverlap,
} from '@/utilities/canvas/canvasUtils'
import {
  createAngleAnnotationForCircle,
  createLengthAnnotationForLine,
} from '@/utilities/canvas/annotationUtils'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'

export default function useRulering() {
  const {
    canvasInstance,
    setIsPanning,
    isRulering,
    objectsZoomScale,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    crushFoldObjectDirectionRef,
  } = useCanvasContext()

  const {
    setTopBarVisible,
    setActionBarVisible,
    setRuleringTopBarVisible,
    setRuleringActionBarVisible,
  } = useUIVisibility()

  const { centerDrawingGroup } = useObjectUtils()
  const listenersRef = useRef({})
  const selectedCircles = useRef([])
  const activeRulerLine = useRef(null)

  const createAnnotations = (setOriginalAngle = false, shouldAddTapered = false) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    getAllCircles(canvas).forEach((circle) => {
      if (circle.angleAnno) canvas.remove(circle.angleAnno)
      const angleAnno = createAngleAnnotationForCircle(circle)
      if (angleAnno) canvas.add(angleAnno)
    })

    getAllMainLines(canvas).forEach((line) => {
      if (line.lengthAnno) canvas.remove(line.lengthAnno)
      const lengthAnno = createLengthAnnotationForLine(
        canvas,
        line,
        line.circle1.angleAnno,
        line.circle2.angleAnno,
      )

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
      if (lengthAnno) canvas.add(lengthAnno)
    })

    canvas.requestRenderAll()
  }

  function createLengthAnnotation(line, _, __, options = {}) {
    const { x1, y1, x2, y2 } = line
    const dx = x2 - x1,
      dy = y2 - y1
    const length = Math.hypot(dx, dy)
    if (length === 0) return null

    const n = { x: -dy / length, y: dx / length }
    const ux = dx / length,
      uy = dy / length
    const mx = (x1 + x2) / 2,
      my = (y1 + y2) / 2

    const offset = options.baseOffset || 10
    const gap = options.endGap || 10 // <-- distance from circle to start of annotation

    // Shift outwards from the centerline
    const p1 = new Point(x1 + n.x * offset, y1 + n.y * offset)
    const p2 = new Point(x2 + n.x * offset, y2 + n.y * offset)

    // Apply inline shortening (gap)
    const q1 = new Point(p1.x + ux * gap, p1.y + uy * gap)
    const q2 = new Point(p2.x - ux * gap, p2.y - uy * gap)

    const color = options.color || '#E50000'
    const dimLine = new Line([q1.x, q1.y, q2.x, q2.y], {
      stroke: color,
      strokeWidth: 0.5,
      selectable: false,
    })

    function makeArrow(pt, dirX, dirY, inverted) {
      const tangent = Math.atan2(dirY, dirX)
      const arrowLen = 4
      const angles = inverted
        ? [(30 * Math.PI) / 180, (-30 * Math.PI) / 180]
        : [(210 * Math.PI) / 180, (-210 * Math.PI) / 180]

      return angles.map((a) => {
        const ang = tangent + Math.PI + a
        return new Line(
          [pt.x, pt.y, pt.x + arrowLen * Math.cos(ang), pt.y + arrowLen * Math.sin(ang)],
          {
            stroke: color,
            strokeWidth: 0.5,
            strokeLineCap: 'round',
            selectable: false,
          },
        )
      })
    }

    const [a1, a2] = makeArrow(q1, ux, uy)
    const [a3, a4] = makeArrow(q2, ux, uy, true)

    const tickLen = 5
    const tick1 = new Line(
      [
        q1.x - (n.x * tickLen) / 2,
        q1.y - (n.y * tickLen) / 2,
        q1.x + (n.x * tickLen) / 2,
        q1.y + (n.y * tickLen) / 2,
      ],
      { stroke: color, strokeWidth: 0.5, selectable: false },
    )
    const tick2 = new Line(
      [
        q2.x - (n.x * tickLen) / 2,
        q2.y - (n.y * tickLen) / 2,
        q2.x + (n.x * tickLen) / 2,
        q2.y + (n.y * tickLen) / 2,
      ],
      { stroke: color, strokeWidth: 0.5, selectable: false },
    )

    let angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI
    let flip = false
    if (angleDeg > 90 || angleDeg < -90) {
      angleDeg += 180
      flip = true
    }
    const str = `${Math.round(length)}`
    const tx = mx + n.x * offset,
      ty = my + n.y * offset
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
    const bg = new Rect({
      left: tx,
      top: ty,
      originX: 'center',
      originY: 'center',
      width: txt.width + 4,
      height: 10,
      rx: 4,
      fill: color,
      angle: angleDeg,
      selectable: false,
    })

    return new Group([dimLine, tick1, tick2, a1, a2, a3, a4, bg, txt], {
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
  }

  const createRulerAnnotation = (canvas) => {
    const [cir1, cir2] = selectedCircles.current
    const p1 = cir1.getCenterPoint(),
      p2 = cir2.getCenterPoint()
    const line = new Line([p1.x, p1.y, p2.x, p2.y], {
      stroke: 'red',
      strokeWidth: 0,
      selectable: false,
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
    line.perPixelTargetFind = true
    canvas.add(line)

    const lengthAnno = createLengthAnnotation(line, null, null, {
      baseOffset: 10,
      endGap: 15,
      color: '#E50000',
    })
    if (lengthAnno) {
      line.lengthAnno = lengthAnno
      lengthAnno.mainLine = line
      canvas.add(lengthAnno)
      lengthAnno.perPixelTargetFind = true
    }
    activeRulerLine.current = line
  }

  const selectCircle = (circle) => {
    const canvas = canvasInstance.current
    circle.set({ fill: '#E50000' })
    circle.bufferCircle.set({ strokeDashArray: [0, 0] })
    circle.isSelected = true
    selectedCircles.current.push(circle)

    if (selectedCircles.current.length === 2) {
      canvas
        .getObjects()
        .filter(
          (o) => o.type === 'circle' && !o.isBufferCircle && !selectedCircles.current.includes(o),
        )
        .forEach((c) => {
          c.set({ radius: 0, selectable: false })
          c.bufferCircle.set({ radius: 0, selectable: false })
        })
      createRulerAnnotation(canvas)
      canvas.requestRenderAll()
    }
  }

  const deselectCircle = (circle) => {
    const canvas = canvasInstance.current
    circle.set({ fill: '#fff' })
    circle.bufferCircle.set({ strokeDashArray: [4, 4] })
    circle.isSelected = false
    selectedCircles.current = selectedCircles.current.filter((c) => c !== circle)

    if (selectedCircles.current.length < 2) {
      canvas
        .getObjects()
        .filter((o) => o.type === 'circle' && !o.isBufferCircle)
        .forEach((c) => {
          c.set({ radius: 5, selectable: true })
          c.bufferCircle.set({ radius: 15, selectable: true })
        })

      if (activeRulerLine.current) {
        canvas.remove(activeRulerLine.current)
        if (activeRulerLine.current.lengthAnno) canvas.remove(activeRulerLine.current.lengthAnno)
        activeRulerLine.current = null
      }
      canvas.requestRenderAll()
    }
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

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

    if (isRulering) {
      removeAnnotations(canvas)
      const currentZoom = canvas.getZoom()
      const circles = canvas.getObjects().filter((o) => o.type === 'circle')

      circles.forEach((circle) => {
        if (
          startCrushFoldObjectRef.current !== circle &&
          endCrushFoldObjectRef.current !== circle
        ) {
          circle.CrushFoldObject && canvas.remove(circle.CrushFoldObject)
          const { x, y } = circle.getCenterPoint()
          const bufferCircle = new Circle({
            left: x,
            top: y,
            radius: 15 / objectsZoomScale.current,
            stroke: '#E50000',
            strokeDashArray: [4, 4],
            fill: 'transparent',
            originX: 'center',
            originY: 'center',
            selectable: false,
            evented: false,
            lockMovementX: true,
            lockMovementY: true,
            hasControls: false,
            hasBorders: false,
            objectCaching: true,
            statefullCache: true,
          })
          circle.set({
            selectable: false,
            radius: 5 / objectsZoomScale.current,
            fill: '#fff',
            stroke: '#E50000',
            lockMovementX: true,
            lockMovementY: true,
            padding: 15,
          })
          canvas.add(bufferCircle)
          bufferCircle.isBufferCircle = true
          bufferCircle.mainCircle = circle
          circle.bufferCircle = bufferCircle
          canvas.bringObjectToFront(circle)

          circle.crushFoldObject && canvas.remove(circle.crushFoldObject)
        }
      })

      setTopBarVisible(false)
      setActionBarVisible(false)
      setRuleringTopBarVisible(true)
      setRuleringActionBarVisible(true)

      const onObjectClick = (e) => {
        const selected = e.target
        if (!selected || selected.type !== 'circle') return
        selected.isSelected ? deselectCircle(selected) : selectCircle(selected)
      }

      canvas.on('mouse:down', onObjectClick)
      listenersRef.current.onObjectClick = onObjectClick
    }

    return () => {
      const canvas = canvasInstance.current
      if (!canvas) return
      canvas.off('mouse:down', listenersRef.current.onObjectClick)
      const currentZoom = canvas.getZoom()
      const circles = canvas.getObjects().filter((o) => o.type === 'circle' && !o.isBufferCircle)

      circles.forEach((circle) => {
        circle.set({
          selectable: false,
          radius: 4 / objectsZoomScale.current,
          fill: '#000',
          stroke: 'transparent',
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 0,
        })

        canvas.remove(circle.bufferCircle)
        circle.bufferCircle = null
        delete circle.originalPosition

        canvas.bringObjectToFront(circle)
      })

      if (activeRulerLine.current) {
        canvas.remove(activeRulerLine.current)
        if (activeRulerLine.current.lengthAnno) canvas.remove(activeRulerLine.current.lengthAnno)
        activeRulerLine.current = null
      }

      centerDrawingGroup(50, 150, 150)

      selectedCircles.current = []

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
        startCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, startCircle, 'start')
      }

      if (endCircle && endCrushFoldObjectRef.current) {
        endCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, endCircle, 'end')
      }

      setTopBarVisible(true)
      setActionBarVisible(true)
      setRuleringTopBarVisible(false)
      setRuleringActionBarVisible(false)
      centerDrawingGroup(50, 150, 130)
      setIsPanning(true)

      createAnnotations(false, true)
    }
  }, [isRulering])
}
