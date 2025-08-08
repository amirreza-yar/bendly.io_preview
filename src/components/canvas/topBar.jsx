// TopBar.jsx
'use client'
import React from 'react'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { XIcon } from '@/components/uikit/icons'
import { ArrowRight } from '@/components/uikit/icons'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/router'

export const slideFromTop = {
  hidden: { y: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.25 } },
  visible: { y: '0%', opacity: 1, transition: { type: 'tween', duration: 0.25 } },
  exit: { y: '-100%', opacity: 0, transition: { type: 'tween', duration: 0.2 } },
}

// const router = useRouter()

const TopBar = ({ onClose, onNext }) => {
  return (
    <motion.div
      variants={slideFromTop}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed top-0 right-0 left-0 border-b-[1px] border-neutral-midlight z-50"
    >
      <div className="flex justify-between items-center bg-white h-[56px] px-0.5">
        <Link href="/dashboard">
          <IconButton
            variant="ghost"
            black
            className="hover:bg-white"
            // onClick={() => router.push('dashboard')}
          >
            <XIcon />
          </IconButton>
        </Link>

        <h6 className="text-smd font-semibold">Canvas</h6>

        <IconButton onClick={onNext} variant="ghost" black className="hover:bg-white">
          <ArrowRight />
        </IconButton>
      </div>
    </motion.div>
  )
}

export default TopBar
