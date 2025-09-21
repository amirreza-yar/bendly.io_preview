import { createClient, cacheExchange, fetchExchange } from '@urql/core'

export const urqlClient = createClient({
  url: process.env.NEXT_PUBLIC_BACKEND_URL + '/graphql' || 'http://localhost:4000/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    return {
      headers: { 
        authorization: token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json'
      },
    }
  },
})
