import { gql } from '@urql/core'
import { urqlClient } from '../urqlClient'
import { setAuthToken, clearAuthToken, getAuthToken, isAuthenticated } from '@/utilities/cookieUtils'

// GraphQL Mutations and Queries for Authentication
export const loginMutation = gql`
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

export const registerMutation = gql`
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

export const refreshTokenMutation = gql`
  mutation RefreshToken($currentToken: String!) {
    refreshToken(refreshToken: $currentToken) {
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

export const meQuery = gql`
  query Me($userId: String!) {
    me(userId: $userId)
  }
`

// Authentication API functions using GraphQL
export async function graphqlLogin(email: string, password: string) {
  try {
    const result = await urqlClient.mutation(loginMutation, {
      input: { email, password }
    }).toPromise()

    if (result.error) {
      console.error('Login error:', result.error)
      return { success: false, error: result.error.message }
    }

    if (result.data?.login) {
      const { user, accessToken, refreshToken, expiresIn } = result.data.login
      
      // Use the access token directly from backend (now Payload-compatible)
      const authToken = accessToken
      
      setAuthToken(authToken)

      return { 
        success: true, 
        user, 
        accessToken, 
        refreshToken,
        apiCode: '100600' // Success code
      }
    }

    return { success: false, error: 'Login failed', apiCode: '100602' }
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
    const result = await urqlClient.mutation(registerMutation, {
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
      const { user, accessToken, refreshToken, expiresIn } = result.data.register
      
      // Use the access token directly from backend (now Payload-compatible)
      const authToken = accessToken
      
      setAuthToken(authToken)

      return { 
        success: true, 
        user, 
        accessToken, 
        refreshToken,
        apiCode: '100600' // Success code
      }
    }

    return { success: false, error: 'Registration failed', apiCode: '100301' }
  } catch (error) {
    console.error('Register error:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function graphqlRefreshToken() {
  try {
    const currentToken = getAuthToken()
    if (!currentToken) {
      return { success: false, error: 'No token available' }
    }

    const result = await urqlClient.mutation(refreshTokenMutation, { 
      currentToken 
    }).toPromise()

    if (result.error) {
      console.error('Refresh token error:', result.error)
      return { success: false, error: result.error.message }
    }

    if (result.data?.refreshToken) {
      const { user, accessToken, refreshToken: newToken, expiresIn } = result.data.refreshToken
      
      // Use the new token as the ff-token
      setAuthToken(newToken)

      return { 
        success: true, 
        user, 
        accessToken: newToken, 
        refreshToken: newToken 
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
    // Clear tokens from cookies
    clearAuthToken()

    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}

export async function graphqlGetProfile() {
  try {
    const token = getAuthToken()
    if (!token) {
      return { success: false, error: 'No token found' }
    }

    // Decode the JWT token to get user info
    const payload = JSON.parse(atob(token.split('.')[1]))
    const user = {
      _id: payload.id,
      email: payload.email,
      collection: payload.collection,
      sid: payload.sid
    }

    return { success: true, user }
  } catch (error) {
    console.error('Get profile error:', error)
    return { success: false, error: 'Failed to get profile' }
  }
}

// Legacy compatibility functions - now implemented with GraphQL
export async function apiCheckEmail(email: string) {
  try {
    const result = await urqlClient.mutation(gql`
      mutation CheckEmail($email: String!) {
        checkEmail(email: $email)
      }
    `, { email }).toPromise()

    if (result.error) {
      console.error('Check email error:', result.error)
      return { ok: false, error: 'GraphQL error' }
    }

    const data = JSON.parse(result.data.checkEmail)
    return {
      ok: true,
      apiCode: data.exists ? '100102' : '100101',
      email: data.email,
      exists: data.exists
    }
  } catch (error) {
    console.error('Check email error:', error)
    return { ok: false, error: 'Network error' }
  }
}

export async function apiSendEmailCode(email: string) {
  try {
    const result = await urqlClient.mutation(gql`
      mutation SendEmailCode($email: String!) {
        sendEmailCode(email: $email)
      }
    `, { email }).toPromise()

    if (result.error) {
      console.error('Send email code error:', result.error)
      return { ok: false, error: 'GraphQL error' }
    }

    const data = JSON.parse(result.data.sendEmailCode)
    return {
      ok: data.success,
      apiCode: data.apiCode || '100100',
      message: data.message
    }
  } catch (error) {
    console.error('Send email code error:', error)
    return { ok: false, error: 'Network error' }
  }
}

export async function apiVerifyEmailCode(email: string, code: string) {
  try {
    const result = await urqlClient.mutation(gql`
      mutation VerifyEmailCode($email: String!, $code: String!) {
        verifyEmailCode(email: $email, code: $code)
      }
    `, { email, code }).toPromise()

    if (result.error) {
      console.error('Verify email code error:', result.error)
      return { ok: false, error: 'GraphQL error' }
    }

    const data = JSON.parse(result.data.verifyEmailCode)
    return {
      ok: data.verified,
      apiCode: data.apiCode || '100200',
      message: data.message
    }
  } catch (error) {
    console.error('Verify email code error:', error)
    return { ok: false, error: 'Network error' }
  }
}

export async function apiVerifyMobileCode(phone: string, code: string) {
  try {
    const result = await urqlClient.mutation(gql`
      mutation VerifyPhoneCode($phone: String!, $code: String!) {
        verifyPhoneCode(phone: $phone, code: $code)
      }
    `, { phone, code }).toPromise()

    if (result.error) {
      console.error('Verify mobile code error:', result.error)
      return { ok: false, error: 'GraphQL error' }
    }

    const data = JSON.parse(result.data.verifyPhoneCode)
    return {
      ok: data.verified,
      apiCode: data.apiCode || '100500',
      message: data.message
    }
  } catch (error) {
    console.error('Verify mobile code error:', error)
    return { ok: false, error: 'Network error' }
  }
}

export async function apiResendMobileCode(phone: string, email: string) {
  try {
    const result = await urqlClient.mutation(gql`
      mutation ResendPhoneCode($phone: String!, $email: String!) {
        resendPhoneCode(phone: $phone, email: $email)
      }
    `, { phone, email }).toPromise()

    if (result.error) {
      console.error('Resend mobile code error:', result.error)
      return { ok: false, error: 'GraphQL error' }
    }

    const data = JSON.parse(result.data.resendPhoneCode)
    return {
      ok: data.success,
      apiCode: data.apiCode || '100400',
      message: data.message
    }
  } catch (error) {
    console.error('Resend mobile code error:', error)
    return { ok: false, error: 'Network error' }
  }
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
