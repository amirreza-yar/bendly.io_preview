import { OrderPaymentResponse, OrderFlashing, FlashingData } from '@/types/queryTypes'
import { urqlClient } from '@/lib/urqlClient'
import { gql } from '@urql/core'

export async function fetchPrices(order: { flashings: OrderFlashing[] }, flashingsMap: Map<string, FlashingData>) {
  if (!order?.flashings || flashingsMap.size === 0) return []

  try {
    const result = await urqlClient.mutation(gql`
      mutation CalculatePrice($input: PriceCalculationInput!) {
        calculatePrice(input: $input)
      }
    `, {
      input: {
        flashings: JSON.stringify(Object.fromEntries(flashingsMap)),
        orderFlashings: JSON.stringify(order.flashings),
      }
    }).toPromise()

    if (result.error) {
      throw new Error('GraphQL error: ' + result.error.message)
    }

    return JSON.parse(result.data.calculatePrice)
  } catch (error) {
    console.error('Failed to fetch prices:', error)
    throw new Error('Failed to fetch prices')
  }
}

export async function fetchPickupInfo() {
  try {
    const result = await urqlClient.query(gql`
      query PickupInfo {
        pickupInfo
      }
    `).toPromise()

    if (result.error) {
      throw new Error('GraphQL error: ' + result.error.message)
    }

    return JSON.parse(result.data.pickupInfo)
  } catch (error) {
    console.error('Failed to fetch pickup info:', error)
    throw new Error('Failed to fetch pickup info')
  }
}

export async function fetchAvailableDates() {
  try {
    const result = await urqlClient.query(gql`
      query AvailableDates {
        availableDates
      }
    `).toPromise()

    if (result.error) {
      throw new Error('GraphQL error: ' + result.error.message)
    }

    return JSON.parse(result.data.availableDates)
  } catch (error) {
    console.error('Failed to fetch available dates:', error)
    throw new Error('Failed to fetch available dates')
  }
}

export async function fetchPayOrder({
  orderId,
  payVia,
}: {
  orderId: string
  payVia: string
}): Promise<OrderPaymentResponse> {
  try {
    const result = await urqlClient.mutation(gql`
      mutation ProcessPayment($input: PaymentInput!) {
        processPayment(input: $input)
      }
    `, {
      input: {
        orderId,
        payVia,
      }
    }).toPromise()

    if (result.error) {
      throw new Error('GraphQL error: ' + result.error.message)
    }

    return JSON.parse(result.data.processPayment)
  } catch (error) {
    console.error('Failed to process payment:', error)
    throw new Error('Failed to process payment')
  }
}
