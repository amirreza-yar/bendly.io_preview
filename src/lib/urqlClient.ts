import { createClient, cacheExchange, fetchExchange, errorExchange } from '@urql/core'
import { getAuthToken } from '@/utilities/cookieUtils'
import { handleUnauthorized } from '@/utilities/tokenRefresh'

// Custom fetch function with token refresh handling
const customFetch = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle 401 responses
  if (response.status === 401) {
    const refreshed = await handleUnauthorized()
    
    if (refreshed) {
      // Retry with new token
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

// Error exchange to handle GraphQL errors
const errorExchangeHandler = errorExchange({
  onError(error) {
    console.error('GraphQL Error:', error)
    
    // Handle authentication errors
    if (error.graphQLErrors?.some(e => e.extensions?.code === 'UNAUTHENTICATED')) {
      handleUnauthorized()
    }
  },
})

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql' || 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, errorExchangeHandler, fetchExchange],
  fetch: customFetch,
})
