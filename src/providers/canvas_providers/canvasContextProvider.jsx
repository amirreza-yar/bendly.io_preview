'use client'
import { createContext, useContext, useRef, useState } from 'react'
// import { saveCanvasState, getCanvasState } from "@/lib/(dev)/db";

const CanvasContext = createContext(null)

export const CanvasProvider = ({ children }) => {
  const canvasRef = useRef(null)
  const canvasInstance = useRef(null)
  const gridGroupRef = useRef(null)
  const lastDotRef = useRef(null)
  const [canvasIsEmpty, setCanvasIsEmpty] = useState(true)
  const [objectIdCount, setObjectIdCount] = useState(1)
  const [drawingsGrouped, setDrawingsGrouped] = useState(false)
  const [isPanning, setIsPanning] = useState(true)
  const [isPinchZooming, setIsPinchZooming] = useState(true)
  const [isTransforming, setIsTransforming] = useState(false)

  const [isResizing, setIsResizing] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [isMoving, setIsMoving] = useState(false)
  const [isRulering, setIsRulering] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isTappering, setIsTappering] = useState(false)
  const [isCrushFolding, setIsCrushFolding] = useState(false)

  const [crushFoldDirection, setCrushFoldDirection] = useState(false)
  const startCrushFoldObjectRef = useRef(null)
  const endCrushFoldObjectRef = useRef(null)

  const [isBreakLining, setIsBreakLining] = useState(false)

  const [showBreakLineIcon, setShowBreakLineIcon] = useState(false)

  const [isCanvasChanged, setIsCanvasChanged] = useState(false)

  const activeCircle = useRef(null)

  const zoomTargetRef = useRef(1)

  const crushFoldObjectDirectionRef = useRef(false)

  const objectsZoomScale = useRef(1)

  const undoStack = useRef([])
  const redoStack = useRef([])

  const tempUndoStack = useRef([])
  const tempRedoStack = useRef([])

  const [showOverlapDialog, setShowOverlapDialog] = useState(false)

  const drwDirRevRef = useRef(false)

  const [hasEditModalChanges, setHasEditModalChanges] = useState(false)

  const [canUndo, setCanUndo] = useState(false)
  const [canRedo, setCanRedo] = useState(false)

  const setZoomTargetRef = (zoomTarget) => {
    zoomTargetRef.current = zoomTarget
  }

  const setGridGroupRef = (gridGroup) => {
    gridGroupRef.current = gridGroup
  }

  const setLastDotRef = (lastDot) => {
    lastDotRef.current = lastDot
  }

  return (
    <CanvasContext.Provider
      value={{
        canvasRef,
        canvasInstance,
        gridGroupRef,
        setGridGroupRef,
        isDrawing,
        setIsDrawing,
        lastDotRef,
        setLastDotRef,
        canvasIsEmpty,
        setCanvasIsEmpty,
        objectIdCount,
        setObjectIdCount,
        drawingsGrouped,
        setDrawingsGrouped,
        isPanning,
        setIsPanning,
        isPinchZooming,
        setIsPinchZooming,
        zoomTargetRef,
        setZoomTargetRef,
        isResizing,
        setIsResizing,
        isMoving,
        setIsMoving,
        isTransforming,
        setIsTransforming,
        isRulering,
        setIsRulering,
        isRemoving,
        setIsRemoving,
        isTappering,
        setIsTappering,
        isCrushFolding,
        setIsCrushFolding,
        activeCircle,
        isCanvasChanged,
        setIsCanvasChanged,
        undoStack,
        redoStack,
        drwDirRevRef,
        canUndo,
        setCanUndo,
        canRedo,
        setCanRedo,
        tempUndoStack,
        tempRedoStack,
        showOverlapDialog,
        setShowOverlapDialog,
        isBreakLining,
        setIsBreakLining,
        showBreakLineIcon,
        setShowBreakLineIcon,
        crushFoldDirection,
        setCrushFoldDirection,
        startCrushFoldObjectRef,
        endCrushFoldObjectRef,
        objectsZoomScale,
        crushFoldObjectDirectionRef,
        hasEditModalChanges,
        setHasEditModalChanges,
      }}
    >
      {children}
    </CanvasContext.Provider>
  )
}

export const useCanvasContext = () => useContext(CanvasContext)
