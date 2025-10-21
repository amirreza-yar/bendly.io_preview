export function setAuthToken(token: string) {
  console.log('Access token is: ', token)
  if (typeof window === 'undefined') return
  document.cookie = `ff-token=${token}; path=/; max-age=${24 * 60 * 60}; secure; samesite=strict`
}

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('ff-token='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
    return null
  } catch (error) {
    console.error('Error getting auth token from cookie:', error)
    return null
  }
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return
  document.cookie = `ff-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function clearRefreshToken() {
  if (typeof window === 'undefined') return
  document.cookie = `ff-refresh-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`
}

export function clearAllTokens() {
  clearAuthToken()
  clearRefreshToken()
}

export function isAuthenticated(): boolean {
  return !!getAuthToken()
}
/**
 * Get refresh token from cookie
 * Note: This is a placeholder - refresh tokens should be stored securely
 */
export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  try {
    const cookies = document.cookie.split(';')
    const tokenCookie = cookies.find((cookie) => cookie.trim().startsWith('ff-refresh-token='))
    if (tokenCookie) {
      return tokenCookie.split('=')[1]
    }
    return null
  } catch (error) {
    console.error('Error getting refresh token from cookie:', error)
    return null
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(): boolean {
  const token = getAuthToken()
  if (!token) return true

  try {
    // Decode JWT token to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
  } catch (error) {
    console.error('Error checking token expiration:', error)
    return true
  }
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(): number | null {
  const token = getAuthToken()
  if (!token) return null

  try {
    // Decode JWT token to get expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.exp * 1000 // Convert to milliseconds
  } catch (error) {
    console.error('Error getting token expiration time:', error)
    return null
  }
}
