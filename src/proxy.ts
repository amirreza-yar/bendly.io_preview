import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  console.log("🔒 Middleware running for path:", path);

  // First, check if user has valid token
  const token = req.cookies.get("auth-jwt")?.value;
  const sessionToken = req.cookies;

  const cookieStore = cookies();

  let isAuthenticated;

  console.log(token, (await cookieStore).get("auth-jwt"));

  if (token) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/token/verify/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        }
      );
      isAuthenticated = true;
    } catch (error: any) {
      isAuthenticated = false;
    }
  }

  if (token) {
    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SIGNING_KEY)
      );

      // console.log(res);
      isAuthenticated = true;
    } catch (err: any) {
      // console.log(err);
      isAuthenticated = false;
    }
  }

  if (path.startsWith("/auth")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.next();
    }
  }

  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/cart") ||
    path.startsWith("/f")
  ) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/auth", req.url));
    } else {
      const res = NextResponse.next();

      res.headers.set("X-Frame-Options", "DENY");
      res.headers.set("X-Content-Type-Options", "nosniff");
      res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      res.headers.set("Permissions-Policy", "geolocation=(), microphone=()");
      res.headers.set(
        "Strict-Transport-Security",
        "max-age=63072000; includeSubDomains; preload"
      );

      return res;
    }
  }

  // return NextResponse.next();
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
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
