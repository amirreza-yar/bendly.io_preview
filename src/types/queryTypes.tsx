export type PriceResponse = {
  prices: {
    id: string
    specifications: {
      id: string
      cost: number
    }[]
  }[]
  gst: number
  deliveryCost: number
}

export type PickupInfoResponse = {
  pickupDesc: string
  pickupAddr: {
    streetAddress: string
    suburb: string
    state: string
    postcode: number
  }
}

export type AvailableDatesRespose = {
  availableDates: string[]
  deliveryDesc: string
}

export type OrderPaymentResponse = {
  id: string
  transactionId: string
  via: string
  date: number
}
