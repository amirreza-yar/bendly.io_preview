'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type NewAddressData = {
  addressTitle: string
  streetAddress: string
  suburb: string
  state: string
  postcode: string
  recipientFullName: string
  recipientMobileNumber: number | string
}

type NewAddressContextType = {
  newAddress: Partial<NewAddressData>
  setNewAddress: (data: Partial<NewAddressData>) => void
  resetNewAddress: () => void
}

const NewAddressContext = createContext<NewAddressContextType | undefined>(undefined)

export function NewAddressProvider({ children }: { children: ReactNode }) {
  const [newAddress, setNewAddressState] = useState<Partial<NewAddressData>>({})

  const setNewAddress = (data: Partial<NewAddressData>) => {
    setNewAddressState((prev) => ({ ...prev, ...data }))
  }

  const resetNewAddress = () => {
    setNewAddressState({})
  }

  return (
    <NewAddressContext.Provider value={{ newAddress, setNewAddress, resetNewAddress }}>
      {children}
    </NewAddressContext.Provider>
  )
}

export function useNewAddress() {
  const context = useContext(NewAddressContext)
  if (!context) {
    throw new Error('useNewAddress must be used within a NewAddressProvider')
  }
  return context
}
