'use client'
import { util } from 'fabric'

import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import useGrid from '@/hooks/canvas/useGrid'
import { Group } from 'fabric'

export default function useObjectUtils() {
  const { canvasInstance, setZoomTargetRef, setLastDotRef, isResizing, setIsResizing } =
    useCanvasContext()
  const { createGrid } = useGrid()

  const groupDrawings = () => {
    const canvas = canvasInstance.current
    const objects = canvas
      .getObjects()
      .filter((obj) => obj.type === 'circle' || obj.type === 'line')

    if (objects.length === 0) return

    const drawingGroup = new Group(objects, {
      name: 'drawing_group',
      selectable: false,
      evented: false,
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

    canvas.add(drawingGroup)
    drawingGroup.setCoords()
    objects.forEach((obj) => canvas.remove(obj))
    canvas.requestRenderAll()

    return drawingGroup
  }

  const unGroupDrawings = () => {
    const canvas = canvasInstance.current
    const currentZoom = canvas.getZoom()

    const drawingGroup = canvas.getObjects().find((obj) => obj.name === 'drawing_group')

    if (!drawingGroup || drawingGroup.type !== 'group') return

    const items = drawingGroup._objects
    items.forEach((item) => {
      if (item.type === 'circle') {
        item.set({
          radius: 3 / objectsZoomScale.current,
          fill: '#000',
        })
        item.line1?.set({ x2: item.left, y2: item.top })
        item.line2?.set({ x1: item.left, y1: item.top })
        if (item.isEdge) setLastDotRef(item.getCenterPoint())
      } else if (item.type === 'line') {
        if (!item.isHitboxLine) {
          item.set({
            strokeWidth: 3 / objectsZoomScale.current,
          })
        }
        item.setCoords()
      }
    })

    canvas.remove(drawingGroup)
    items.forEach((item) => {
      canvas.add(item)
      item.setCoords()
    })
    canvas.requestRenderAll()
  }

  /**
   * Center and zoom to fit all drawing objects.
   * Horizontal padding is applied symmetrically. Vertical padding: top always uses paddingX;
   * if paddingB is provided, it is applied only to the bottom (i.e. top-padding remains paddingX).
   * @param paddingX - horizontal padding (left & right) and top padding
   * @param paddingB - bottom padding (if undefined, bottom uses paddingX)
   * @param duration - animation duration in ms
   */
  const centerDrawingGroup = (
    minPaddingX = 50,
    minPaddingB = 150,
    minPaddingT = 150,
    duration = 500,
  ) => {
    const canvas = canvasInstance.current
    const objs = canvas.getObjects().filter((o) => o.type === 'circle' || o.type === 'line')
    if (objs.length === 0) return

    // Compute bounds
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    objs.forEach((obj) => {
      obj.setCoords()
      const bounds = obj.getBoundingRect()
      minX = Math.min(minX, bounds.left)
      minY = Math.min(minY, bounds.top)
      maxX = Math.max(maxX, bounds.left + bounds.width)
      maxY = Math.max(maxY, bounds.top + bounds.height)
    })

    const groupWidth = maxX - minX
    const groupHeight = maxY - minY

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()

    // Available dimensions
    const availableW = canvasWidth - 2 * minPaddingX
    const availableH = canvasHeight - minPaddingT - minPaddingB

    // Scale to fit
    let scale = Math.min(availableW / groupWidth, availableH / groupHeight)
    scale = Math.max(0.1, Math.min(scale, 2)) // clamp

    const contentWidth = groupWidth * scale
    const contentHeight = groupHeight * scale

    // Horizontal: always center
    const offsetX = (canvasWidth - contentWidth) / 2 - minX * scale

    // Vertical: respect padding asymmetrically
    const remainingH = canvasHeight - contentHeight
    const offsetY = Math.max(minPaddingT, remainingH - minPaddingB) - minY * scale

    const start = canvas.viewportTransform.slice()
    const end = [scale, 0, 0, scale, offsetX, offsetY]

    util.animate({
      startValue: 0,
      endValue: 1,
      duration,
      easing: util.ease.easeOutQuad,
      onChange: (t) => {
        const interp = start.map((s, i) => s + (end[i] - s) * t)
        canvas.viewportTransform = interp
        canvas.requestRenderAll()
      },
      onComplete: () => {
        canvas.viewportTransform = end
        canvas.setZoom(scale)
        // setZoomTargetRef(scale)
        createGrid()
        canvas.requestRenderAll()
      },
    })
  }

  // const centerDrawingGroup = (paddingX, paddingB, paddingT, duration = 500) => {
  //   const canvas = canvasInstance.current
  //   const objs = canvas.getObjects().filter((o) => o.type === 'circle' || o.type === 'line')
  //   if (objs.length === 0) return

  //   const topPad = paddingT
  //   // const bottomPad = paddingB !== 0 ? paddingB : 0;

  //   // const bottomPad = paddingB > 150 ? paddingB : 150

  //   const bottomPad = paddingB

  //   // Compute bounding box of all items
  //   let minX = Infinity,
  //     minY = Infinity,
  //     maxX = -Infinity,
  //     maxY = -Infinity
  //   objs.forEach((obj) => {
  //     obj.setCoords()
  //     const bounds = obj.getBoundingRect()
  //     minX = Math.min(minX, bounds.left)
  //     minY = Math.min(minY, bounds.top)
  //     maxX = Math.max(maxX, bounds.left + bounds.width)
  //     maxY = Math.max(maxY, bounds.top + bounds.height)
  //   })

  //   const groupWidth = maxX - minX
  //   const groupHeight = maxY - minY

  //   const canvasWidth = canvas.getWidth()
  //   const canvasHeight = canvas.getHeight()

  //   // Available space after padding
  //   const availableW = canvasWidth - 2 * paddingX
  //   const availableH = canvasHeight - topPad - bottomPad

  //   let scale = Math.min(availableW / groupWidth, availableH / groupHeight)
  //   scale = Math.max(0.1, Math.min(scale, 2))

  //   // Horizontal center
  //   const offsetX = (canvasWidth - groupWidth * scale) / 2 - minX * scale
  //   // Vertical position: top padding only
  //   const offsetY = topPad - minY * scale

  //   const start = canvas.viewportTransform.slice()
  //   const end = [scale, 0, 0, scale, offsetX, offsetY]

  //   util.animate({
  //     startValue: 0,
  //     endValue: 1,
  //     duration,
  //     easing: util.ease.easeOutQuad,
  //     onChange: (t) => {
  //       const interp = start.map((s, i) => s + (end[i] - s) * t)
  //       canvas.viewportTransform = interp
  //       canvas.requestRenderAll()
  //     },
  //     onComplete: () => {
  //       canvas.viewportTransform = end
  //       canvas.setZoom(scale)
  //       setZoomTargetRef(scale)
  //       createGrid()
  //       canvas.requestRenderAll()
  //     },
  //   })
  // }

  return { groupDrawings, unGroupDrawings, centerDrawingGroup }
}
