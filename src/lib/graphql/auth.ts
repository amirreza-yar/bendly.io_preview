import { gql } from '@urql/core'
import { urqlClient } from '../urqlClient'

// GraphQL Mutations and Queries for Authentication
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user {
        _id
        email
        fullname
        phone
        roleId
        status
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user {
        _id
        email
        fullname
        phone
        roleId
        status
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken {
    refreshToken {
      user {
        _id
        email
        fullname
        phone
        roleId
        status
        createdAt
        updatedAt
      }
      accessToken
      refreshToken
      expiresIn
    }
  }
`

export const ME_QUERY = gql`
  query Me($userId: String!) {
    me(userId: $userId)
  }
`

// Authentication API functions using GraphQL
export async function graphqlLogin(email: string, password: string) {
  try {
    const result = await urqlClient.mutation(LOGIN_MUTATION, {
      input: { email, password }
    }).toPromise()

    if (result.error) {
      console.error('Login error:', result.error)
      return { success: false, error: result.error.message }
    }

    if (result.data?.login) {
      const { user, accessToken, refreshToken } = result.data.login
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }

      return { 
        success: true, 
        user, 
        accessToken, 
        refreshToken 
      }
    }

    return { success: false, error: 'Login failed' }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function graphqlRegister(
  email: string, 
  fullname: string, 
  phone: string, 
  password: string,
  roleId?: string
) {
  try {
    const result = await urqlClient.mutation(REGISTER_MUTATION, {
      input: { 
        email, 
        fullname, 
        phone, 
        password,
        roleId: roleId || 'user' // Default role
      }
    }).toPromise()

    if (result.error) {
      console.error('Register error:', result.error)
      return { success: false, error: result.error.message }
    }

    if (result.data?.register) {
      const { user, accessToken, refreshToken } = result.data.register
      
      // Store tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }

      return { 
        success: true, 
        user, 
        accessToken, 
        refreshToken 
      }
    }

    return { success: false, error: 'Registration failed' }
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function graphqlRefreshToken() {
  try {
    const result = await urqlClient.mutation(REFRESH_TOKEN_MUTATION).toPromise()

    if (result.error) {
      console.error('Refresh token error:', result.error)
      return { success: false, error: result.error.message }
    }

    if (result.data?.refreshToken) {
      const { user, accessToken, refreshToken } = result.data.refreshToken
      
      // Update tokens in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('user', JSON.stringify(user))
      }

      return { 
        success: true, 
        user, 
        accessToken, 
        refreshToken 
      }
    }

    return { success: false, error: 'Token refresh failed' }
  } catch (error) {
    console.error('Refresh token error:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function graphqlLogout() {
  try {
    // Clear tokens from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    }

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}

export async function graphqlGetProfile() {
  try {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!userStr) {
      return { success: false, error: 'No user data found' }
    }

    const user = JSON.parse(userStr)
    return { success: true, user }
  } catch (error) {
    console.error('Get profile error:', error)
    return { success: false, error: 'Failed to get profile' }
  }
}

// Legacy compatibility functions (to be removed after migration)
export async function apiCheckEmail(email: string) {
  // This would need to be implemented as a GraphQL query if needed
  // For now, return null to indicate not implemented
  return null
}

export async function apiSendEmailCode(email: string) {
  // This would need to be implemented as a GraphQL mutation if needed
  // For now, return null to indicate not implemented
  return null
}

export async function apiVerifyEmailCode(email: string, code: string) {
  // This would need to be implemented as a GraphQL mutation if needed
  // For now, return null to indicate not implemented
  return null
}

export async function apiVerifyMobileCode(phone: string, code: string) {
  // This would need to be implemented as a GraphQL mutation if needed
  // For now, return null to indicate not implemented
  return null
}

export async function apiResendMobileCode(phone: string, email: string) {
  // This would need to be implemented as a GraphQL mutation if needed
  // For now, return null to indicate not implemented
  return null
}

export async function apiCreateAccount(
  email: string,
  fullName: string,
  phone: string,
  password: string,
) {
  return graphqlRegister(email, fullName, phone, password)
}

export async function apiLogin(email: string, password: string) {
  return graphqlLogin(email, password)
}

export async function apiLogout() {
  return graphqlLogout()
}

export async function apiGetProfile() {
  return graphqlGetProfile()
}
