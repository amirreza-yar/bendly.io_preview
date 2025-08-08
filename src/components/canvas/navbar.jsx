// NavBar.jsx
import React, { useRef, useState } from 'react'
import { useCanvasContext } from '@/providers/canvasContextProvider'
import { useUIVisibility } from '@/providers/UICanvasContext'
import NavButton from './navbarButton'
import NavDropdown from './navbarModifyDropDown'
import {
  Ruler,
  RulerBold,
  Modify,
  ModifyBold,
  Drawing,
  DrawingBold,
  Taper,
  TaperBold,
  CrushFold,
  CrushFoldBold,
  Earaser,
  EaraserBold,
  Move,
  MoveBold,
  Resize,
  ResizeBold,
} from '@/components/uikit/icons'
import { toast } from 'sonner'
import CancelModal from './cancelModal'
import { useCancelChangesModalContext } from '@/providers/hooks_provider/cancelChangesModalProvider'
import { useMovingContext } from '@/providers/hooks_provider/movingProvider'
import { useResizingContext } from '@/providers/hooks_provider/resizingProvider'
import { useCrushFoldContext } from '@/providers/hooks_provider/crushFoldProvider'

const NavBar = () => {
  const {
    canvasIsEmpty,
    isRulering,
    setIsRulering,
    isResizing,
    setIsResizing,
    isMoving,
    setIsMoving,
    isRemoving,
    setIsRemoving,
    isDrawing,
    setIsDrawing,
    isTappering,
    setIsTappering,
    isCrushFolding,
    setIsCrushFolding,
    isCanvasChanged,
    objectsZoomScale,
  } = useCanvasContext()

  const [hasPendingModal, setHasPendingModal] = useState(false)
  const pendingWork = useRef(() => {})

  const { onModalApply, onModalDiscard } = useCancelChangesModalContext()
  const { applyChanges, resetChanges } = useMovingContext()

  const crushFoldApplyChanges = useCrushFoldContext().applyChanges
  const crushFoldResetChanges = useCrushFoldContext().resetChanges

  const resetAll = () => {
    setIsRulering(false)
    setIsResizing(false)
    setIsMoving(false)
    setIsRemoving(false)
    setIsDrawing(false)
    setIsTappering(false)
    setIsCrushFolding(false)
  }

  const handleTool = (tool) => {
    console.log('handle tool triggered')
    const switchTool = () => {
      console.log('the tool is: ', tool)
      resetAll()
      switch (tool) {
        case 'drawing':
          setIsDrawing(!isDrawing)
          break
        case 'resize':
          setIsResizing(!isResizing)
          break
        case 'taper':
          setIsTappering(!isTappering)
          break
        case 'crushfold':
          setIsCrushFolding(!isCrushFolding)
          break
        default:
          setIsDrawing(true)
          break
      }
      console.log(`The ${tool} button has been clicked`)
    }

    if (isCanvasChanged) {
      console.log('handle tool triggered / canvas has changed')
      setHasPendingModal(true)
      pendingWork.current = () => {
        if (isMoving) applyChanges()
        if (isCrushFolding) crushFoldApplyChanges()
        switchTool()
      }
      onModalApply.current = () => {
        pendingWork.current?.()
        setHasPendingModal(false)
        toast('Changes where applied')
      }
      onModalDiscard.current = () => {
        if (isMoving) resetChanges()
        if (isCrushFolding) crushFoldResetChanges()
        switchTool()
        setHasPendingModal(false)
        toast('Nothing was changed')
      }
    } else {
      switchTool()
    }
  }

  const handleModifyItem = (action) => {
    const switchModify = () => {
      resetAll()
      switch (action) {
        case 'remove':
          setIsRemoving(!isRemoving)
          break
        case 'move':
          setIsMoving(!isMoving)
          break
        case 'ruler':
          setIsRulering(!isRulering)
          break
        default:
          break
      }
      console.log(`${action} clicked`)
    }

    if (isCanvasChanged) {
      setHasPendingModal(true)
      pendingWork.current = () => {
        if (isMoving) applyChanges()
        if (isCrushFolding) crushFoldApplyChanges()
        switchModify()
      }
      onModalApply.current = () => {
        pendingWork.current?.()
        setHasPendingModal(false)
        toast('Changes where applied')
      }
      onModalDiscard.current = () => {
        if (isMoving) resetChanges()
        if (isCrushFolding) crushFoldResetChanges()
        switchModify()
        setHasPendingModal(false)
        toast('Nothing was changed')
      }
    } else {
      switchModify()
    }
  }

  const modifyActive = isRulering || isMoving || isRemoving

  const modifyItems = [
    {
      icon: Earaser,
      iconActive: EaraserBold,
      label: 'Remove',
      active: isRemoving,
      onClick: () => handleModifyItem('remove'),
    },
    {
      icon: Move,
      iconActive: MoveBold,
      label: 'Move',
      active: isMoving,
      onClick: () => handleModifyItem('move'),
    },
    {
      icon: Ruler,
      iconActive: RulerBold,
      label: 'Ruler',
      active: isRulering,
      onClick: () => handleModifyItem('ruler'),
    },
  ]

  return (
    <>
      {isCanvasChanged ? (
        <CancelModal
          onApply={onModalApply.current}
          onDiscard={onModalDiscard.current}
          onOpenChange={(e) => {
            setHasPendingModal(e)
            console.log('navbar clicked when canvas is changed, ', e)
          }}
        >
          <div
            className="flex justify-between items-center max-w-[384px] bg-white rounded-xl px-3 mx-auto mb-4 py-0 h-16"
            style={{
              boxShadow: '0px 2px 16px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)',
            }}
          >
            <NavButton
              icon={Resize}
              iconActive={ResizeBold}
              label="Resize"
              active={isResizing}
              disabled={canvasIsEmpty}
              onClick={() => handleTool('resize')}
            />
            <NavDropdown
              icon={Modify}
              iconActive={ModifyBold}
              label="Modify"
              active={modifyActive}
              disabled={canvasIsEmpty}
              items={modifyItems}
              onClick={() => handleTool('')}
            />
            <NavButton
              icon={Drawing}
              iconActive={DrawingBold}
              label="Drawing"
              active={isDrawing}
              disabled={false}
              onClick={() => handleTool('drawing')}
            />
            <NavButton
              icon={Taper}
              iconActive={TaperBold}
              label="Taper"
              active={isTappering}
              disabled={canvasIsEmpty}
              onClick={() => handleTool('taper')}
            />
            <NavButton
              icon={CrushFold}
              iconActive={CrushFoldBold}
              label="CrushFold"
              active={isCrushFolding}
              disabled={canvasIsEmpty}
              onClick={() => handleTool('crushfold')}
            />
          </div>
        </CancelModal>
      ) : (
        <div
          className="flex justify-between items-center max-w-[350px] bg-white rounded-xl px-3 mx-auto mb-4 py-0 h-16 overflow-scroll no-scrollbar"
          style={{
            boxShadow: '0px 2px 16px -1px rgba(0,0,0,0.1), 0px 2px 4px -1px rgba(0,0,0,0.06)',
          }}
        >
          <NavButton
            icon={Resize}
            iconActive={ResizeBold}
            label="Resize"
            active={isResizing}
            disabled={canvasIsEmpty}
            onClick={() => handleTool('resize')}
          />
          <NavDropdown
            icon={Modify}
            iconActive={ModifyBold}
            label="Modify"
            active={modifyActive}
            disabled={canvasIsEmpty}
            items={modifyItems}
          />
          <NavButton
            icon={Drawing}
            iconActive={DrawingBold}
            label="Drawing"
            active={isDrawing}
            disabled={false}
            onClick={() => handleTool('drawing')}
          />
          <NavButton
            icon={Taper}
            iconActive={TaperBold}
            label="Taper"
            active={isTappering}
            disabled={canvasIsEmpty}
            onClick={() => handleTool('taper')}
          />
          <NavButton
            icon={CrushFold}
            iconActive={CrushFoldBold}
            label="CrushFold"
            active={isCrushFolding}
            disabled={canvasIsEmpty}
            onClick={() => handleTool('crushfold')}
          />
        </div>
      )}
    </>
  )
}

export default NavBar
