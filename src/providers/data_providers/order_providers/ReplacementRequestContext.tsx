'use client'
import { Flashing, Order } from '@/types/orders/orderType'
import { Issue, IssueVals, Photo, RequestPiece } from '@/types/orders/requestType'
import { createContext, useContext, useState, ReactNode } from 'react'

export type ReplacementRequestData = {
  order: Partial<Order>
  requestPieces: Partial<RequestPiece>[]
  issue: {
    title: string
    desc: string
    value: IssueVals | any
  }
  description?: string
  photos: Photo[]
}

export type ReplacementRequestContextType = {
  replacementRequest: Partial<ReplacementRequestData>
  setReplacementRequest: (data: Partial<ReplacementRequestData>) => void
  resetReplacementRequest: () => void
}

const ReplacementRequestContext = createContext<ReplacementRequestContextType | undefined>(
  undefined,
)

interface ReplacementRequestProviderProps {
  initialData?: Partial<ReplacementRequestData>
  children: ReactNode
}

export function ReplacementRequestProvider({
  initialData = {},
  children,
}: ReplacementRequestProviderProps) {
  const [replacementRequest, setReplacementRequestState] =
    useState<Partial<ReplacementRequestData>>(initialData)

  const setReplacementRequest = (data: Partial<ReplacementRequestData>) => {
    setReplacementRequestState((prev) => ({ ...prev, ...data }))
  }

  const resetReplacementRequest = () => {
    setReplacementRequestState(initialData)
  }

  return (
    <ReplacementRequestContext.Provider
      value={{ replacementRequest, setReplacementRequest, resetReplacementRequest }}
    >
      {children}
    </ReplacementRequestContext.Provider>
  )
}

export function useReplacementRequest() {
  const context = useContext(ReplacementRequestContext)
  if (!context) {
    throw new Error('useReplacementRequest must be used within a ReplacementRequestProvider')
  }
  return context
}
