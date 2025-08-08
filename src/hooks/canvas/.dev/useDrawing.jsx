'use client'

import { useEffect, useRef } from 'react'
import { Circle, Line } from 'fabric'

import { useCanvasContext } from '@/providers/canvasContextProvider'
import useGrid from '../useGrid'
import { useHistory } from '../useHistory'
import { getAllMainLines, getAllCircles, hasAnyOverlap } from '@/utilities/canvas/canvasUtils'
import {
  createAngleAnnotationForCircle,
  createLengthAnnotationForLine,
  styleAnnotationGroup,
} from '@/utilities/canvas/annotationUtils'

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
    tempUndoStack,
    setShowOverlapDialog, objectsZoomScale,} = useCanvasContext()

  const { addHistory, tempUndo } = useHistory()
  const { snapToGrid } = useGrid()
  const listenersRef = useRef({})

  const createAnnotations = (setOriginalAngle) => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const circles = getAllCircles(canvas)
    const activeObj = canvas.getActiveObject()

    circles.forEach((circle) => {
      const anno = createAngleAnnotationForCircle(circle, {
        color: circle === activeObj ? '#3355FF' : '#9145E2',
      })
      if (anno) canvas.add(anno)
    })

    const lines = getAllMainLines(canvas)
    lines.forEach((line) => {
      if (line.lengthAnno) canvas.remove(line.lengthAnno)
      const anno = createLengthAnnotationForLine(
        canvas,
        line,
        line.circle1.angleAnno,
        line.circle2.angleAnno,
        {
          color: line === activeObj ? '#3355FF' : '#E50000',
        },
      )
      line.lengthAnno = anno
      if (anno) canvas.add(anno)
    })

    canvas.requestRenderAll()
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    let currentZoom = canvas.getZoom()
    var drwDirRev = drwDirRevRef.current

    const onDrawing = (event) => {
      const pointer = canvas.getPointer(event.e)
      const { x, y } = snapToGrid(pointer.x, pointer.y)

      if (event.target) {
        const clickedCircle = event.target
        const isCircleEdgeValidated = Boolean(clickedCircle.line1) ^ Boolean(clickedCircle.line2)
        if (clickedCircle !== activeCircle.current && isCircleEdgeValidated) {
          const { x, y } = clickedCircle.getCenterPoint()

          const bufferCircle = new Circle({
            left: x,
            top: y,
            radius: 10 / objectsZoomScale.current,
            stroke: 'rgba(51, 85, 255, 1)',
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

          clickedCircle.set({
            fill: 'rgba(51, 85, 255, 1)',
            radius: 4 / objectsZoomScale.current,
          })

          const prevActive = activeCircle.current
          canvas.remove(prevActive.bufferCircle)
          prevActive.set({ fill: '#000' })

          bufferCircle.mainCircle = clickedCircle
          clickedCircle.bufferCircle = bufferCircle
          activeCircle.current = clickedCircle

          drwDirRev = !drwDirRev
          drwDirRevRef.current = drwDirRev
          canvas.add(bufferCircle)
        }
        return
      }

      const exists = canvas
        .getObjects()
        .some((o) => o.type === 'circle' && o.left === x && o.top === y)
      if (!exists) {
        const prevCircle = activeCircle.current

        const newCircle = new Circle({
          left: x,
          top: y,
          radius: 4 / objectsZoomScale.current,
          fill: 'rgba(51, 85, 255, 1)',
          originX: 'center',
          originY: 'center',
          hasControls: false,
          hasBorders: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 12,
          selectable: false,
          evented: true,
          objectCaching: true,
          statefullCache: true,
        })

        const bufferCircle = new Circle({
          left: x,
          top: y,
          radius: 10 / objectsZoomScale.current,
          stroke: 'rgba(51, 85, 255, 1)',
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

        newCircle.bufferCircle = bufferCircle
        bufferCircle.mainCircle = newCircle

        if (prevCircle && undoStack.current.length) {
          canvas.remove(prevCircle.bufferCircle)
          prevCircle.set({ fill: '#000' })

          activeCircle.current = newCircle

          const line = new Line([prevCircle.left, prevCircle.top, newCircle.left, newCircle.top], {
            stroke: '#000',
            strokeWidth: 2 / objectsZoomScale.current,
            strokeLineCap: 'round',
            hasControls: false,
            hasBorders: false,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true,
            lockMovementX: true,
            lockMovementY: true,
            selectable: false,
            objectCaching: true,
            statefullCache: true,
          })

          const hitbox = new Line(
            [prevCircle.left, prevCircle.top, newCircle.left, newCircle.top],
            {
              strokeWidth: 20 / objectsZoomScale.current,
              stroke: 'rgba(0, 0, 0, 0.0005)',
              strokeLineCap: 'round',
              selectable: false,
              objectCaching: true,
              statefullCache: true,
              hoverCursor: 'pointer',
            },
          )

          line.hitboxLine = hitbox
          hitbox.originalLine = line
          hitbox.isHitboxLine = true

          line.circle1 = drwDirRev ? newCircle : prevCircle
          line.circle2 = drwDirRev ? prevCircle : newCircle
          newCircle[drwDirRev ? 'line2' : 'line1'] = line
          prevCircle[drwDirRev ? 'line1' : 'line2'] = line

          canvas.add(hitbox)
          canvas.add(line)
          setCanvasIsEmpty(false)
        } else {
          activeCircle.current = newCircle
        }

        canvas.add(bufferCircle)
        canvas.add(newCircle)

        addHistory('drawing', newCircle, true)

        if (hasAnyOverlap(canvas)) {
          tempUndo()
          document.getElementById('trigger-overlap-alert-dialog')?.click()
        } else {
          createAnnotations()
          addHistory('drawing', newCircle)
        }
      }
    }

    if (isDrawing && !isMoving) {
      createAnnotations()

      getAllCircles(canvas).forEach((circle) => {
        circle.set({
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 15,
        })
        canvas.bringObjectToFront(circle)
      })

      if (activeCircle.current) {
        canvas.remove(activeCircle.current.bufferCircle)
        const { x, y } = activeCircle.current.getCenterPoint()
        const buffer = new Circle({
          left: x,
          top: y,
          radius: 10 / objectsZoomScale.current,
          stroke: 'rgba(51, 85, 255, 1)',
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

        buffer.mainCircle = activeCircle.current
        activeCircle.current.bufferCircle = buffer

        canvas.add(buffer)
      }

      canvas.on('mouse:down', onDrawing)
      listenersRef.current = { onDrawing }
    }

    return () => {
      const { onDrawing } = listenersRef.current
      canvas.off('mouse:down', onDrawing)

      if (activeCircle.current) {
        canvas.remove(activeCircle.current.bufferCircle)
        activeCircle.current.set({
          selectable: false,
          padding: 0,
          fill: '#000',
        })
        delete activeCircle.current.bufferCircle
      }

      tempUndoStack.current = []
    }
  }, [isDrawing])
}
