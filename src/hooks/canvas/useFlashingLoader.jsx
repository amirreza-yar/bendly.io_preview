'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas, util, Object, Line, Circle, Text, Rect, Group, Gradient, Path } from 'fabric'
import { StoredFlashing } from '@/types/flashingTypes'

function sortFlashingNodes(flashing) {
  const nodeMap = new Map(flashing?.nodes.map((node) => [node.node_id, node]))

  // 1️⃣ Find starting node (no prev_node_id)
  let startNode = flashing?.nodes.find((node) => !node.prev_node_id)
  if (!startNode) {
    throw new Error('No starting node found (missing a node without prev_node_id).')
  }

  // 2️⃣ Traverse chain following next_node_id
  const sortedNodes = []
  let current = startNode
  const visited = new Set()

  while (current) {
    if (visited.has(current.node_id)) {
      console.warn('Loop detected in node chain at:', current.node_id)
      break
    }
    visited.add(current.node_id)
    sortedNodes.push(current)

    if (current.next_node_id) {
      current = nodeMap.get(current.next_node_id)
    } else {
      current = null // reached the end
    }
  }

  // 3️⃣ Return new object with sorted nodes
  return { ...flashing, nodes: sortedNodes }
}

// const flashing = {
//   nodes: [
//     {
//       node_id: '3pik7o',
//       left: 550,
//       top: 250,
//       next_node_id: 'xk6ibn',
//     },
//     {
//       node_id: 'xk6ibn',
//       left: 900,
//       top: 200,
//       prev_node_id: '3pik7o',
//       next_node_id: 'zsnkuo',
//     },
//     {
//       node_id: 'zsnkuo',
//       left: 900,
//       top: 400,
//       prev_node_id: 'xk6ibn',
//       next_node_id: '9dntq7',
//     },
//     {
//       node_id: '9dntq7',
//       left: 700,
//       top: 550,
//       prev_node_id: 'zsnkuo',
//       next_node_id: 'lm247w',
//     },
//     {
//       node_id: 'lm247w',
//       left: 850,
//       top: 550,
//       prev_node_id: '9dntq7',
//     },
//   ],
//   startCrushFold: false,
//   endCrushFold: false,
//   crushFoldDir: false,
// }

function createCrushFoldObject(circle, direction, position) {
  const dirCoef = direction ? 1 : -1

  let crushFoldObject
  if (position === 'start') {
    // circle center + radius
    const cx = circle.left + circle.radius
    const cy = circle.top + circle.radius
    const r = circle.radius

    const line = circle.line2

    const { x1, y1, x2, y2 } = line
    const mainAngle = Math.atan2(y2 - y1, x2 - x1)

    console.log((mainAngle * 180) / Math.PI)

    crushFoldObject = new Circle({
      radius: 6,
      left: cx - 6.75 * Math.cos(mainAngle - 90 * dirCoef) - 2.6 * Math.cos(mainAngle),
      top: cy - 6.75 * Math.sin(mainAngle - 90 * dirCoef) - 2.6 * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI + 90,
      endAngle: (mainAngle * 180) / Math.PI - 90,
      stroke: '#000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      fill: '',
      strokeLineCap: 'round',
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    })

    // const endWindLine = new Line()
  } else if (position === 'end') {
    // circle center + radius
    const cx = circle.left + circle.radius
    const cy = circle.top + circle.radius
    const r = circle.radius

    const line = circle.line1

    const { x1, y1, x2, y2 } = line
    const mainAngle = Math.atan2(y2 - y1, x2 - x1)

    console.log((mainAngle * 180) / Math.PI)

    crushFoldObject = new Circle({
      radius: 6,
      left: cx - 6.75 * Math.cos(mainAngle - 90 * dirCoef) - 2.6 * Math.cos(mainAngle),
      top: cy - 6.75 * Math.sin(mainAngle - 90 * dirCoef) - 2.6 * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI - 90,
      endAngle: (mainAngle * 180) / Math.PI + 90,
      stroke: '#000',
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
      fill: '',
      strokeLineCap: 'round',
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    })

    // const endWindLine = new Line()
  }

  return crushFoldObject
}

