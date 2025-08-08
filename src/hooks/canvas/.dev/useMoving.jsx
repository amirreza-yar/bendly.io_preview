'use client'

import { useEffect, useRef } from 'react'
import { Circle } from 'fabric'

import { useCanvasContext } from '@/providers/canvasContextProvider'
import { useUIVisibility } from '@/providers/UICanvasContext'
import { useHistory } from '../useHistory'
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

export default function useMoving() {
  const { canvasInstance, isMoving, setIsPanning, setIsCanvasChanged, setIsDrawing } =
    useCanvasContext()

  const { addHistory, snapshotCircles } = useHistory()
  const {
    setTopBarVisible,
    setActionBarVisible,
    setMovingTopBarVisible,
    setMovingActionBarVisible,
  } = useUIVisibility()

  const listenersRef = useRef({})

  const createAnnotations = () => {
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
      line.lengthAnno = lengthAnno
      if (lengthAnno) canvas.add(lengthAnno)
    })

    canvas.requestRenderAll()
  }

  const applyChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return

    const circles = getAllCircles(canvas)
    circles.forEach((circle) => {
      circle._redoPosition_move = circle.getCenterPoint()
    })

    const snap = snapshotCircles(circles, '_undoPosition_move', '_redoPosition_move')
    addHistory('move', snap)
    canvas.isChanged = false
    setIsCanvasChanged(false)
  }

  const resetChanges = () => {
    const canvas = canvasInstance.current
    if (!canvas) return

    getAllCircles(canvas).forEach((circle) => {
      moveCircle(circle, circle.originalPosition)
      repositionHitboxLine(circle)
    })

    setIsCanvasChanged(false)
    createAnnotations()
  }

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) return

    if (isMoving) {
      setTopBarVisible(false)
      setActionBarVisible(false)
      setMovingTopBarVisible(true)
      setMovingActionBarVisible(true)

      const currentZoom = canvas.getZoom()

      getAllCircles(canvas).forEach((circle) => {
        const { x, y } = circle.getCenterPoint()
        const buffer = new Circle({
          left: x,
          top: y,
          radius: 10 / objectsZoomScale.current,
          stroke: 'rgba(0, 153, 51, 1)',
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
        circle.originalPosition = circle.getCenterPoint()

        canvas.add(buffer)
        buffer.isBufferCircle = true
        buffer.mainCircle = circle
        circle.bufferCircle = buffer
        canvas.bringObjectToFront(circle)

        circle.on('mousedown', () => setIsPanning(false))
        circle.on('mouseup', () => setIsPanning(true))
      })

      const onMove = (e) => {
        let movingCircle = e.target
        if (movingCircle.mainCircle) movingCircle = movingCircle.mainCircle
        moveCircle(movingCircle)
        createAnnotations()
      }

      const onModified = (e) => {
        const canvas = canvasInstance.current
        if (!canvas) return

        setIsCanvasChanged(true)
        let movingCircle = e.target.mainCircle || e.target

        repositionHitboxLine(movingCircle)

        if (hasAnyOverlap(canvas)) {
          getAllCircles(canvas).forEach((circle) => {
            moveCircle(circle, circle._temp_undoPosition_move)
            repositionHitboxLine(circle)
          })
          createAnnotations()
          canvas.discardActiveObject()
          document.getElementById('trigger-overlap-alert-dialog')?.click()
        } else {
          getAllCircles(canvas).forEach((circle) => {
            circle._temp_undoPosition_move = circle.getCenterPoint()
          })
        }

        getAllCircles(canvas).forEach((circle) => {
          canvas.bringObjectToFront(circle.angleAnno)
          canvas.bringObjectToFront(circle)
        })
      }

      canvas.on('object:moving', onMove)
      canvas.on('object:modified', onModified)

      listenersRef.current = { onMove, onModified }
    }

    return () => {
      const { onMove, onModified } = listenersRef.current
      canvas.off('object:moving', onMove)
      canvas.off('object:modified', onModified)

      getAllCircles(canvas).forEach((circle) => {
        circle.set({
          selectable: false,
          fill: '#000',
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          padding: 0,
        })

        if (circle.bufferCircle) canvas.remove(circle.bufferCircle)
        circle.bufferCircle = null
        delete circle.originalPosition

        circle.off('mousedown')
        circle.off('mouseup')
        canvas.bringObjectToFront(circle)
      })

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
