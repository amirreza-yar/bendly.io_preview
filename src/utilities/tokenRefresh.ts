/**
 * Token refresh utility for automatic token renewal
 */

import { graphqlRefreshToken } from '@/lib/graphql/auth'
import { getRefreshToken, getAuthToken, getTokenExpirationTime } from './cookieUtils'

let refreshPromise: Promise<any> | null = null

/**
 * Check if token needs refresh (within 5 minutes of expiration)
 */
export function shouldRefreshToken(): boolean {
  const expirationTime = getTokenExpirationTime()
  if (!expirationTime) return false
  
  const fiveMinutes = 5 * 60 * 1000 // 5 minutes in milliseconds
  return Date.now() > (expirationTime - fiveMinutes)
}

/**
 * Refresh the authentication token
 */
export async function refreshAuthToken(): Promise<boolean> {
  // Prevent multiple simultaneous refresh attempts
  if (refreshPromise) {
    return refreshPromise
  }

  refreshPromise = performTokenRefresh()
  
  try {
    const result = await refreshPromise
    return result
  } finally {
    refreshPromise = null
  }
}

/**
 * Internal function to perform the actual token refresh
 */
async function performTokenRefresh(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken()
    
    if (!refreshToken) {
      console.warn('No refresh token available')
      return false
    }

    console.log('Refreshing authentication token...')
    const result = await graphqlRefreshToken()
    
    if (result.success) {
      console.log('Token refreshed successfully')
      return true
    } else {
      console.error('Token refresh failed:', result.error)
      return false
    }
  } catch (error) {
    console.error('Token refresh error:', error)
    return false
  }
}

/**
 * Setup automatic token refresh on page load
 */
export function setupTokenRefresh() {
  if (typeof window === 'undefined') return

  // Check if token needs refresh on page load
  if (shouldRefreshToken()) {
    refreshAuthToken()
  }

  // Set up periodic check for token expiration
  const checkInterval = setInterval(() => {
    if (shouldRefreshToken()) {
      refreshAuthToken()
    }
  }, 60000) // Check every minute

  // Clean up interval on page unload
  window.addEventListener('beforeunload', () => {
    clearInterval(checkInterval)
  })

  return () => clearInterval(checkInterval)
}

/**
 * Handle 401 responses by attempting token refresh
 */
export async function handleUnauthorized(): Promise<boolean> {
  console.log('Handling unauthorized response, attempting token refresh...')
  
  const refreshed = await refreshAuthToken()
  
  if (refreshed) {
    console.log('Token refreshed, retrying request...')
    return true
  } else {
    console.log('Token refresh failed, redirecting to login...')
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
    return false
  }
}

/**
 * Enhanced fetch function with automatic token refresh
 */
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const accessToken = getAuthToken() // Get auth token
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // If unauthorized, try to refresh token and retry
  if (response.status === 401) {
    const refreshed = await handleUnauthorized()
    
    if (refreshed) {
      // Retry the request with new token
      const newToken = getAuthToken()
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`
        response = await fetch(url, {
          ...options,
          headers,
        })
      }
    }
  }

  return response
}