function createColorSideCrushFoldObject(circle, direction, position, offset) {
  const dirCoef = direction ? 1 : -1

  console.log('offset is:', offset)

  let crushFoldObject
  if (position === 'start') {
    // circle center + radius
    const cx = circle.left + circle.radius
    const cy = circle.top + circle.radius
    const r = circle.radius

    const line = circle.line2

    const { x1, y1, x2, y2 } = line
    const mainAngle = Math.atan2(y2 - y1, x2 - x1)

    console.log((mainAngle * 180) / Math.PI)

    crushFoldObject = new Circle({
      radius: offset * 1.4,
      left:
        cx -
        ((11.25 * offset) / 7) * Math.cos(mainAngle - 90 * dirCoef) -
        ((10 * offset) / 13) * Math.cos(mainAngle),
      top:
        cy -
        ((11.25 * offset) / 7) * Math.sin(mainAngle - 90 * dirCoef) -
        ((10 * offset) / 13) * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI + 90,
      endAngle: (mainAngle * 180) / Math.PI - 90,
      stroke: '#ef9393',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      fill: '',
      strokeLineCap: 'round',
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    })

    // const endWindLine = new Line()
  } else if (position === 'end') {
    // circle center + radius
    const cx = circle.left + circle.radius
    const cy = circle.top + circle.radius
    const r = circle.radius

    const line = circle.line1

    const { x1, y1, x2, y2 } = line
    const mainAngle = Math.atan2(y2 - y1, x2 - x1)

    console.log((mainAngle * 180) / Math.PI)

    crushFoldObject = new Circle({
      radius: offset * 1.4,
      left:
        cx -
        ((11.25 * offset) / 7) * Math.cos(mainAngle - 90 * dirCoef) -
        ((10 * offset) / 13) * Math.cos(mainAngle),
      top:
        cy -
        ((11.25 * offset) / 7) * Math.sin(mainAngle - 90 * dirCoef) -
        ((10 * offset) / 13) * Math.sin(mainAngle),
      angle: 0,
      startAngle: (mainAngle * 180) / Math.PI - 90,
      endAngle: (mainAngle * 180) / Math.PI + 90,
      stroke: '#ef9393',
      strokeWidth: 3,
      originX: 'center',
      originY: 'center',
      fill: '',
      strokeLineCap: 'round',
      selectable: false,
      lockScalingX: true,
      lockScalingY: true,
      lockMovementX: true,
      lockMovementY: true,
    })

    // const endWindLine = new Line()
  }

  return crushFoldObject
}

export function getTotalGirth(nodes) {
  if (!Array.isArray(nodes)) return
  if (nodes.length === 0) return 0

  const nodeMap = nodes.reduce((acc, n) => {
    acc[n.node_id] = n
    return acc
  }, {})

  let current = nodes.find((n) => !n.prev_node_id)
  if (!current) return 0

  let total = 0
  const visited = new Set()

  while (current && current.next_node_id && !visited.has(current.node_id)) {
    visited.add(current.node_id)

    const next = nodeMap[current.next_node_id]
    if (!next) break

    const dx = next.left - current.left
    const dy = next.top - current.top
    total += Math.hypot(dx, dy) // cleaner Euclidean distance

    current = next
  }

  return Math.round(total)
}

