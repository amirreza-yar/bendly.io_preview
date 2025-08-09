'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas, util, Object, Line, Circle } from 'fabric'

function sortFlashingNodes(flashing) {
  const nodeMap = new Map(flashing.nodes.map((node) => [node.node_id, node]))

  // 1️⃣ Find starting node (no prev_node_id)
  let startNode = flashing.nodes.find((node) => !node.prev_node_id)
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

const flashing = {
  nodes: [
    {
      node_id: '8vbxli',
      left: 254.62889312011072,
      top: 258.10056296019377,
      prev_node_id: 'nivg1z',
      next_node_id: '3rglhn',
    },
    {
      node_id: '3rglhn',
      left: 300,
      top: 350,
      prev_node_id: '8vbxli',
      next_node_id: '9u629p',
    },
    {
      node_id: '9u629p',
      left: 300,
      top: 450,
      prev_node_id: '3rglhn',
      next_node_id: '19he5x',
    },
    {
      node_id: '19he5x',
      left: 400,
      top: 350,
      prev_node_id: '9u629p',
      next_node_id: 'xbwwbu',
    },
    {
      node_id: 'nivg1z',
      left: 154.62889312011072,
      top: 258.10056296019377,
      next_node_id: '8vbxli',
    },
    {
      node_id: 'xbwwbu',
      left: 500,
      top: 450,
      prev_node_id: '19he5x',
      next_node_id: 'm7nts4',
    },
    {
      node_id: 'k44k6e',
      left: 100,
      top: 500,
      prev_node_id: 'if0a47',
      next_node_id: 'j4zyno',
    },

    {
      node_id: 'm7nts4',
      left: 400,
      top: 550,
      prev_node_id: 'xbwwbu',
      next_node_id: 'sg0n9g',
    },
    {
      node_id: 'sg0n9g',
      left: 500,
      top: 650,
      prev_node_id: 'm7nts4',
      next_node_id: 'wob6gb',
    },
    {
      node_id: 'wob6gb',
      left: 200,
      top: 650,
      prev_node_id: 'sg0n9g',
      next_node_id: 'if0a47',
    },
    {
      node_id: 'q30flp',
      left: 300,
      top: 500,
      prev_node_id: 'j4zyno',
    },
    {
      node_id: 'if0a47',
      left: 200,
      top: 500,
      prev_node_id: 'wob6gb',
      next_node_id: 'k44k6e',
    },

    {
      node_id: 'j4zyno',
      left: 200,
      top: 400,
      prev_node_id: 'k44k6e',
      next_node_id: 'q30flp',
    },
  ],
  startCrushFold: false,
  endCrushFold: false,
  crushFoldDir: true,
}

function getAngleBetweenLines(line1, line2) {
  // Assume they share line1's x1,y1 with line2's x1,y1 (can adjust logic)
  const P0 = { x: line1.x1, y: line1.y1 }
  const P1 = { x: line1.x2, y: line1.y2 }
  const P2 = { x: line2.x2, y: line2.y2 }

  // Vector 1
  const v1x = P0.x - P1.x
  const v1y = P0.y - P1.y

  // Vector 2
  const v2x = P0.x - P2.x
  const v2y = P0.y - P2.y

  // Dot product
  const dot = v1x * v2x + v1y * v2y

  // Magnitudes
  const mag1 = Math.hypot(v1x, v1y)
  const mag2 = Math.hypot(v2x, v2y)

  // Angle in radians
  const angleRad = Math.acos(dot / (mag1 * mag2))

  // Convert to degrees
  return angleRad * (180 / Math.PI)
}

const CanvasTest: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#f9f9f9',
      selection: false,
    })

    canvas.setWidth(1000)
    canvas.setHeight(2000)

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
          radius: 4,
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
            objectCaching: true,
            statefullCache: true,
          },
        )

        currentCir.line2 = line
        nextCir.line1 = line

        line.circle1 = currentCir
        line.circle2 = nextCir

        canvas.add(line)

        circles.forEach((cir) => {
          canvas.bringObjectToFront(cir)
        })
      })

    let prevAngle = Math.PI / 2

    circles.map((circle) => {
      if (!circle.line1 && circle.line2) {
        const line = circle.line2
        const dx = line.x1 - line.x2
        const dy = line.y1 - line.y2

        const angleRad = Math.atan2(dy, dx) // radians

        // console.log((angleRad * 180) / 3.14)

        console.log('angleRad - prevAngle:', (angleRad - prevAngle * 180) / 3.14)

        canvas.add(
          new Circle({
            top: circle.top + 10 * Math.sin(angleRad - prevAngle),
            left: circle.left + 10 * Math.cos(angleRad - prevAngle),
            originX: 'center',
            originY: 'center',
            radius: 2,
            fill: 'red',
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

        prevAngle = angleRad
      } else if (circle.line2) {
        const line = circle.line2
        const dx = line.x1 - line.x2
        const dy = line.y1 - line.y2

        const angleRad = Math.atan2(dy, dx) // radians

        // console.log('prevAngle:', (prevAngle * 180) / 3.14)

        // console.log('angleRad:', (angleRad * 180) / 3.14)

        const sign = Math.abs(angleRad - prevAngle) > Math.PI ? 1 : -1
        console.log('angleRad - prevAngle:', ((angleRad - prevAngle) * 180) / 3.14, sign)

        canvas.add(
          new Circle({
            top:
              circle.top +
              10 * Math.sin(prevAngle + (sign * Math.PI) / 2 + (angleRad - prevAngle) / 2),
            left:
              circle.left +
              10 * Math.cos(prevAngle + (sign * Math.PI) / 2 + (angleRad - prevAngle) / 2),
            originX: 'center',
            originY: 'center',
            radius: 2,
            fill: 'red',
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

        prevAngle = angleRad
      } else if (circle.line1 && !circle.line2) {
        const line = circle.line1
        const dx = line.x1 - line.x2
        const dy = line.y1 - line.y2

        const angleRad = Math.atan2(dy, dx) // radians

        // console.log((angleRad * 180) / 3.14)

        console.log('angleRad - prevAngle:', (angleRad - prevAngle * 180) / 3.14)

        canvas.add(
          new Circle({
            top: circle.top + 10 * Math.sin(angleRad - Math.PI / 2),
            left: circle.left + 10 * Math.cos(angleRad - Math.PI / 2),
            originX: 'center',
            originY: 'center',
            radius: 2,
            fill: 'red',
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
      }
      // else if (circle.line1 && circle.line2) {
      //   const line1 = circle.line1
      //   const line2 = circle.line2

      //   const angleRad1 = Math.atan2(line1.y2 - line1.y1, line1.x2 - line1.x1) // radians
      //   const angleRad2 = Math.atan2(line2.y2 - line2.y1, line2.x2 - line2.x1) // radians

      //   const angleRad = getAngleBetweenLines(line1, line2)

      //   console.log(
      //     'angleRad: ',
      //     (angleRad * 180) / 3.14,
      //     (angleRad1 * 180) / 3.14,
      //     (angleRad2 * 180) / 3.14,
      //   )

      //   canvas.add(
      //     new Circle({
      //       top: circle.top + 10 * Math.sin(angleRad1 - angleRad2),
      //       left: circle.left + 10 * Math.cos(angleRad1 - angleRad2),
      //       originX: 'center',
      //       originY: 'center',
      //       radius: 2,
      //       fill: 'red',
      //       hasControls: false,
      //       hasBorders: false,
      //       lockRotation: true,
      //       lockScalingX: true,
      //       lockScalingY: true,
      //       lockMovementX: true,
      //       lockMovementY: true,
      //       padding: 12,
      //       selectable: false,
      //       evented: true,
      //       objectCaching: true,
      //       statefullCache: true,
      //     }),
      //   )
      // }
    })

    return () => {
      canvas.dispose()
    }
  }, [])

  // useEffect(() => {
  //   if (!canvasRef.current) return

  //   const canvas = new Canvas(canvasRef.current, {
  //     backgroundColor: '#f9f9f9',
  //     selection: false,
  //   })

  //   canvas.add(
  //     new Line([50, 50, 100, 100], {
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       strokeLineCap: 'round',
  //       hasControls: false,
  //       hasBorders: false,
  //       lockRotation: true,
  //       lockScalingX: true,
  //       lockScalingY: true,
  //       lockMovementX: true,
  //       lockMovementY: true,
  //       selectable: false,
  //       objectCaching: true,
  //       statefullCache: true,
  //     }),
  //   )

  //   canvas.add(
  //     new Line([100, 100, 150, 100], {
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       strokeLineCap: 'round',
  //       hasControls: false,
  //       hasBorders: false,
  //       lockRotation: true,
  //       lockScalingX: true,
  //       lockScalingY: true,
  //       lockMovementX: true,
  //       lockMovementY: true,
  //       selectable: false,
  //       objectCaching: true,
  //       statefullCache: true,
  //     }),
  //   )

  //   canvas.add(
  //     new Line([150, 100, 150, 150], {
  //       stroke: '#000',
  //       strokeWidth: 2,
  //       strokeLineCap: 'round',
  //       hasControls: false,
  //       hasBorders: false,
  //       lockRotation: true,
  //       lockScalingX: true,
  //       lockScalingY: true,
  //       lockMovementX: true,
  //       lockMovementY: true,
  //       selectable: false,
  //       objectCaching: true,
  //       statefullCache: true,
  //     }),
  //   )

  //   const anglesRad = []

  //   canvas.getObjects('line').map((line) => {
  //     const dx = line.x1 - line.x2
  //     const dy = line.y1 - line.y2

  //     const angleRad = Math.atan2(dy, dx) // radians
  //     const angleDeg = angleRad * (180 / Math.PI) // degrees

  //     console.log(Math.tan(angleRad))

  //     console.log(angleDeg)

  //     anglesRad.push(angleRad)
  //   })

  //   const angleSum = anglesRad.reduce((acc, val) => acc + val, 0)

  //   const gap = 5
  //   // Example: loop through all lines on the canvas
  //   canvas.getObjects('line').forEach((line) => {
  //     // Clone the line

  //     console.log(Math.atan(angleSum), Math.atan(angleSum))

  //     const dx = line.x1 - line.x2
  //     const dy = line.y1 - line.y2

  //     const angleRad = Math.atan2(dy, dx) + Math.PI / 2
  //     console.log(Math.acos(1))

  //     const redLine = new Line([line.x1 + gap * Math.cos(angleRad), line.y1 + gap * Math.sin(angleRad), line.x2 + gap * Math.cos(angleRad), line.y2 + gap * Math.sin(angleRad)], {
  //       stroke: 'red',
  //       strokeWidth: line.strokeWidth, // wider to create gap effect
  //       strokeLineCap: 'round',
  //       hasControls: false,
  //       hasBorders: false,
  //       lockRotation: true,
  //       lockScalingX: true,
  //       lockScalingY: true,
  //       lockMovementX: true,
  //       lockMovementY: true,
  //       selectable: false,
  //       objectCaching: true,
  //       statefullCache: true,
  //     })

  //     console.log(redLine)

  //     // Add red line *behind* the original
  //     canvas.add(redLine)
  //     canvas.sendObjectToBack(redLine)
  //   })

  //   // Render updated canvas
  //   canvas.renderAll()

  //   return () => {
  //     canvas.dispose()
  //   }
  // }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>js Canvas Test</h2>
      <canvas ref={canvasRef} width={600} height={600} style={{ border: '1px solid #ccc' }} />
    </div>
  )
}

export default CanvasTest
