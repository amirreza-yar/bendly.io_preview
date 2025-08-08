'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type NewJobReferenceData = {
  addressTitle: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  jobReferenceCode: string
  projectName: string
  recipientFullName: string
  recipientMobileNumber: number | string
}

type NewJobReferenceContextType = {
  newJobReference: Partial<NewJobReferenceData>
  setNewJobReference: (data: Partial<NewJobReferenceData>) => void
  resetNewJobReference: () => void
}

const NewJobReferenceContext = createContext<NewJobReferenceContextType | undefined>(undefined)

export function NewJobReferenceProvider({ children }: { children: ReactNode }) {
  const [newJobReference, setNewJobReferenceState] = useState<Partial<NewJobReferenceData>>({})

  const setNewJobReference = (data: Partial<NewJobReferenceData>) => {
    setNewJobReferenceState((prev) => ({ ...prev, ...data }))
  }

  const resetNewJobReference = () => {
    setNewJobReferenceState({})
  }

  return (
    <NewJobReferenceContext.Provider
      value={{ newJobReference, setNewJobReference, resetNewJobReference }}
    >
      {children}
    </NewJobReferenceContext.Provider>
  )
}

export function useNewJobReference() {
  const context = useContext(NewJobReferenceContext)
  if (!context) {
    throw new Error('useNewJobReference must be used within a NewJobReferenceProvider')
  }
  return context
}
