'use client'
import { useEffect } from 'react'
import { useCanvasContext } from '@/providers/canvasContextProvider'
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

      // useLoading()

      // canvas.add(
      //   new Circle({
      //     saved_id: 'circle123',
      //     next_circle_id: 'circle456',
      //     left: 150,
      //     top: 250,
      //     originX: 'center',
      //     originY: 'center',
      //     radius: 4 / objectsZoomScale.current,
      //     fill: '#000',
      //     hasControls: false,
      //     hasBorders: false,
      //     lockRotation: true,
      //     lockScalingX: true,
      //     lockScalingY: true,
      //     lockMovementX: true,
      //     lockMovementY: true,
      //     padding: 12,
      //     // strokeWidth: 20, // Acts as a hitbox
      //     selectable: false,
      //     evented: true,

      //     // dirty: true,
      //     objectCaching: true,
      //     statefullCache: true,
      //     // active: true,
      //   }),
      // )
      // canvas.add(
      //   new Circle({
      //     saved_id: 'circle456',
      //     next_circle_id: 'circle789',
      //     left: 300,
      //     top: 250,
      //     originX: 'center',
      //     originY: 'center',
      //     radius: 4 / objectsZoomScale.current,
      //     fill: '#000',
      //     hasControls: false,
      //     hasBorders: false,
      //     lockRotation: true,
      //     lockScalingX: true,
      //     lockScalingY: true,
      //     lockMovementX: true,
      //     lockMovementY: true,
      //     padding: 12,
      //     // strokeWidth: 20, // Acts as a hitbox
      //     selectable: false,
      //     evented: true,

      //     // dirty: true,
      //     objectCaching: true,
      //     statefullCache: true,
      //     // active: true,
      //   }),
      // )

      // canvas.add(
      //   new Circle({
      //     saved_id: 'circle789',
      //     left: 300,
      //     top: 450,
      //     originX: 'center',
      //     originY: 'center',
      //     radius: 4 / objectsZoomScale.current,
      //     fill: '#000',
      //     hasControls: false,
      //     hasBorders: false,
      //     lockRotation: true,
      //     lockScalingX: true,
      //     lockScalingY: true,
      //     lockMovementX: true,
      //     lockMovementY: true,
      //     padding: 12,
      //     // strokeWidth: 20, // Acts as a hitbox
      //     selectable: false,
      //     evented: true,

      //     // dirty: true,
      //     objectCaching: true,
      //     statefullCache: true,
      //     // active: true,
      //   }),
      // )

      // const circles = canvas.getObjects().filter((obj) => obj.type === 'circle')

      // circles
      //   .filter((cir) => cir.next_circle_id)
      //   .map((cir) => {
      //     const currentCir = cir
      //     const nextCir = canvas
      //       .getObjects()
      //       .find((obj) => obj.saved_id === currentCir.next_circle_id)

      //     const line = new Line(
      //       [
      //         currentCir.getCenterPoint().x,
      //         currentCir.getCenterPoint().y,
      //         nextCir.getCenterPoint().x,
      //         nextCir.getCenterPoint().y,
      //       ],
      //       {
      //         stroke: '#000',
      //         strokeWidth: 2 / objectsZoomScale.current,
      //         strokeLineCap: 'round',
      //         hasControls: false,
      //         hasBorders: false,
      //         lockRotation: true,
      //         lockScalingX: true,
      //         lockScalingY: true,
      //         lockMovementX: true,
      //         lockMovementY: true,
      //         // padding: 50,
      //         selectable: false, // Prevent direct selection
      //         // evented: false, // Pass events to the group

      //         // dirty: true,
      //         objectCaching: true,
      //         statefullCache: true,
      //       },
      //     )

      //     const hitboxLine = new Line(
      //       [
      //         currentCir.getCenterPoint().x,
      //         currentCir.getCenterPoint().y,
      //         nextCir.getCenterPoint().x,
      //         nextCir.getCenterPoint().y,
      //       ],
      //       {
      //         strokeWidth: 20 / objectsZoomScale.current, // Hitbox size
      //         // stroke: "rgba(0,0,0,0)", // Fully transparent
      //         stroke: 'rgba(0, 0, 0, 0.0005)',
      //         strokeLineCap: 'round',
      //         hasControls: false,
      //         hasBorders: false,
      //         lockRotation: true,
      //         lockScalingX: true,
      //         lockScalingY: true,
      //         lockMovementX: true,
      //         lockMovementY: true,
      //         // padding: 50,
      //         selectable: false, // Prevent direct selection
      //         // evented: false, // Pass events to the group

      //         // dirty: true,
      //         objectCaching: true,
      //         statefullCache: true,

      //         // active: true,

      //         hoverCursor: 'pointer',
      //       },
      //     )

      //     line.bSideLineLength = 50

      //     // Flag this group
      //     line.hitboxLine = hitboxLine
      //     hitboxLine.originalLine = line
      //     hitboxLine.isHitboxLine = true

      //     hitboxLine.perPixelTargetFind = true
      //     line.perPixelTargetFind = true

      //     currentCir.line2 = line
      //     nextCir.line1 = line

      //     line.circle1 = currentCir
      //     line.circle2 = nextCir

      //     canvas.add(line)

      //     circles.forEach((cir) => {
      //       canvas.bringObjectToFront(cir)
      //     })

      //     setCanvasIsEmpty(false)

      //     addHistory('drawing', currentCir, true)

      //     console.log(nextCir.saved_id)
      //   })

      // activeCircle.current = circles.find((cir) => !cir.next_circle_id)

      // canvas.add(
      //   new Line([-75, 0, 75, 0], {
      //     circle1_id: 'circle123',
      //     circle2_id: 'circle456',
      //     saved_id: 'line123',
      //     originX: 'left',
      //     originY: 'top',
      //     stroke: '#000',
      //     strokeWidth: 2,
      //     stroke: '#000',
      //     strokeLineCap: 'round',
      //   }),
      // )
      // canvas.requestRenderAll()

      // canvas.getObjects().map((obj, _) => {
      //   if (obj.type === 'line') {
      //     obj.circle1 = canvas.getObjects().find((obj) => obj.circle1_id === obj.saved_id)
      //     obj.circle2 = canvas.getObjects().find((obj) => obj.circle2_id === obj.saved_id)

      //     console.log(obj.circle1?.type, obj.circle2?.type)
      //   } else if (obj.type === 'circle') {
      //     obj.line1 = canvas.getObjects().find((obj) => obj.line1_id === obj.saved_id)
      //     obj.line2 = canvas.getObjects().find((obj) => obj.line2_id === obj.saved_id)
      //     console.log(obj.line1?.type, obj.line2?.type)
      //   }
      // })

      createGrid()

      // util.enlivenObjects([
      //   {
      //     "type": "Line",
      //     "version": "6.6.5",
      //     "originX": "left",
      //     "originY": "top",
      //     "left": 140,
      //     "top": 340,
      //     "width": 50,
      //     "height": 100,
      //     "fill": "rgb(0,0,0)",
      //     "stroke": "rgba(0, 0, 0, 0.0005)",
      //     "strokeWidth": 20,
      //     "strokeDashArray": null,
      //     "strokeLineCap": "round",
      //     "strokeDashOffset": 0,
      //     "strokeLineJoin": "miter",
      //     "strokeUniform": false,
      //     "strokeMiterLimit": 4,
      //     "scaleX": 1,
      //     "scaleY": 1,
      //     "angle": 0,
      //     "flipX": false,
      //     "flipY": false,
      //     "opacity": 1,
      //     "shadow": null,
      //     "visible": true,
      //     "backgroundColor": "",
      //     "fillRule": "nonzero",
      //     "paintFirst": "fill",
      //     "globalCompositeOperation": "source-over",
      //     "skewX": 0,
      //     "skewY": 0,
      //     "x1": 25,
      //     "x2": -25,
      //     "y1": -50,
      //     "y2": 50
      //   },
      //   {
      //     "type": "Line",
      //     "version": "6.6.5",
      //     "originX": "left",
      //     "originY": "top",
      //     "left": 149,
      //     "top": 349,
      //     "width": 50,
      //     "height": 100,
      //     "fill": "rgb(0,0,0)",
      //     "stroke": "#000",
      //     "strokeWidth": 2,
      //     "strokeDashArray": null,
      //     "strokeLineCap": "round",
      //     "strokeDashOffset": 0,
      //     "strokeLineJoin": "miter",
      //     "strokeUniform": false,
      //     "strokeMiterLimit": 4,
      //     "scaleX": 1,
      //     "scaleY": 1,
      //     "angle": 0,
      //     "flipX": false,
      //     "flipY": false,
      //     "opacity": 1,
      //     "shadow": null,
      //     "visible": true,
      //     "backgroundColor": "",
      //     "fillRule": "nonzero",
      //     "paintFirst": "fill",
      //     "globalCompositeOperation": "source-over",
      //     "skewX": 0,
      //     "skewY": 0,
      //     "x1": 25,
      //     "x2": -25,
      //     "y1": -50,
      //     "y2": 50
      //   },
      //   {
      //     "radius": 4,
      //     "startAngle": 0,
      //     "endAngle": 360,
      //     "counterClockwise": false,
      //     "type": "Circle",
      //     "version": "6.6.5",
      //     "originX": "center",
      //     "originY": "center",
      //     "left": 200,
      //     "top": 350,
      //     "width": 8,
      //     "height": 8,
      //     "fill": "#000",
      //     "stroke": null,
      //     "strokeWidth": 1,
      //     "strokeDashArray": null,
      //     "strokeLineCap": "butt",
      //     "strokeDashOffset": 0,
      //     "strokeLineJoin": "miter",
      //     "strokeUniform": false,
      //     "strokeMiterLimit": 4,
      //     "scaleX": 1,
      //     "scaleY": 1,
      //     "angle": 0,
      //     "flipX": false,
      //     "flipY": false,
      //     "opacity": 1,
      //     "shadow": null,
      //     "visible": true,
      //     "backgroundColor": "",
      //     "fillRule": "nonzero",
      //     "paintFirst": "fill",
      //     "globalCompositeOperation": "source-over",
      //     "skewX": 0,
      //     "skewY": 0
      //   },
      //   {
      //     "radius": 4,
      //     "startAngle": 0,
      //     "endAngle": 360,
      //     "counterClockwise": false,
      //     "type": "Circle",
      //     "version": "6.6.5",
      //     "originX": "center",
      //     "originY": "center",
      //     "left": 150,
      //     "top": 450,
      //     "width": 8,
      //     "height": 8,
      //     "fill": "#000",
      //     "stroke": null,
      //     "strokeWidth": 1,
      //     "strokeDashArray": null,
      //     "strokeLineCap": "butt",
      //     "strokeDashOffset": 0,
      //     "strokeLineJoin": "miter",
      //     "strokeUniform": false,
      //     "strokeMiterLimit": 4,
      //     "scaleX": 1,
      //     "scaleY": 1,
      //     "angle": 0,
      //     "flipX": false,
      //     "flipY": false,
      //     "opacity": 1,
      //     "shadow": null,
      //     "visible": true,
      //     "backgroundColor": "",
      //     "fillRule": "nonzero",
      //     "paintFirst": "fill",
      //     "globalCompositeOperation": "source-over",
      //     "skewX": 0,
      //     "skewY": 0
      //   }
      // ]
      // , (enlivenedObjects) => {
      //   enlivenedObjects.forEach((obj) => {
      //     canvas.add(obj)
      //   })
      //   canvas.renderAll()
      // })

      // canvas.requestRenderAll()

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

      return () => {
        canvas.dispose()
      }
    }, [])
  }

  createCanvas()

  // return { createCanvas };
}
