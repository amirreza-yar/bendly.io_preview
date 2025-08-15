export type AustraliaStates = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export type Address = {
  title: string
  streetAddress?: string
  suburb?: string
  state?: AustraliaStates
  postcode?: number
}

export type RecipientInfo = {
  recipientName: string
  recipientMobile: number
}

export type JobReference = {
  code: number
  projectName?: string
  addresses?: (Address & RecipientInfo)[]
}

export type StoredAddress = Address &
  RecipientInfo & {
    id: string
    // jobReferenceId: string
  }

export type StoredJobReference = {
  code: number
  projectName?: string
  addresses?: StoredAddress[]
  createdAt?: number
  updatedAt?: number
}
