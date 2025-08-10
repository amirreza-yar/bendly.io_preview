// providers/ResizingProvider.jsx
'use client'
import { createContext, useContext, useRef } from 'react'

import useBreakLine from '@/hooks/canvas/useBreakLine'

const BreakLineContext = createContext(null)

export const BreakLineProvider = ({ children }) => {
  const context = useBreakLine()

  return <BreakLineContext.Provider value={context}>{children}</BreakLineContext.Provider>
}

export const useBreakLineContext = () => useContext(BreakLineContext)
