'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

function generateRandomId(length = 16) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    result += chars[randomIndex]
  }
  return result
}

type Nodes = {
  node_id: string
  left: number
  top: number
  prev_node_id?: string
  next_node_id?: string
}

type Flashing = {
  startCrushFold: boolean
  endCrushFold: boolean
  crushFoldDir: boolean
  nodes: Nodes[]
}

type MaterialAndProperties = {
  material: string
  color?: string
  thickness?: string
}

type NewFlashingData = {
  flashingId: string
  flashing: Flashing
  materialAndProps: MaterialAndProperties
}

type NewFlashingContextType = {
  newFlashing: Partial<NewFlashingData>
  setNewFlashing: (data: Partial<NewFlashingData>) => void
  resetNewFlashing: () => void
}

const STORAGE_KEY = 'newFlashingData'

const NewFlashingContext = createContext<NewFlashingContextType | undefined>(undefined)

export function NewFlashingProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  // Mark mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Load saved state or create new with flashingId
  const [newFlashing, setNewFlashingState] = useState<Partial<NewFlashingData>>(() => {
    if (typeof window === 'undefined') return { flashingId: generateRandomId() }

    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {
      // ignore parse errors
    }
    return { flashingId: generateRandomId() }
  })

  // Save to localStorage whenever newFlashing changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFlashing))
    }
  }, [newFlashing])

  // Prevent overwriting flashingId
  const setNewFlashing = (data: Partial<NewFlashingData>) => {
    const { flashingId: _ignored, ...rest } = data
    setNewFlashingState((prev) => ({
      ...prev,
      ...rest,
      flashingId: prev.flashingId || generateRandomId(),
    }))
  }

  const resetNewFlashing = () => {
    setNewFlashingState((prev) => ({
      flashingId: prev.flashingId || generateRandomId(),
    }))
  }

  // Watch pathname changes to clear storage if leaving /flashing route
  useEffect(() => {
    if (!mounted) return

    if (!pathname.startsWith('/flashing')) {
      localStorage.removeItem(STORAGE_KEY)
      resetNewFlashing()
    }
  }, [pathname, mounted])

  return (
    <NewFlashingContext.Provider value={{ newFlashing, setNewFlashing, resetNewFlashing }}>
      {children}
    </NewFlashingContext.Provider>
  )
}

export function useNewFlashingContext() {
  const context = useContext(NewFlashingContext)
  if (!context) {
    throw new Error('useNewFlashing must be used within a NewFlashingProvider')
  }
  return context
}
