import { StoredFlashing } from './flashingTypes'
import { Address, RecipientInfo, StoredJobReference } from './jobReferenceTypes'

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

export type DeliveryType = 'delivery' | 'pickup'

export type PaymentMethod = 'PayPal' | 'Card' | 'Bank Transfer' | string

export type PaymentHistory = {
  id?: string
  orderId?: string
  total: number
  date: string
  transactionId: string
  via: PaymentMethod
}

export type DriverInfo = {
  id: string
  name: string
  mobile: string
}

export type Specification = {
  id: string
  flashingId: string
  quantity: number
  length: number
  cost?: number
}

export type StoredOrderFlashing = {
  id: string
  code?: string
  position?: string
  specifications?: Specification[]
}

export interface StoredOrder {
  id: number
  status: OrderStatus
  deliveryType: DeliveryType
  progress: OrderProgress
  createdAt: number
  updatedAt: number

  jobRefrence?: Pick<StoredJobReference, 'id' | 'projectName' | 'code'>

  address?: Address & { description?: string }

  flashings?: StoredOrderFlashing[]
  recipientInfo?: RecipientInfo
  deliveryDate?: string
  deliveryId?: number
  driverInfo?: DriverInfo
  deliveryCost?: number
  GST?: number
  paymentHistory?: PaymentHistory

  rejectionDesc?: string
}
