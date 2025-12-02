import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import api from './lib/axios'

async function verifyJWT(token: string) {
  try {
    const secretRead = process.env.JWT_SECRET || 'dev-secret-key'
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key')
    console.log('🔐 Verifying JWT with secret length:', secret.length, secretRead, token)
    const { payload } = await jwtVerify(token, secret)
    console.log('✅ JWT verified successfully:', payload)

    // Validate Payload CMS token structure
    if (payload.sid && payload.sub && payload.email) {
      return payload
    } else {
      console.error('❌ Invalid Payload CMS token structure')
      return payload
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
  const token = req.cookies.get('auth-jwt')?.value

  let isAuthenticated

  if (token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/token/verify/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
      isAuthenticated = true
    } catch (error: any) {
      isAuthenticated = false
    }
  }

  // let isAuthenticated

  // if (token) {
  //   const payload = await verifyJWT(token)
  //   isAuthenticated = !!payload

  //   // If JWT verification fails, clear the invalid token and redirect to auth
  //   if (!isAuthenticated && token.includes('.')) {
  //     const response = NextResponse.redirect(new URL('/auth', req.url))
  //     response.cookies.delete('ff-token')
  //     response.cookies.delete('ff-refresh-token')
  //     return response
  //   }
  // }

  // // Handle auth pages - redirect authenticated users away
  if (path.startsWith('/auth')) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    } else {
      return NextResponse.next()
    }
  }

  // // Handle protected pages - redirect unauthenticated users to auth
  if (path.startsWith('/dashboard') || path.startsWith('/cart') || path.startsWith('/f')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/auth', req.url))
    } else {
      const res = NextResponse.next()

      res.headers.set('X-Frame-Options', 'DENY')
      res.headers.set('X-Content-Type-Options', 'nosniff')
      res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
      res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()')
      res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')

      return res
    }
  }
  // return NextResponse.next()
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