export const addColorSideFlashing = (
  canvas,
  direction = false,
  startCrushFold = false,
  endCrushFold = false,
  baseOffset = 4,
  inputFlagOffset = 50,
) => {
  let prevAngle = direction ? Math.PI / 2.5 : -Math.PI / 2.5

  let prevNode

  const circles = canvas.getObjects('circle')

  const addCircle = (circle, angle, offset) => {
    const newCircle = new Circle({
      top: circle.top + offset * Math.sin(angle),
      left: circle.left + offset * Math.cos(angle),
      originX: 'center',
      originY: 'center',
      radius: 0.2,
      fill: 'blue',
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
      // objectCaching: true,
      // statefullCache: true,
    })
    canvas.add(newCircle)

    return newCircle
  }

  const addLine = ({ prevNode, circle, offset, angle }) => {
    const newLine = new Line(
      [
        prevNode.left,
        prevNode.top,
        circle.left + offset * Math.cos(angle),
        circle.top + offset * Math.sin(angle),
      ],
      {
        stroke: '#ef9393',
        strokeWidth: 3,
        strokeLineCap: 'round',
        hasControls: false,
        hasBorders: false,
        lockRotation: true,
        lockScalingX: true,
        lockScalingY: true,
        lockMovementX: true,
        lockMovementY: true,
        selectable: false,
        objectCaching: false,
        statefullCache: false,
      },
    )
    canvas.add(newLine)
    return newLine
  }

  let offset

  let startCircle, endCircle
  let startLine, endLine

  const toggleButtonPosition = { top: 0, left: 0 }

  const colorSideObjects = []

  circles.map((circle) => {
    if (!circle.line1 && circle.line2) {
      const line = circle.line2
      const dx = line.x1 - line.x2
      const dy = line.y1 - line.y2

      const angleRad = Math.atan2(dy, dx)

      const angle = angleRad + prevAngle

      offset = baseOffset

      startCircle = addCircle(circle, angle, offset)

      colorSideObjects.push(startCircle)

      startCrushFold && canvas.add(createCrushFoldObject(circle, direction, 'start'))

      circle.colorSideCircle = startCircle

      prevNode = {
        top: circle.top + offset * Math.sin(angle),
        left: circle.left + offset * Math.cos(angle),
      }

      prevAngle = angleRad
    } else if (circle.line2 && circle.line1) {
      const line = circle.line2
      const dx = line.x1 - line.x2
      const dy = line.y1 - line.y2

      const angleRad = Math.atan2(dy, dx)

      let sign = Math.abs(angleRad - prevAngle) > Math.PI ? 1 : -1

      if (!direction) {
        sign = sign * 1
      } else {
        sign = sign * -1
      }

      const angle = prevAngle + (sign * Math.PI) / 2 + (angleRad - prevAngle) / 2

      offset =
        baseOffset /
        Math.abs(
          Math.sin(
            (Math.atan2(circle.line2.y2 - circle.line2.y1, circle.line2.x2 - circle.line2.x1) -
              Math.atan2(circle.line1.y1 - circle.line1.y2, circle.line1.x1 - circle.line1.x2)) /
              2,
          ),
        )

      const newLine = addLine({ prevNode, circle, offset, angle })

      colorSideObjects.push(newLine)

      if (!circle.line1.circle1.line1) {
        startLine = newLine

        startCircle.line2 = newLine

        const x1 = newLine.x1
        const y1 = newLine.y1
        const x2 = newLine.x2
        const y2 = newLine.y2

        // Compute midpoint of the line
        const px = x1 + 0.5 * (x2 - x1) // or (x1 + x2) / 2
        const py = y1 + 0.5 * (y2 - y1) // or (y1 + y2) / 2

        const dx = x2 - x1
        const dy = y2 - y1
        const length = Math.sqrt(dx * dx + dy * dy)

        // Perpendicular unit vector for offsetting the flag
        const ux = -dy / length
        const uy = dx / length

        // Offsets to avoid overlap with line
        const flagOffset = direction ? -inputFlagOffset : inputFlagOffset
        const textOffsetX = ux * flagOffset
        const textOffsetY = uy * flagOffset

        // Final flag position
        const fx = px + textOffsetX
        const fy = py + textOffsetY

        toggleButtonPosition.top = py - textOffsetY
        toggleButtonPosition.left = px - textOffsetX

        const flagText = new Text('Color Side', {
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
          fill: '#009933',
          selectable: false,
          evented: false,
        })

        const circle = new Circle({
          radius: 2,
          fill: '#009933',
          left: px,
          top: py,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        })

        const lineConnector = new Line([px, py, fx, fy], {
          stroke: '#009933',
          strokeWidth: 1,
          selectable: false,
          evented: false,
        })

        // const flagGroup = new Group([flagBg, lineConnector, circle, flagText], {
        //   selectable: false,
        //   evented: false,
        // })

        flagBg._colorSideFlag = true
        flagText._colorSideFlag = true
        circle._colorSideFlag = true
        lineConnector._colorSideFlag = true

        // flagGroup._isMeasurement = true
        canvas.add(flagBg, flagText, circle, lineConnector)

        colorSideObjects.push()

        if (startCrushFold) {
          const crushFoldObject = createColorSideCrushFoldObject(
            startCircle,
            direction,
            'start',
            baseOffset,
          )

          console.log('offset is:', baseOffset)

          canvas.add(crushFoldObject)

          colorSideObjects.push(crushFoldObject)
        }
      }

      prevNode = {
        top: circle.top + offset * Math.sin(angle),
        left: circle.left + offset * Math.cos(angle),
      }

      prevAngle = angleRad
    } else if (circle.line1 && !circle.line2) {
      const line = circle.line1
      const dx = line.x1 - line.x2
      const dy = line.y1 - line.y2

      const angleRad = Math.atan2(dy, dx)

      const angle = !direction ? angleRad - Math.PI / 2 : angleRad + Math.PI / 2

      offset = baseOffset

      endCircle = addCircle(circle, angle, offset)

      endLine = addLine({ prevNode, circle, offset, angle })

      colorSideObjects.push(endCircle)
      colorSideObjects.push(endLine)

      endCircle.line1 = endLine

      if (endCrushFold) {
        canvas.add(createCrushFoldObject(circle, direction, 'end'))

        const crushFoldObject = createColorSideCrushFoldObject(
          endCircle,
          direction,
          'end',
          baseOffset,
        )

        colorSideObjects.push(crushFoldObject)

        canvas.add(crushFoldObject)
      }
    }
  })

  // canvas.bringObjectToFront(colorSideObjects.find((obj) => obj._isMeasurement))

  return { colorSideObjects, toggleButtonPosition }
}

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
        // objectCaching: true,
        // statefullCache: true,
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

// Parameters for 3D effect
const offset3D = { x: 180, y: -145 }
const drawConnectingLines = true // Flag to control drawing connecting lines
const annotationOffset = 22 // Distance of annotations from lines

