'use client'

import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import { Circle, Line } from 'fabric'
import { useEffect } from 'react'
import { useHistory } from './useHistory'
import { removeAnnotations } from '@/utilities/canvas/annotationUtils'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'
import useObjectUtils from './useObjectUtils'

export default function useLoading({ flashing }) {
  const {
    canvasInstance,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    objectsZoomScale,
    setCanvasIsEmpty,
    activeCircle,
    crushFoldObjectDirectionRef,
    setIsDrawing,
  } = useCanvasContext()
  const { addHistory } = useHistory()
  const { centerDrawingGroup } = useObjectUtils()

  const removeCrushFoldObject = (canvas, position) => {
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

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) {
      // console.error('canvas not loaded')
      return
    }

    if (canvas) {
      crushFoldObjectDirectionRef.current = flashing.crushFoldDir

      flashing.nodes.map((cir) => {
        canvas.add(
          new Circle({
            node_id: cir.node_id,
            next_node_id: cir.next_node_id,
            left: cir.left,
            top: cir.top,
            next_line_bside_length: cir.next_line_bside_length,
            originX: 'center',
            originY: 'center',
            radius: 4 / objectsZoomScale.current,
            fill: '#000',
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
          }),
        )
      })

      const circles = canvas.getObjects().filter((obj) => obj.type === 'circle')

      circles
        .filter((cir) => cir.next_node_id)
        .map((cir) => {
          const currentCir = cir
          const nextCir = canvas.getObjects().find((obj) => obj.node_id === currentCir.next_node_id)

          const line = new Line(
            [
              currentCir.getCenterPoint().x,
              currentCir.getCenterPoint().y,
              nextCir.getCenterPoint().x,
              nextCir.getCenterPoint().y,
            ],
            {
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
            },
          )

          const hitboxLine = new Line(
            [
              currentCir.getCenterPoint().x,
              currentCir.getCenterPoint().y,
              nextCir.getCenterPoint().x,
              nextCir.getCenterPoint().y,
            ],
            {
              strokeWidth: 20 / objectsZoomScale.current, // Hitbox size
              // stroke: "rgba(0,0,0,0)", // Fully transparent
              stroke: 'rgba(0, 0, 0, 0.0005)',
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
            },
          )
          console.log(currentCir)

          if (currentCir.next_line_bside_length) {
            line.bSideLineLength = currentCir.next_line_bside_length
          }

          line.hitboxLine = hitboxLine
          hitboxLine.originalLine = line
          hitboxLine.isHitboxLine = true

          hitboxLine.perPixelTargetFind = true
          line.perPixelTargetFind = true

          currentCir.line2 = line
          nextCir.line1 = line

          line.circle1 = currentCir
          line.circle2 = nextCir

          canvas.add(line)

          circles.forEach((cir) => {
            canvas.bringObjectToFront(cir)
          })

          setCanvasIsEmpty(false)

          addHistory('drawing', currentCir, true)

          console.log(nextCir.node_id)
        })

      activeCircle.current = circles.find((cir) => !cir.next_node_id)

      if (flashing.startCrushFold) {
        const startCircle = circles.find((cir) => !cir.prev_node_id)
        startCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, startCircle, 'start')
        console.log(
          startCircle.prev_node_id,
          startCircle.prev_next_id,
          startCircle.line1,
          startCircle.node_id,
        )
      }

      if (flashing.endCrushFold) {
        const endCircle = circles.find((cir) => !cir.next_node_id)
        endCircle.set({ radius: 0.2 })
        addCrushFoldObject(canvas, endCircle, 'end')
        console.log(
          endCircle.prev_node_id,
          endCircle.prev_next_id,
          endCircle.line1,
          endCircle.node_id,
        )
      }

      centerDrawingGroup(50, 150, 130)

      setIsDrawing(true)
    }
    return () => {
      canvas.dispose()
    }
  }, [canvasInstance.current])
}
