import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const routeRules = [
  { matcher: /^\/dashboard/, authRequired: true },
  { matcher: /^\/admin/, authRequired: true, roles: ['admin'] },
  { matcher: /^\/login/, authRequired: false },
  { matcher: /^\/register/, authRequired: false },
]

async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'dev_jwt_secret')
    console.log(secret)
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch {
    return null
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname
  console.log('🔒 Middleware running for path:', path)
  
  const rule = routeRules.find((r) => r.matcher.test(path))
  console.log('🔍 Found rule:', rule)
  
  if (!rule) {
    console.log('✅ No rule found, allowing request')
    return NextResponse.next()
  }

  if (rule.authRequired) {
    console.log('🚫 Auth required, redirecting to /auth')
    // For now, redirect all dashboard requests to auth page
    // In production, you'd check for valid JWT tokens
    const authUrl = new URL('/auth', req.url)
    return NextResponse.redirect(authUrl)
  }

  const res = NextResponse.next()
  res.headers.set('X-Frame-Options', 'DENY')
  res.headers.set('X-Content-Type-Options', 'nosniff')
  res.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  res.headers.set('Permissions-Policy', 'geolocation=(), microphone=()')
  res.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
  return res
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|api/public).*)'],
}
