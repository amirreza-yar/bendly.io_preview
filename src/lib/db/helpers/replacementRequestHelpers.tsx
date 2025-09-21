import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../appDB'
import { ReplacementRequest } from '@/types/orders/requestType'

// Hook to get all replacement requests
export function useGETAllReplacementRequests(): ReplacementRequest[] | undefined | null {
  return useLiveQuery(() => db.replacementRequests.toArray())
}

// Hook to get replacement requests by status
export function useGETReplacementRequestsByStatus(status: string): ReplacementRequest[] | undefined | null {
  return useLiveQuery(() => db.replacementRequests.where('requestStatus').equals(status).toArray())
}

// Hook to get replacement requests by order ID
export function useGETReplacementRequestsByOrderId(orderId: number): ReplacementRequest[] | undefined | null {
  return useLiveQuery(() => db.replacementRequests.where('order.orderId').equals(orderId).toArray())
}
