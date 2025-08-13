// CanvasControllers.jsx
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from './topBar'
import ActionBar from './actionBar'
import BottomControls from './bottomControls'
import { useUIVisibility } from '@/providers/canvas_providers/UICanvasContext'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import ResizingTopBar from '../resizing/resizingTopBar'
import ResizingActionBar from '../resizing/resizingActionBar'
import MovingActionBar from '../moving/movingActionBar'
import MovingTopBar from '../moving/movingTopBar'
import RemovingActionBar from '../removing/removingActionBar'
import RemovingTopBar from '../removing/removingTopBar'
import RuleringActionBar from '../rulering/ruleringActionBar'
import RuleringTopBar from '../rulering/ruleringTopBar'
import TapperingTopBar from '../tappering/tapperingTopBar'
import TapperingActionBar from '../tappering/tapperingActionBar'

import CrushFoldingTopBar from '../crushFolding/crushFoldingTopBar'
import CrushFoldingActionBar from '../crushFolding/crushFoldingActionBar'
import ResizingDrawer from '../resizing/resizingDrawer'
import { useResizingContext } from '@/providers/canvas_providers/resizingProvider'
import { useTapperingContext } from '@/providers/canvas_providers/tapperingProvider'
import TapperingDrawer from '../tappering/tapperingDrawer'
import { upsertPartialFlashing } from '@/lib/db/helpers/flashingHelpers'
import { notFound, redirect, useParams, useRouter } from 'next/navigation'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/lib/db/appDB'
import useLoading from '@/hooks/canvas/useLoading'
import { useEffect } from 'react'
import { useHistory } from '@/hooks/canvas/useHistory'
import useObjectUtils from '@/hooks/canvas/useObjectUtils'

import { Circle, Line } from 'fabric'
import { removeAnnotations } from '@/utilities/canvas/annotationUtils'
import { createCrushFoldObject } from '@/utilities/canvas/crushFoldUtils'

function generateUUIDs(count) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const length = 6
  const uuids = new Set()

  while (uuids.size < count) {
    let uuid = ''
    for (let i = 0; i < length; i++) {
      uuid += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    uuids.add(uuid)
  }

  return Array.from(uuids)
}

function getDistance(nodeA, nodeB) {
  const dx = nodeB?.left - nodeA?.left
  const dy = nodeB?.top - nodeA?.top
  return Math.round(Math.sqrt(dx * dx + dy * dy))
}

