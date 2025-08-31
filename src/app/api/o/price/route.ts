import { StoredFlashing } from '@/types/flashingTypes'
import { StoredOrderFlashing } from '@/types/orderTypes'
import { NextResponse } from 'next/server'

const DELIVERY_COST = 12
const GST = 0.1

export async function POST(req: Request) {
  try {
    const {
      flashings,
      orderFlashings,
    }: { flashings: Record<string, StoredFlashing>; orderFlashings: StoredOrderFlashing[] } =
      await req.json()

    const result = orderFlashings
      .map((oflash: StoredOrderFlashing) => {
        const found = flashings[oflash.id]
        if (!found) return null

        return {
          id: oflash.id,
          specifications: oflash.specifications?.map((spec) => ({
            id: spec.id,
            cost: (spec.quantity * spec.length * (found.totalGirth ?? 0)) / 10000,
          })),
        }
      })
      .filter(Boolean)

    return NextResponse.json({ prices: result, gst: GST, deliveryCost: DELIVERY_COST })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'server error' }, { status: 500 })
  }
}
