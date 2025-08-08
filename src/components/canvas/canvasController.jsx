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

  const { canvasInstance } = useCanvasContext()

  const exportCanvasToJSON = () => {
    const canvas = canvasInstance.current

    const objs = canvas
      .getObjects()
      .filter((obj) => obj.type === 'circle' || (obj.type === 'line' && obj.hitboxLine))

    console.log(JSON.stringify(objs))

    console.log(objs[0].hitboxLine)
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
