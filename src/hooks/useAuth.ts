/**
 * Authentication hook for managing user state and authentication
 */

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { 
  getAuthToken, 
  getAuthUser, 
  isAuthenticated, 
  isTokenExpired,
  clearAuthToken 
} from '@/utilities/cookieUtils'
import { setupTokenRefresh, refreshAuthToken } from '@/utilities/tokenRefresh'
import { graphqlGetProfile, graphqlLogout } from '@/lib/graphql/auth'

export interface AuthState {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useAuth() {
  const router = useRouter()
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  })

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

        // Check if user is authenticated
        const authenticated = isAuthenticated()
        
        if (!authenticated) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          })
          return
        }

        // Check if token is expired
        if (isTokenExpired()) {
          console.log('Token expired, attempting refresh...')
          const refreshed = await refreshAuthToken()
          
          if (!refreshed) {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Session expired',
            })
            return
          }
        }

        // Get user data
        const user = getAuthUser()
        
        if (user) {
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          })
        } else {
          // Try to get profile from server
          const profileResult = await graphqlGetProfile()
          
          if (profileResult.success) {
            setAuthState({
              user: profileResult.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            setAuthState({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: 'Failed to load user profile',
            })
          }
        }

        // Setup automatic token refresh
        setupTokenRefresh()
        
      } catch (error) {
        console.error('Auth initialization error:', error)
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Authentication initialization failed',
        })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = useCallback((user: any) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    })
  }, [])

  // Logout function
  const logout = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }))
      
      // Call logout API
      await graphqlLogout()
      
      // Clear local state
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      
      // Redirect to login page
      router.push('/auth')
      
    } catch (error) {
      console.error('Logout error:', error)
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: 'Logout failed' 
      }))
    }
  }, [router])

  // Update user function
  const updateUser = useCallback((userData: any) => {
    setAuthState(prev => ({
      ...prev,
      user: { ...prev.user, ...userData },
    }))
  }, [])

  // Clear error function
  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }))
  }, [])

  // Check if user has specific role
  const hasRole = useCallback((role: string) => {
    return authState.user?.roleId === role || authState.user?.role === role
  }, [authState.user])

  // Check if user is admin
  const isAdmin = useCallback(() => {
    return hasRole('admin')
  }, [hasRole])

  return {
    ...authState,
    login,
    logout,
    updateUser,
    clearError,
    hasRole,
    isAdmin,
  }
}
