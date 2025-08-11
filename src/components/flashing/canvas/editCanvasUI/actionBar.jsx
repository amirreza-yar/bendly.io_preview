// ActionBar.jsx
'use client'
import React from 'react'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { IconButtonGroup } from '@/components/uikit/buttons/iconButtonGroup'
import { CircleQuestion, UTurnLeftUp, UTurnRightUp } from '@/components/uikit/icons'
import { motion } from 'framer-motion'
import { useHistory } from '@/hooks/canvas/useHistory'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'

export const slideFromTop = {
  hidden: {
    y: '-100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.25 },
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { type: 'tween', duration: 0.25 },
  },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.2 },
  },
}

const ActionBar = ({ onUndo, onRedo, onHelp, undoDisabled, redoDisabled }) => {
  const { undo, redo } = useHistory()
  const { canUndo, canRedo, objectsZoomScale } = useCanvasContext()
  return (
    <motion.div
      variants={slideFromTop}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className='fixed top-16 left-4 z-40'>
        <IconButtonGroup>
          <button onClick={() => undo()} disabled={!canUndo}>
            <UTurnLeftUp />
          </button>
          <button onClick={() => redo()} disabled={!canRedo}>
            <UTurnRightUp />
          </button>
        </IconButtonGroup>
      </div>
      <div className='fixed top-16 right-4 z-40'>
        <IconButton black size="medium" onClick={onHelp} className="absolute right-0">
          <CircleQuestion />
        </IconButton>
      </div>
    </motion.div>
  )
}

export default ActionBar
