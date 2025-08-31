'use client'
import { StoredAddress } from '@/types/jobReferenceTypes'
import { createContext, useContext, useState, ReactNode } from 'react'

type NewAddressContextType = {
  newAddress: Partial<StoredAddress>
  setNewAddress: (data: Partial<StoredAddress>) => void
  resetNewAddress: () => void
}

const NewAddressContext = createContext<NewAddressContextType | undefined>(undefined)

export function NewAddressProvider({ children }: { children: ReactNode }) {
  const [newAddress, setNewAddressState] = useState<Partial<StoredAddress>>({})

  const setNewAddress = (data: Partial<StoredAddress>) => {
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
