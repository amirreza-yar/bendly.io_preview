'use client'
import { usePageNavigationAppRouter } from '@/hooks/usePageNavigationRouter'
import { useLiveQuery } from 'dexie-react-hooks'
import Image from 'next/image'
import React from 'react'

export default function MyComponent({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
