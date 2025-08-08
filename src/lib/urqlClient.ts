import { createClient, cacheExchange, fetchExchange } from '@urql/core'

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:3000/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    }
  },
})
