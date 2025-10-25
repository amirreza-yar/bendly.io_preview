// Commented out server-only imports that cause build errors in pages/ directory
// import { cookies } from 'next/headers'
// import { redirect } from 'next/navigation'
import { User } from '@/types/userTypes'

// import { getClientSideURL } from './getURL'

export const getMeUser = async (args?: {
  nullUserRedirect?: string
  validUserRedirect?: string
}): Promise<{
  token: string
  user: User
}> => {
  const { nullUserRedirect, validUserRedirect } = args || {}

  // Commented out server-side cookie access
  // const cookieStore = await cookies()
  // const token = cookieStore.get('ff-token')?.value

  // Temporary client-side token access (for now)
  const token = typeof window !== 'undefined'
    ? document.cookie
        .split('; ')
        .find(row => row.startsWith('ff-token='))
        ?.split('=')[1]
    : undefined

  const meUserReq = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000'}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      query: `
        query GetCurrentUser {
          me(userId: "")
        }
      `
    }),
  })

  const response = await meUserReq.json()

  let user: User
  if (response.data?.me) {
    // Backend returns user data
    user = response.data.me
  } else {
    // Fallback: get user data from IndexedDB if available
    if (typeof window !== 'undefined') {
      try {
        const { getCurrentUserId, getUserProfile } = await import('@/lib/db/helpers/userProfileHelpers')
        const userId = await getCurrentUserId()
        if (userId) {
          const userProfile = await getUserProfile(userId)
          if (userProfile) {
            user = {
              _id: userProfile.id,
              email: userProfile.email,
              fullname: userProfile.fullname,
              phone: userProfile.phone,
              roleId: userProfile.roleId,
              status: userProfile.status as 'active' | 'deactivated' | 'blocked',
              createdAt: userProfile.createdAt,
              updatedAt: userProfile.updatedAt,
            }
          } else {
            throw new Error('User profile not found')
          }
        } else {
          throw new Error('No user ID found')
        }
      } catch (error) {
        throw new Error('Failed to get user data')
      }
    } else {
      throw new Error('Cannot get user data server-side')
    }
  }

  // Commented out server-side redirects
  // if (validUserRedirect && meUserReq.ok && user) {
  //   redirect(validUserRedirect)
  // }

  // if (nullUserRedirect && (!meUserReq.ok || !user)) {
  //   redirect(nullUserRedirect)
  // }

  // Client-side redirects (temporary)
  if (validUserRedirect && meUserReq.ok && user && typeof window !== 'undefined') {
    window.location.href = validUserRedirect
  }

  if (nullUserRedirect && (!meUserReq.ok || !user) && typeof window !== 'undefined') {
    window.location.href = nullUserRedirect
  }

  // Token will exist here because if it doesn't the user will be redirected
  return {
    token: token!,
    user,
  }
}
