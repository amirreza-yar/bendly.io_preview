'use client'
import React, { Suspense, useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { redirect, useParams } from 'next/navigation'
import { db } from '@/lib/db/appDB'

export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  const params = useParams()

  const flashingId = Array.isArray(params?.flashingId) ? params?.flashingId[0] : params?.flashingId

  const flashing = useLiveQuery(
    () => (flashingId ? db.flashings.get(flashingId) : undefined),
    [flashingId],
    null,
  )

  if (flashing === null) {
    return <div className="w-screen h-screen flex items-center justify-center" />
  } else if (flashing === undefined || flashing.isDraft) {
    return redirect('/dashboard')
  } else {
    return <>{children}</>
  }
}
