// import { getDBOrThrow } from '@/lib/db/appDB'
import { db } from '../appDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { generateRandomId, generateRandomNumericId, looksLikeGeneratedNumericId } from './utils'
import Dexie from 'dexie'
import { getTotalGirth } from '@/hooks/canvas/useFlashingLoader'
import { StoredOrder } from '@/types/orderTypes'
import { notFound } from 'next/navigation'
import { StoredFlashing } from '@/types/flashingTypes'

type ReturnDexieError = Promise<string | typeof Dexie.DexieError | Error>

export async function upsertPartialOrder(id: number, partial: Partial<StoredOrder>) {
  const now = Date.now()

  if (!looksLikeGeneratedNumericId(id)) {
    console.log('doesn"t looksLikeGeneratedNumericId(id)')
    return
    // notFound()
  }

  await db.transaction('rw', db.orders, async () => {
    // Try to update first (merge)
    const existing = await db.orders.get(id)

    if (existing) {
      // Merge existing + partial
      const merged: StoredOrder = {
        ...existing,
        ...partial,
        updatedAt: now,
      }

      await db.orders.put(merged)
      return
    }

    // Not found -> create new with defaults + partial
    const base: StoredOrder = {
      id,
      status: 'Pending',
      deliveryType: 'delivery',
      progress: 'Order Received',
      createdAt: now,
      updatedAt: now,
    }

    const merged: StoredOrder = {
      ...base,
      ...partial,
    }

    await db.orders.add(merged)
  })
}

export async function initNewOrder(
  partial: Partial<StoredOrder>,
): Promise<number | typeof Dexie.DexieError | Error> {
  try {
    const newOrderId = generateRandomNumericId()
    await upsertPartialOrder(newOrderId, partial)
    return newOrderId
  } catch (err) {
    if (err instanceof Dexie.DexieError || err instanceof Error) {
      return err
    } else {
      return new Error(String(err))
    }
  }
}

export function getOrderById(orderId: number): StoredOrder | undefined | null {
  return useLiveQuery(() => db.orders.get({ id: orderId }), [orderId], null)
}

export function getAllOrders(): StoredOrder[] | undefined | null {
  return useLiveQuery(() => db.orders.toArray(), [], null)
}

export function getFlashingsByOrderId(orderId: number): (StoredFlashing | undefined)[] {
  const flashingIds = getOrderById(orderId)?.flashings?.map((flash) => flash.id)

  console.log(flashingIds)
  return useLiveQuery(
    async () => {
      if (!flashingIds || flashingIds.length === 0) return []
      const rows = await db.flashings.where('id').anyOf(flashingIds).toArray()
      // if you need to preserve the original flashingIds order:
      const map = new Map(rows.map((r) => [r.id, r]))
      return flashingIds.map((id) => map.get(id)).filter(Boolean)
    },
    [flashingIds?.join(',')],
    [],
  )
}
