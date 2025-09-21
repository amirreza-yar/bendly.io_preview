/**
 * Authentication Context Provider
 */

'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'

interface AuthContextType extends AuthState {
  login: (user: any) => void
  logout: () => Promise<void>
  updateUser: (userData: any) => void
  clearError: () => void
  hasRole: (role: string) => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Convenience hook for authentication state
export function useAuthState() {
  const { isAuthenticated, isLoading, error, user } = useAuthContext()
  return { isAuthenticated, isLoading, error, user }
}

// Convenience hook for authentication actions
export function useAuthActions() {
  const { login, logout, updateUser, clearError } = useAuthContext()
  return { login, logout, updateUser, clearError }
}
