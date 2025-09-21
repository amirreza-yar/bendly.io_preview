/**
 * Secure cookie utilities for server-side authentication
 * These functions work with httpOnly cookies for enhanced security
 */

import { cookies } from 'next/headers'

export interface SecureTokenData {
  accessToken: string
  refreshToken: string
  user: any
  expiresAt?: number
}

/**
 * Set secure authentication token in httpOnly cookie (server-side)
 */
export async function setSecureAuthToken(tokenData: SecureTokenData) {
  const cookieStore = await cookies()
  
  const cookieData = {
    accessToken: tokenData.accessToken,
    refreshToken: tokenData.refreshToken,
    user: tokenData.user,
    expiresAt: tokenData.expiresAt || (Date.now() + 24 * 60 * 60 * 1000) // 24 hours default
  }

  // Set the main token cookie as httpOnly
  cookieStore.set('ff-token', JSON.stringify(cookieData), {
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  
  // Set individual cookies for easier access (also httpOnly)
  cookieStore.set('ff-access-token', tokenData.accessToken, {
    path: '/',
    maxAge: 24 * 60 * 60, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
  
  cookieStore.set('ff-refresh-token', tokenData.refreshToken, {
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  })
}

/**
 * Get secure authentication token from httpOnly cookie (server-side)
 */
export async function getSecureAuthToken(): Promise<SecureTokenData | null> {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('ff-token')
    
    if (!tokenCookie) return null

    const tokenData = JSON.parse(tokenCookie.value)
    
    // Check if token is expired
    if (tokenData.expiresAt && Date.now() > tokenData.expiresAt) {
      await clearSecureAuthToken()
      return null
    }

    return tokenData
  } catch (error) {
    console.error('Error parsing secure auth token from cookie:', error)
    await clearSecureAuthToken()
    return null
  }
}

/**
 * Get secure access token from httpOnly cookie (server-side)
 */
export async function getSecureAccessToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('ff-access-token')
    
    return tokenCookie?.value || null
  } catch (error) {
    console.error('Error getting secure access token from cookie:', error)
    return null
  }
}

/**
 * Get secure refresh token from httpOnly cookie (server-side)
 */
export async function getSecureRefreshToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const tokenCookie = cookieStore.get('ff-refresh-token')
    
    return tokenCookie?.value || null
  } catch (error) {
    console.error('Error getting secure refresh token from cookie:', error)
    return null
  }
}

/**
 * Get secure user data from httpOnly cookie (server-side)
 */
export async function getSecureAuthUser(): Promise<any | null> {
  const tokenData = await getSecureAuthToken()
  return tokenData?.user || null
}

/**
 * Clear secure authentication tokens from httpOnly cookies (server-side)
 */
export async function clearSecureAuthToken() {
  const cookieStore = await cookies()
  
  // Clear auth token cookie
  const cookiesToClear = ['ff-token']
  
  cookiesToClear.forEach(cookieName => {
    cookieStore.delete(cookieName)
  })
}

/**
 * Check if user is securely authenticated (server-side)
 */
export async function isSecurelyAuthenticated(): Promise<boolean> {
  const tokenData = await getSecureAuthToken()
  return !!tokenData?.accessToken
}

/**
 * Check if secure token is expired (server-side)
 */
export async function isSecureTokenExpired(): Promise<boolean> {
  const tokenData = await getSecureAuthToken()
  if (!tokenData?.expiresAt) return false
  
  return Date.now() > tokenData.expiresAt
}

/**
 * Generate CSRF token
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * Verify CSRF token
 */
export function verifyCSRFToken(token: string, expectedToken: string): boolean {
  return token === expectedToken
}