export function create3DFlashing(canvas) {
  // Clear existing 3D elements
  const existingElements = canvas
    .getObjects()
    .filter((obj) => obj.side === 'B' || obj._isMeasurement || obj.type === 'path')
  existingElements.forEach((obj) => canvas.remove(obj))

  // DEBUG: Log all lines
  const allLines = canvas.getObjects('line')
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

  const negativeOffset = shouldUseNegativeXOffset(aLines)
  negativeOffset ? (offset3D.x = offset3D.x * -1) : {}

  // 3. Create B side points
  let bPoints = aPoints.map((pt, idx) => {
    const bp = { x: pt.x + offset3D.x, y: pt.y + offset3D.y }
    //console.log(`B side point ${idx}:`, bp)
    return bp
  })

  let circle1 = createBCircle(bPoints[0].x, bPoints[0].y)
  canvas.add(circle1)
  circle1.side = 'B'
  let circle2

  // 4. Draw B side lines
  for (let i = 0; i < bPoints.length - 1; i++) {
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
      // objectCaching: true,
      // statefullCache: true,

      // active: true,

      hoverCursor: 'pointer',
    })

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

    canvas.add(line)
    bLines.push(line)

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
}

export const drawingBounds = (canvas) => {
  const objs = canvas.getObjects()
  if (objs.length === 0) return

  // Compute bounds of all objects
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

  return { groupWidth, groupHeight }
}

export const centerDrawingGroup = (
  canvas,
  minPadding = 50, // uniform padding all sides
) => {
  const objs = canvas.getObjects()
  if (objs.length === 0) return

  // Compute bounds of all objects
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

  // Available space inside canvas after padding
  const availableW = canvasWidth - 2 * minPadding
  const availableH = canvasHeight - 2 * minPadding

  // Calculate scale to fit group inside available space
  let scale = Math.min(availableW / groupWidth, availableH / groupHeight)
  scale = Math.max(0.1, Math.min(scale, 2)) // clamp scale

  const contentWidth = groupWidth * scale
  const contentHeight = groupHeight * scale

  // Calculate offsets so group is exactly centered
  // Center of canvas:
  const canvasCenterX = canvasWidth / 2
  const canvasCenterY = canvasHeight / 2

  // Center of group before scaling:
  const groupCenterX = minX + groupWidth / 2
  const groupCenterY = minY + groupHeight / 2

  // Offset such that group center aligns with canvas center
  const offsetX = canvasCenterX - groupCenterX * scale
  const offsetY = canvasCenterY - groupCenterY * scale

  // Set viewport transform immediately
  canvas.viewportTransform = [scale, 0, 0, scale, offsetX, offsetY]
  canvas.setZoom(scale)
  console.log(scale)

  objs
    // .filter((obj) => obj._colorSideFlag)
    .map((obj) => {
      if (obj.type === 'line') {
        if (!obj.connetingLine && !(obj.side === 'B')) {
          obj.set({ strokeWidth: obj.strokeWidth / scale / 1.2 })
        }
        canvas.sendObjectToBack(obj)
      } else if (obj.type === 'circle') {
        if (obj._colorSideFlag) {
          obj.set({ radius: obj.radius / scale / 0.7 })
        }
        obj.set({ strokeWidth: obj.strokeWidth / scale / 1.2 })
      } else if (obj.type === 'rect') {
        obj.set({ height: obj.height / scale / 0.7, width: obj.width / scale / 0.7 })
      } else if (obj.type === 'text') {
        canvas.bringObjectToFront(obj)
        obj.set({ fontSize: obj.fontSize / scale / 0.7 })
      } else if (obj.type === 'path') {
        canvas.sendObjectToBack(obj)
      }
    })

  canvas.requestRenderAll()
}

export const loadFlashing = (canvas, flashing) => {
  sortFlashingNodes(flashing).nodes.map((cir) => {
    canvas.add(
      new Circle({
        node_id: cir.node_id,
        next_node_id: cir.next_node_id,
        left: cir.left,
        top: cir.top,
        next_line_bside_length: cir.next_line_bside_length,
        originX: 'center',
        originY: 'center',
        radius: 0.2,
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
        // objectCaching: true,
        // statefullCache: true,
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
          strokeWidth: 2,
          strokeLineCap: 'round',
          hasControls: false,
          hasBorders: false,
          lockRotation: true,
          lockScalingX: true,
          lockScalingY: true,
          lockMovementX: true,
          lockMovementY: true,
          selectable: false,
          // objectCaching: true,
          // statefullCache: true,
        },
      )

      line.side = 'A'

      currentCir.line2 = line
      nextCir.line1 = line

      line.circle1 = currentCir
      line.circle2 = nextCir

      canvas.add(line)

      circles.forEach((cir) => {
        canvas.bringObjectToFront(cir)
      })
    })
}
