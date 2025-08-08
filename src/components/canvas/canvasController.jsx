// CanvasControllers.jsx
import { AnimatePresence, motion } from 'framer-motion'
import TopBar from './topBar'
import ActionBar from './actionBar'
import BottomControls from './bottomControls'
import { useUIVisibility } from '@/providers/UICanvasContext'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import ResizingTopBar from './resizing/resizingTopBar'
import ResizingActionBar from './resizing/resizingActionBar'
import MovingActionBar from './moving/movingActionBar'
import MovingTopBar from './moving/movingTopBar'
import RemovingActionBar from './removing/removingActionBar'
import RemovingTopBar from './removing/removingTopBar'
import RuleringActionBar from './rulering/ruleringActionBar'
import RuleringTopBar from './rulering/ruleringTopBar'
import TapperingTopBar from './tappering/tapperingTopBar'
import TapperingActionBar from './tappering/tapperingActionBar'

import CrushFoldingTopBar from './crushFolding/crushFoldingTopBar'
import CrushFoldingActionBar from './crushFolding/crushFoldingActionBar'
import ResizingDrawer from './resizing/resizingDrawer'
import { useResizingContext } from '@/providers/hooks_provider/resizingProvider'
import { useTapperingContext } from '@/providers/hooks_provider/tapperingProvider'
import TapperingDrawer from './tappering/tapperingDrawer'

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
  } = useCanvasContext()

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

    console.log(flashing)
  }

  return (
    <>
      <AnimatePresence>
        {actionBarVisible && (
          <ActionBar onUndo={handleUndo} onRedo={handleRedo} onHelp={() => {}} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {topBarVisible && <TopBar onClose={() => {}} onNext={exportCanvasToJSON} />}
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
