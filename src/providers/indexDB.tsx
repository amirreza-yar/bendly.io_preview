'use client'

import { useEffect } from 'react'
import { Provider } from 'urql'
import { db } from '@/lib/db'
import { urqlClient } from '@/lib/urqlClient'

export function DBProviders({ children, schema }: { children: React.ReactNode; schema: any }) {
  useEffect(() => {
    ;(async () => {
      for (const collection of schema.collections) {
        await db.contentSchemas.put({
          collection: collection.slug,
          schema: collection,
          updatedAt: Date.now(),
        })
      }
    })()
  }, [schema])

  return <Provider value={urqlClient}>{children}</Provider>
}
