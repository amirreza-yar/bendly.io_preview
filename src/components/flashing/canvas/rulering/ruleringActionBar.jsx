// ActionBar.jsx
import React from 'react'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { IconButtonGroup } from '@/components/uikit/buttons/iconButtonGroup'
import { CircleQuestion, UTurnLeftUp, UTurnRightUp } from '@/components/uikit/icons'
import { motion } from 'framer-motion'

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

const RuleringActionBar = ({ onHelp }) => (
  <motion.div
    variants={slideFromTop}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="fixed top-16 inset-x-0 max-w-100 mx-auto px-4 z-50"
  >
    <div className="flex items-center gap-2 bg-[#D9E2FF] rounded-md px-3 py-[10.5px]">
      <h3 className="grow font-roboto text-xs/[22.5px] text-primary-dark">
        <span className="font-bold">Ruler.</span> Select two points to find the length between them.
      </h3>
      <IconButton black size="medium" onClick={onHelp}>
        <CircleQuestion />
      </IconButton>
    </div>
  </motion.div>
)

export default RuleringActionBar
