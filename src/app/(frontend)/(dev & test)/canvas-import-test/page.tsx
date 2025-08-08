'use client'
import React, { useEffect, useRef } from 'react'
import { Canvas, util, Object, Line, Circle } from 'fabric'

const jsonObjects: Object[] | any[] = [
  {
    type: 'Line',
    version: '6.6.5',
    originX: 'left',
    originY: 'top',
    left: 149,
    top: 349,
    width: 50,
    height: 100,
    fill: 'rgb(0,0,0)',
    stroke: '#000',
    strokeWidth: 2,
    strokeLineCap: 'round',
    strokeLineJoin: 'miter',
    strokeMiterLimit: 4,
    x1: 25,
    x2: -25,
    y1: -50,
    y2: 50,
  },
  {
    type: 'Circle',
    version: '6.6.5',
    originX: 'center',
    originY: 'center',
    left: 200,
    top: 350,
    radius: 4,
    fill: '#000',
  },
  {
    type: 'Circle',
    version: '6.6.5',
    originX: 'center',
    originY: 'center',
    left: 150,
    top: 450,
    radius: 4,
    fill: '#000',
  },
]

const CanvasTest: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = new Canvas(canvasRef.current, {
      backgroundColor: '#f9f9f9',
      selection: false,
    })

    const cir = new Circle({
      type: 'Circle',
      version: '6.6.5',
      originX: 'center',
      originY: 'center',
      left: 150,
      top: 450,
      radius: 4,
      fill: '#000',
    })

    canvas.add(cir)

    // util.enlivenObjects(jsonObjects, (objects: Object[]) => {
    //   objects.forEach((obj) => canvas.add(obj))
    //   canvas.renderAll()
    // })

    return () => {
      canvas.dispose()
    }
  }, [])

  return (
    <div style={{ padding: 20 }}>
      <h2>js Canvas Test</h2>
      <canvas ref={canvasRef} width={600} height={600} style={{ border: '1px solid #ccc' }} />
    </div>
  )
}

export default CanvasTest
