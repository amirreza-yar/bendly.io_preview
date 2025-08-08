export type JobReference = {
  code: number
  projectName: string
  addresses: {
    title: string
    streetAddress: string
    suburb: string
    state: string
    stateAbbreviation: string
    postcode: number
    recipientName: string
    recipientMobile: number
  }[]
}
