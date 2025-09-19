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

export type OrderFlashing = {
  id: string
  specifications: Array<{
    id: string
    quantity: number
    length: number
  }>
}

export type FlashingData = {
  id: string
  totalGirth: number
  material: string
  color?: {
    name: string
    code: string
  }
  thickness?: {
    code: string
    thickness: number
  }
}

// GraphQL Input Types
export type CreateFlashingInput = {
  ownerId: string
  status: string
  material: string
  color: string
  thickness: string
  dimensions: {
    length: number
    width: number
    height: number
  }
}

export type UpdateFlashingInput = Partial<CreateFlashingInput>

export type CreateOrderInput = {
  clientId: string
  jobReferenceId?: string
  projectName?: string
  delivery?: {
    type: 'delivery' | 'pickup'
    id?: string
    date?: string
    address?: string
  }
  items: Array<{
    flashingId: string
    material?: {
      type: string
      color: string
      thickness: string
    }
    specifications: Array<{
      id: string
      quantity: number
      length: number
    }>
    price?: number
  }>
  status: string
}

export type UpdateOrderInput = Partial<CreateOrderInput>

export type CreateTemplateInput = {
  ownerId: string
  name: string
  description?: string
  flashings: string[]
}

export type UpdateTemplateInput = Partial<CreateTemplateInput>

export type CreateJobReferenceInput = {
  ownerId: string
  projectName: string
  code: string
  addresses: Array<{
    streetAddress: string
    suburb: string
    state: string
    postcode: number
  }>
  recipientInfo: {
    name: string
    phone: string
    email?: string
  }
}

export type UpdateJobReferenceInput = Partial<CreateJobReferenceInput>

export type UpdateUserInput = {
  fullname?: string
  phone?: string
  email?: string
  status?: string
}
