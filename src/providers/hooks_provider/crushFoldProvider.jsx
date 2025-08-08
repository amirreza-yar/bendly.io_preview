// providers/ResizingProvider.jsx
'use client'
import { createContext, useContext, useRef } from 'react'

import useCrushFold from '@/hooks/canvas/useCrushFold'

const CrushFoldContext = createContext(null)

export const CrushFoldProvider = ({ children }) => {
  const context = useCrushFold()

  return <CrushFoldContext.Provider value={context}>{children}</CrushFoldContext.Provider>
}

export const useCrushFoldContext = () => useContext(CrushFoldContext)
