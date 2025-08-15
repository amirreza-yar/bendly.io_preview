'use client'
import { orderExistsById } from '@/lib/db/helpers/orderHelpers'
import { looksLikeGeneratedNumericId } from '@/lib/db/helpers/utils'
import { useLiveQuery } from 'dexie-react-hooks'
import { notFound, useParams } from 'next/navigation'
import { ReactNode } from 'react'

export default function NewOrderLayout({ children }: { children: ReactNode }) {
  const { orderId } = useParams()

  if (!looksLikeGeneratedNumericId(Number(orderId))) return notFound()

  const orderExists = orderExistsById(Number(orderId))

  if (orderExists === false) return notFound()

  return <>{children}</>
}
