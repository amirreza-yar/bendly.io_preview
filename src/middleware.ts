import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

async function verifyJWT(token: string) {
  try {
    // Use the same secret as the backend for Payload-compatible tokens
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key')
    console.log('🔐 Verifying JWT with secret length:', secret.length)
    const { payload } = await jwtVerify(token, secret)
    console.log('✅ JWT verified successfully:', payload)

    // Validate Payload CMS token structure
    if (payload.id && payload.collection && payload.email) {
      return payload
    } else {
      console.error('❌ Invalid Payload CMS token structure')
      return null
    }
  } catch (error) {
    console.error('❌ JWT verification failed:', error)
    return null
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  console.log('🔒 Middleware running for path:', path)

  // First, check if user has valid token
  const tokenCookie = req.cookies.get('ff-token')?.value
  let token = null
  let isAuthenticated = false

  console.log(tokenCookie)

  // if (tokenCookie) {
  //   // Token is now stored directly as JWT string
  //   token = tokenCookie
  //   console.log('🍪 Token cookie found (JWT format)')
  //   console.log('🔍 Token exists:', !!token)

  //   if (token) {
  //     console.log('🔍 Token preview:', token.substring(0, 30) + '...')
  //     // Verify the JWT token
  //     const payload = await verifyJWT(token)
  //     isAuthenticated = !!payload
  //     console.log('🔍 User authentication status:', isAuthenticated)

  //     // If JWT verification fails, clear the invalid token and redirect to auth
  //     if (!isAuthenticated && token.includes('.')) {
  //       console.log('🧹 JWT verification failed, clearing invalid token and redirecting to auth')
  //       const response = NextResponse.redirect(new URL('/auth', req.url))
  //       response.cookies.delete('ff-token')
  //       response.cookies.delete('ff-refresh-token')
  //       return response
  //     }
  //   }
  // } else {
  //   console.log('❌ No ff-token cookie found')
  // }

  // // Handle auth pages - redirect authenticated users away
  // if (path.startsWith('/auth')) {
  //   if (isAuthenticated) {
  //     console.log('🚫 Authenticated user trying to access auth page, redirecting to dashboard')
  //     return NextResponse.redirect(new URL('/dashboard', req.url))
  //   } else {
  //     console.log('✅ Unauthenticated user accessing auth page, allowing')
  //     return NextResponse.next()
  //   }
  // }

  // // Handle protected pages - redirect unauthenticated users to auth
  // if (path.startsWith('/dashboard')) {
  //   if (!isAuthenticated) {
  //     console.log('🚫 Unauthenticated user trying to access protected page, redirecting to auth')
  //     return NextResponse.redirect(new URL('/auth', req.url))
  //   } else {
  //     console.log('✅ Authenticated user accessing protected page, allowing')

  //     const res = NextResponse.next()

  //     // Add security headers
  //     res.headers.set('X-Frame-Options', 'DENY')
  //     res.headers.set('X-Content-Type-Options', 'nosniff')
  //     res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  //     res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()')
  //     res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

  //     return res
  //   }
  // }

  // For all other routes, allow access
  console.log('✅ No specific rule, allowing request')
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (image files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
}
