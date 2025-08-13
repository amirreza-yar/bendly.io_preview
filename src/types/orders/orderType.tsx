// src/types/order.ts

// Order progress stages
export type OrderProgress =
  | 'Order Received'
  | 'Order Review'
  | 'In Production'
  | 'Ready'
  | 'Completed'

// Order status options
export type OrderStatus =
  | 'Pending'
  | 'In Production'
  | 'Ready for pickup'
  | 'On the way'
  | 'Cancelled'
  | 'Requested'
  | 'Completed'
  | 'Rejected'

// Delivery type
export type DeliveryType = 'delivery' | 'pickup'

// Payment method
export type PaymentMethod = 'PayPal' | 'Card' | 'Bank Transfer' | string

export type PaymentHistory = {
  total: number
  date: string // ISO string
  transactionId: string
  via: PaymentMethod
}

export type DriverInfo = {
  name: string
  mobile: string
}

export type JobAddress = {
  addressId: string
  title: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
}

export type RecipientInfo = {
  recipientName: string
  recipientMobile: string
}

export type PickupInfo = {
  addressId: string
  title: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  description: string
}

export type JobReference = {
  code: string
  projectName: string
}

export type Specification = {
  id: string
  quantity: number
  length: number
  cost: number
}

export type Flashing = {
  flashingId: string
  code: string
  position: string
  material: string
  color: string
  thickness: number
  crushfold: boolean
  tapered: boolean
  totalGirth: number
  sepcifications: Specification[]
}

interface BaseOrder {
  orderStatus: OrderStatus
  orderId: number
  orderDateTime: string // ISO string
  jobRefrence: JobReference
  deliveryType: DeliveryType

  recipientInfo: RecipientInfo
  deliveryDate: string
  deliveryId: number
  driverInfo: DriverInfo
  orderProgress: OrderProgress
  rejectionDesc?: string

  deliveryCost: number
  GST: number
  paymentHistory: PaymentHistory
  flashings: Flashing[]
}

// Delivery Order (requires `address`)
interface DeliveryOrder extends BaseOrder {
  deliveryType: 'delivery'
  address: JobAddress
  pickupInfo?: never
}

// Pickup Order (requires `pickupInfo`)
interface PickupOrder extends BaseOrder {
  deliveryType: 'pickup'
  pickupInfo: PickupInfo
  address?: never
}

// Union of the two
export type Order = DeliveryOrder | PickupOrder

export type OrderList = Order[]

interface StoredOrder {
  orderStatus: OrderStatus
  orderId: number
  orderDateTime: string
  deliveryType: DeliveryType
  orderProgress: OrderProgress

  jobRefrence?: JobReference

  flashings: {
    flashingId: string
    code: string
    position: string
    material: string
    color: string
    thickness: number
    crushfold: boolean
    tapered: boolean
    totalGirth: number
    sepcifications: Specification[]
  }

  recipientInfo?: RecipientInfo
  deliveryDate?: string
  deliveryId?: number
  driverInfo?: DriverInfo
  deliveryCost?: number
  GST?: number
  paymentHistory?: PaymentHistory

  rejectionDesc?: string
}
