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
  const token = req.cookies.get('auth_token')?.value ?? ''

  const rule = routeRules.find((r) => r.matcher.test(path))
  if (!rule) return NextResponse.next()

  if (rule.authRequired) {
    const user = token ? await verifyJWT(token) : null

    if (!user) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', req.url)
      return NextResponse.redirect(loginUrl)
    }

    // Check role-based access
    if (rule.roles && !rule.roles.includes(user.roleId)) {
      // Redirect to unauthorized page
      const unauthorizedUrl = new URL('/unauthorized', req.url)
      return NextResponse.redirect(unauthorizedUrl)
    }
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
