// components/resizingDrawer.jsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle } from '@/components/uikit/adjustDrawer'
import { LabeledInput } from '@/components/uikit/input'
import { IconButton } from '@/components/uikit/buttons/iconButton'
import { XIcon, Check } from '@/components/uikit/icons'
import { useResizingContext } from '@/providers/canvas_providers/resizingProvider'
import { useCanvasContext } from '@/providers/canvas_providers/canvasContextProvider'
import CancelModal from '../canvasUI/cancelModal'
import { toast } from 'sonner'

export default function ResizingDrawer() {
  const {
    objValue,
    setObjValue,
    objOriginalValue,
    isResizingDrawerOpen,
    setIsResizingDrawerOpen,
    hasPendingChange,
    setHasPendingChange,
    applyChange,
    resetChanges,
    triggerRef,
    inputRef,
    closeButtonRef,
    checkButtonRef,
    focusInput,
    isCircleSelected,
  } = useResizingContext()
  const { setIsResizing, setIsDrawing , objectsZoomScale,} = useCanvasContext()

  const [localValue, setLocalValue] = useState(objOriginalValue)

  // Sync local when drawer opens
  useEffect(() => {
    if (isResizingDrawerOpen) {
      setLocalValue(objValue || objOriginalValue)
      setTimeout(() => {
        focusInput()
        inputRef.current?.addEventListener('blur', focusInput)
      }, 0)
    }
  }, [objValue, objOriginalValue])

  // // Propagate
  useEffect(() => {
    if (isNaN(localValue)) {
      setObjValue(objOriginalValue)
    } else {
      setObjValue(localValue)
    }
  }, [localValue])

  const handleClose = () => {
    setIsResizingDrawerOpen(false)
    setIsResizing(false)

    triggerRef.current?.click()
  }

  return (
    <Drawer>
      <DrawerTrigger id="change-line-drawer" ref={triggerRef} className="hidden" />
      <DrawerContent className="px-4 py-3">
        <DrawerTitle className="pb-1">
          {/* Input's label implemented here */}
          <p className="text-xs/[16.5px] font-medium text-neutral-dark">Length</p>
        </DrawerTitle>
        <div className="inline-flex justify-center gap-4">
          {/* Couldn't use the default label */}
          <LabeledInput
            type="number"
            badge={isCircleSelected ? 'Degree°' : 'mm'}
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
              <IconButton variant="secondary" ref={closeButtonRef}>
                <XIcon />
              </IconButton>
            </CancelModal>
          ) : (
            <IconButton
              variant="secondary"
              ref={closeButtonRef}
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
            ref={checkButtonRef}
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
