// src/components/DBProvider.tsx
'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { db } from '@/lib/db/appDB'
import { seedMaterialsIfEmpty } from '@/lib/db/helpers/materials&PropsHelpers'

const DBReadyContext = createContext<{ ready: boolean; error?: Error } | null>(null)

export function useDBReady() {
  const ctx = useContext(DBReadyContext)
  if (!ctx) throw new Error('useDBReady must be used inside DBProvider')
  return ctx
}

export function DBProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)
  const [dbinstance, setDBinstance] = useState(null)

  useEffect(() => {
    let mounted = true
    db.open()
      .then(() => {
        if (mounted) {
          setReady(true)
        }
      })
      .then(() => seedMaterialsIfEmpty())
      .catch((err) => {
        console.error('Failed to init DB:', err)
        if (mounted) setError(err instanceof Error ? err : new Error(String(err)))
      })
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (ready) {
      seedMaterialsIfEmpty()
    }
  }, [ready])

  return <DBReadyContext.Provider value={{ ready, error }}>{children}</DBReadyContext.Provider>
}
