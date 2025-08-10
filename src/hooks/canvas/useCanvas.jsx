'use client'
import { useEffect } from 'react'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import useGrid from './useGrid'
import { Canvas, Circle, config, Line, util } from 'fabric'
import { useHistory } from './useHistory'
import useLoading from './useLoading'

export default function useCanvas() {
  const { canvasRef, canvasInstance, objectsZoomScale, setCanvasIsEmpty, activeCircle } =
    useCanvasContext()
  const { createGrid } = useGrid()

  const { addHistory } = useHistory()

  const createCanvas = () => {
    useEffect(() => {
      console.log('canvas drawing mounted')
      if (!canvasRef.current || canvasInstance.current) return

      const canvas = new Canvas(canvasRef.current, {
        backgroundColor: '#f5f5f5',
        selection: false,
        // _cacheDirty: true,
        // renderOnAddRemove: true,
      })

      canvas.setWidth(window.innerWidth)
      canvas.setHeight(window.innerHeight)

      canvas.set('centeredScaling', true)
      canvas.isChanged = false

      canvasInstance.current = canvas

      
      // canvas.targetFindTolerance = 10; // Increase for easier selection, decrease for more precision

      // canvas.setZoom(0.1);

      // raise the total pixel budget for each object’s cache to ~4 Mpx
      config.perfLimitSizeTotal = 400000 // = 4096 * 1024

      // allow a single cache side to grow as large as 8 192px
      // config.maxCacheSideLimit = 1000;

      // (optional) shrink the minimum cache size for tiny objects
      // config.minCacheSideLimit = 100;

      // canvas.on("object:scaling", () => {
      //   console.log("object scaled");
      // });

      createGrid()

      return () => {
        if (canvasInstance.current) {
          canvasInstance.current.dispose()
          canvasInstance.current = null
        }
      }
    }, [])
  }

  createCanvas()

  // return { createCanvas };
}
