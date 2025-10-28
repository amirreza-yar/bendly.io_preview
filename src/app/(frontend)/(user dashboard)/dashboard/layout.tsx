'use client'

import { useEffect } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext, SetContextLink } from '@apollo/client/link/context'
import { getAuthToken } from '@/utilities/cookieUtils'

const authLink = new SetContextLink(({ headers }) => {
  const token = getAuthToken()

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(
    new HttpLink({ uri: process.env.NEXT_PUBLIC_GRAPHQL_URL, credentials: 'include' }),
  ),
  cache: new InMemoryCache(),
})

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('sw registered!')
          console.log(reg)
        })
        .catch((error) => {
          console.log('sw reg failed!')
          console.log(error)
        })
    }
  }, [])

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
