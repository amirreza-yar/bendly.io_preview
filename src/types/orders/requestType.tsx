import { Flashing, Order, Specification } from './orderType'

// Define allowed statuses
export type RequestStatus =
  | 'Pending'
  | 'In Production'
  | 'Ready for pickup'
  | 'On the way'
  | 'Cancelled'
  | 'Requested'
  | 'Completed'
  | 'Rejected'

// Request progress stages
export type RequestProgress =
  | 'Requested'
  | 'Request Review'
  | 'In Production'
  | 'Ready'
  | 'Completed'

// Define the types
export type Photo = {
  photoId: string
  src?: string
}

export const issueValues = [
  'wrong-size',
  'wrong-shape',
  'damaged',
  'wrong-material',
  'missing-parts',
  'other',
] as const

export type IssueVals = (typeof issueValues)[number]

export type Issue = {
  title: string
  desc: string
  value?: IssueVals
}

// export type RequestPiece = {
//   flashing: Partial<Flashing>
//   sepcification: Partial<Specification>
// }

export type RequestPiece = {
  flashingId: string
  material: string
  color: string
  thickness: number
  totalGirth: number
  pieceId: string
  quantity: number
  length: number
  cost: number
}

export type ReplacementRequest = {
  requestStatus: RequestStatus
  requestId: number
  requestDateTime: string

  requestProgress: RequestProgress

  order: Partial<Order>

  requestPieces: RequestPiece[]
  issue: Issue
  description?: string
  photos: Photo[]

  rejectDesc?: string
  requestDeliveryId?: number
}

// Example type for the array
export type ReplacementRequestList = ReplacementRequest[]
