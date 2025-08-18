import { OrderPaymentResponse } from '@/types/queryTypes'

export async function fetchPrices(order: any, flashingsMap: Map<string, any>) {
  if (!order?.flashings || flashingsMap.size === 0) return []

  const res = await fetch('/api/o/price', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderFlashings: order.flashings,
      flashings: Object.fromEntries(flashingsMap),
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch prices')
  return res.json()
}

export async function fetchPickupInfo() {
  const res = await fetch('/api/o/pickup-info', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) throw new Error('Failed to fetch pickup info')
  return res.json()
}

export async function fetchAvailableDates() {
  const res = await fetch('/api/o/available-dates', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })

  if (!res.ok) throw new Error('Failed to fetch available dates')
  return res.json()
}

export async function fetchPayOrder({
  orderId,
  payVia,
}: {
  orderId: string
  payVia: string
}): Promise<OrderPaymentResponse> {
  const res = await fetch('/api/o/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      orderId: orderId,
      payVia: payVia,
    }),
  })

  if (!res.ok) throw new Error('Failed to fetch pay order')

  return res.json()
}
