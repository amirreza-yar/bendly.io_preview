import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'
import { AuthProvider } from './AuthProvider'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