const CanvasControllers = ({ handleUndo, handleRedo }) => {
  const { flashingId } = useParams()

  const savedFlashing = useLiveQuery(
    () => db.flashings.get({ id: flashingId }),
    [flashingId],
    null, // initial value
  )

  const router = useRouter()

  const {
    canvasInstance,
    setIsRulering,
    setIsResizing,
    setIsMoving,
    setIsRemoving,
    setIsDrawing,
    setIsTappering,
    setIsCrushFolding,
    crushFoldObjectDirectionRef,
    startCrushFoldObjectRef,
    endCrushFoldObjectRef,
    objectsZoomScale,
    setCanvasIsEmpty,
    canvasIsEmpty,
    activeCircle,
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

  console.log(savedFlashing)

  useEffect(() => {
    if (savedFlashing && !(savedFlashing.color || savedFlashing.thickness)) {
      notFound()
    } else if (savedFlashing === undefined) {
      notFound()
    }
  }, [savedFlashing])

  useEffect(() => {
    const canvas = canvasInstance.current
    if (!canvas) {
      // console.error('canvas not loaded')
      return
    }

    if (canvas && savedFlashing) {
      crushFoldObjectDirectionRef.current = savedFlashing.crushFoldDir

      savedFlashing.nodes.map((cir) => {
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

      if (savedFlashing.startCrushFold) {
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

      if (savedFlashing.endCrushFold) {
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
  }, [canvasInstance.current, savedFlashing])

  const {
    topBarVisible,
    actionBarVisible,
    bottomControlsVisible,
    resizingTopBarVisible,
    resizingActionBarVisible,
    movingTopBarVisible,
    movingActionBarVisible,
    removingTopBarVisible,
    removingActionBarVisible,
    ruleringActionBarVisible,
    ruleringTopBarVisible,
    tapperingTopBarVisible,
    tapperingActionBarVisible,
    crushFoldingTopBarVisible,
    crushFoldingActionBarVisible,
  } = useUIVisibility()

  const { isResizingDrawerOpen } = useResizingContext()
  const { isTaperingDrawerOpen } = useTapperingContext()

  const resetAll = () => {
    setIsDrawing(false)
    setIsRulering(false)
    setIsResizing(false)
    setIsMoving(false)
    setIsRemoving(false)
    setIsTappering(false)
    setIsCrushFolding(false)
  }

  const exportCanvasToJSON = () => {
    const canvas = canvasInstance.current
    const flashing = {
      nodes: [],
      startCrushFold: false,
      endCrushFold: false,
      crushFoldDir: crushFoldObjectDirectionRef.current,
    }

    resetAll()

    const circles = canvas.getObjects().filter((obj) => obj.type === 'circle' && !obj.mainCircle)

    const startCircle = circles.find((cir) => !cir.line1)

    const uuids = generateUUIDs(circles.length)
    let node = startCircle
    let index = 0

    // {
    //   node_id: 'circle456',
    //   next_node_id: 'circle789',
    //   prev_node_id: 'circle123',
    //   next_line_bside_length: 180,
    //   left: 300,
    //   top: 250,
    // },

    while (node) {
      const nodeObject = {
        node_id: uuids[index],
        left: 0,
        top: 0,
      }

      nodeObject.top = node.top
      nodeObject.left = node.left

      if (node.line1) {
        nodeObject.prev_node_id = uuids[index - 1]
      }

      if (node.line2) {
        nodeObject.next_node_id = uuids[index + 1]
      }

      if (
        node.line2?.bSideLineLength &&
        getDistance(node, node.line2?.circle2) !== Math.round(node.line2?.bSideLineLength)
      ) {
        nodeObject.next_line_bside_length = node.line2.bSideLineLength
      }

      if (!node.line1 && node.crushFoldObject) {
        flashing.startCrushFold = true
      }

      if (!node.line2 && node.crushFoldObject) {
        flashing.endCrushFold = true
      }

      flashing.nodes.push(nodeObject)

      node = node.line2?.circle2

      index += 1
    }

    console.log(savedFlashing)

    if (
      (!canvasIsEmpty && flashing.startCrushFold) ||
      flashing.endCrushFold ||
      savedFlashing.thickness
    ) {
      upsertPartialFlashing(flashingId, {
        nodes: flashing.nodes,
        crushFoldDir: flashing.crushFoldDir,
        startCrushFold: flashing.startCrushFold,
        endCrushFold: flashing.endCrushFold,
        isDraft: false,
      })

      router.push(`/f/${flashingId}/preview`)
    } else if (!canvasIsEmpty && savedFlashing.color) {
      upsertPartialFlashing(flashingId, {
        nodes: flashing.nodes,
        crushFoldDir: flashing.crushFoldDir,
        startCrushFold: flashing.startCrushFold,
        endCrushFold: flashing.endCrushFold,
      })

      window.location.assign(`/f/${flashingId}/color-side`)
    } else {
      throw 'An error accured'
    }

    console.log(flashing.nodes)
  }

  return (
    <>
      <AnimatePresence>
        {actionBarVisible && (
          <ActionBar onUndo={handleUndo} onRedo={handleRedo} onHelp={() => {}} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {topBarVisible && (
          <TopBar
            onClose={() => {}}
            canvasIsEmpty={canvasIsEmpty}
            onNext={() => !canvasIsEmpty && exportCanvasToJSON()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{resizingTopBarVisible && <ResizingTopBar />}</AnimatePresence>
      <AnimatePresence>{resizingActionBarVisible && <ResizingActionBar />}</AnimatePresence>

      <AnimatePresence>{movingTopBarVisible && <MovingActionBar />}</AnimatePresence>
      <AnimatePresence>{movingActionBarVisible && <MovingTopBar />}</AnimatePresence>

      <AnimatePresence>{removingTopBarVisible && <RemovingActionBar />}</AnimatePresence>
      <AnimatePresence>{removingActionBarVisible && <RemovingTopBar />}</AnimatePresence>

      <AnimatePresence>{ruleringTopBarVisible && <RuleringActionBar />}</AnimatePresence>
      <AnimatePresence>{ruleringActionBarVisible && <RuleringTopBar />}</AnimatePresence>

      <AnimatePresence>{tapperingTopBarVisible && <TapperingTopBar />}</AnimatePresence>
      <AnimatePresence>{tapperingActionBarVisible && <TapperingActionBar />}</AnimatePresence>

      <AnimatePresence>{crushFoldingTopBarVisible && <CrushFoldingTopBar />}</AnimatePresence>
      <AnimatePresence>{crushFoldingActionBarVisible && <CrushFoldingActionBar />}</AnimatePresence>

      <AnimatePresence>{bottomControlsVisible && <BottomControls />}</AnimatePresence>

      <AnimatePresence>{isResizingDrawerOpen && <ResizingDrawer />}</AnimatePresence>
      <AnimatePresence>{isTaperingDrawerOpen && <TapperingDrawer />}</AnimatePresence>
    </>
  )
}

export default CanvasControllers
