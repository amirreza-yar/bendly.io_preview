// components/resizingDrawer.jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@/components/uikit/adjustDrawer'
import { LabeledInput } from '@/components/uikit/input'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { XIcon, Check } from '@/components/uikit/icons'
import { useTapperingContext } from '@/providers/hooks_provider/tapperingProvider'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import CancelModal from '../cancelModal'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import useObjectUtils from '@/hooks/canvas/useObjectUtils'

const slideFromBottom = {
  hidden: {
    y: '100%',
    opacity: 1,
    transition: { type: 'tween', duration: 0.25 },
  },
  visible: {
    y: '0%',
    opacity: 1,
    transition: { type: 'tween', duration: 0.25 },
  },
  exit: {
    y: '100%',
    opacity: 1,
    transition: { type: 'tween', duration: 0.2 },
  },
}

export default function TapperingDrawer() {
  const {
    objValue,
    setObjValue,
    objOriginalValue,
    objName,
    isTaperingDrawerOpen,
    setIsTaperingDrawerOpen,
    triggerRef,
    inputRef,
    resetChanges,
  } = useTapperingContext()
  const { setIsTappering , objectsZoomScale,} = useCanvasContext()

  const [localValue, setLocalValue] = useState(objOriginalValue)
  const [hasPendingChange, setHasPendingChange] = useState(false)

  // Sync local when drawer opens
  useEffect(() => {
    if (isTaperingDrawerOpen) {
      setLocalValue(objValue || objOriginalValue)
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [isTaperingDrawerOpen, objValue, objOriginalValue])

  // Propagate changes
  useEffect(() => {
    if (isNaN(localValue)) {
      setObjValue(objOriginalValue)
    } else {
      setObjValue(localValue)
    }
  }, [localValue])

  const handleClose = () => {
    setIsTaperingDrawerOpen(false)
    setIsTappering(false)
    setHasPendingChange(false)
  }

  const applyChange = () => {
    setHasPendingChange(false)
  }

  const discardChanges = () => {
    // setLocalValue(objOriginalValue);
    // setObjValue(objOriginalValue);

    resetChanges()
  }

  return (
    <Drawer>
      <DrawerTrigger id="taper-drawer" ref={triggerRef} className="hidden" />
      <DrawerContent className="px-4 py-3">
        <DrawerTitle className="pb-1">
          {/* Input's label implemented here */}
          <p className="text-xs/[16.5px] font-medium text-neutral-dark">Length</p>
        </DrawerTitle>
        <div className="inline-flex justify-center gap-4">
          {/* Couldn't use the default label */}
          <LabeledInput
            type="number"
            badge={'mm'}
            placeholder={Math.round(localValue * 100) / 100}
            className="grow pr-2"
            ref={inputRef}
            // onInputBlur={() => this.focus()}
            // value={Math.round(localValue * 100) / 100}
            onChange={(e) => {
              // console.log("onChange drawer: " + e.target.value);
              setHasPendingChange(true)
              const v = parseFloat(e.target.value)
              if (!isNaN(v)) setLocalValue(v)
            }}
          />

          {/* Cancel button here */}
          {hasPendingChange ? (
            <CancelModal
              onApply={() => {
                applyChange()
                handleClose()
                toast('The changes where applied')
              }}
              onDiscard={() => {
                resetChanges()
                handleClose()
                toast('The changes where discarded')
              }}
            >
              <IconButton variant="secondary" >
                <XIcon />
              </IconButton>
            </CancelModal>
          ) : (
            <IconButton
              variant="secondary"
              onClick={() => {
                handleClose()
                toast('Nothing was changed')
              }}
            >
              <XIcon />
            </IconButton>
          )}

          {/* Submition button here */}
          <IconButton
            onClick={() => {
              applyChange()
              handleClose()
              toast('The changes where applied')
            }}
          >
            <Check />
          </IconButton>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
