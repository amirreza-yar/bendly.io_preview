'use client'
import { GraphQLOperations } from '@/lib/api'
import { db } from '@/lib/db/appDB'
import { getUserProfile } from '@/lib/db/helpers/userProfileHelpers'
import { Flashing, Order } from '@/types/orders/orderType'
import { Issue, IssueVals, Photo, RequestPiece } from '@/types/orders/requestType'
import { useLiveQuery } from 'dexie-react-hooks'
import { createContext, useContext, useState, ReactNode } from 'react'

export type UserData = {
  userId: string
  fullname: string
  email: string
  mobile: string
}

export type UserContextType = {
  user: Partial<UserData>
  setUser: (data: Partial<UserData>) => void
  resetUser: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

interface UserProviderProps {
  initialData?: Partial<UserData>
  children: ReactNode
}

export function UserProvider({ initialData = {}, children }: UserProviderProps) {
  const [user, setUserState] = useState<Partial<UserData>>({
    // userId: userPrfoile?.id,
    // fullname: userPrfoile?.fullname,
    // email: userPrfoile?.email,
    // mobile: userPrfoile?.phone,
  })

  const setUser = (data: Partial<UserData>) => {
    setUserState((prev) => ({ ...prev, ...data }))
  }

  const resetUser = () => {
    setUserState(initialData)
  }

  return (
    <UserContext.Provider value={{ user, setUser, resetUser }}>{children}</UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
