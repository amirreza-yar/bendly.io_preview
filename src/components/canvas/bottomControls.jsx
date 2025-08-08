// BottomControls.jsx
import React, { useState } from 'react'
import {
  BreakLine,
  BreakLineBold,
  Crosshair,
  CrushFoldBold,
  CrushFold,
  TransferHorizontaly,
} from '@/components/uikit/icons'
import NavBar from './navbar'
import UnitSwitcher from './unitSwitcher'
import useObjectUtils from '@/hooks/canvas/useObjectUtils'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { motion } from 'framer-motion'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import { useBreakLineContext } from '@/providers/hooks_provider/breakLineProvider'
import { useCrushFoldContext } from '@/providers/hooks_provider/crushFoldProvider'

export const slideFromBottom = {
  hidden: {
    y: '100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.25 },
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { type: 'tween', duration: 0.25 },
  },
  exit: { y: '100%', opacity: 0, transition: { type: 'tween', duration: 0.2 } },
}

const BottomControls = () => {
  const [unit, setUnit] = useState('mm')
  const { centerDrawingGroup } = useObjectUtils()
  const {
    isBreakLining,
    setIsBreakLining,
    isCrushFolding,
    crushFoldDirection,
    showBreakLineIcon,
    setShowBreakLineIcon,
    objectsZoomScale,
  } = useCanvasContext()

  const { toggleBreakLine } = useBreakLineContext()
  const { changeCrushFoldDirection } = useCrushFoldContext()

  return (
    <motion.div variants={slideFromBottom} className='w-full' initial="hidden" animate="visible" exit="exit">
      {showBreakLineIcon && (
        <motion.div
          className="fixed bottom-20 z-50"
          variants={slideFromBottom}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="flex justify-between">
            <IconButton
              black
              size="large"
              className={`${isBreakLining ? 'text-primary' : 'text-neutral-dark'}`}
              onClick={() => {
                toggleBreakLine()
              }}
            >
              {isBreakLining ? <BreakLineBold /> : <BreakLine />}
            </IconButton>
          </div>
        </motion.div>
      )}

      <div className="fixed bottom-34 left-4 z-40">
        {isCrushFolding && (
          <motion.div variants={slideFromBottom} initial="hidden" animate="visible" exit="exit">
            <div className="flex justify-between">
              <IconButton
                black
                size="large"
                className="text-neutral-dark"
                onClick={() => {
                  changeCrushFoldDirection()
                }}
              >
                <TransferHorizontaly />
              </IconButton>
            </div>
          </motion.div>
        )}
      </div>

      <div className="fixed bottom-24 left-4 z-40">
        <UnitSwitcher className="self-end" unit={unit} onChange={setUnit} />
      </div>

      <div className="fixed bottom-24 right-4 z-40">
        <IconButton
          black
          size="large"
          onClick={() => {
            centerDrawingGroup(50, 150, 130)
            console.log('Crosshair clicked')
          }}
        >
          <Crosshair />
        </IconButton>
      </div>

      <div className="fixed bottom-0 inset-x-0 -sm mx-auto px-4 z-50">
        <NavBar />
      </div>
    </motion.div>
  )
}

export default BottomControls
