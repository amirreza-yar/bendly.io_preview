'use client'
import { getOrderById } from '@/lib/db/helpers/orderHelpers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { notFound, useParams } from 'next/navigation'
import { ReactNode } from 'react'

const queryClient = new QueryClient()

export default function NewOrderLayout({ children }: { children: ReactNode }) {
  const { orderId } = useParams<{ orderId: string }>()

  const order = getOrderById(Number(orderId))

  if (order && (order.completed || order.paymentHistory)) return notFound()

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
