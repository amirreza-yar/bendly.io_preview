'use client'

import { useEffect } from 'react'
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client'
import { ApolloProvider } from '@apollo/client/react'
import { setContext, SetContextLink } from '@apollo/client/link/context'
import { getAuthToken } from '@/utilities/cookieUtils'

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

  return <>{children}</>
}
