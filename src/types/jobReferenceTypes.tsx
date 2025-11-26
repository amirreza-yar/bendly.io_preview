export type AustraliaStates = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT'

export type Address = {
  title: string
  streetAddress?: string
  suburb?: string
  state?: AustraliaStates | string
  postcode?: number
}

export type RecipientInfo = {
  recipient_name: string
  recipient_mobile: number
}

export type JobReference = {
  code: number
  project_name?: string
  addresses?: (Address & RecipientInfo)[]
}

export type StoredAddress = Address &
  RecipientInfo & {
    id: string
    // jobReferenceId: string
  }

export type StoredJobReference = {
  id: string
  code: number
  project_name?: string
  addresses?: StoredAddress[]
  createdAt?: number
  updatedAt?: number
}
