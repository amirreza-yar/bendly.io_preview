import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeJwt } from "jose";

const onRedirectToLogin = async (req: NextRequest) => {
  console.log("redirected to login");
  const res = NextResponse.redirect(new URL("/auth", req.url));

  res.cookies.set("auth-jwt", "", { path: "/", maxAge: 0 });
  res.cookies.set("auth-refresh-jwt", "", { path: "/", maxAge: 0 });
  return res;
};

const onRefreshToken = async (req: NextRequest) => {
  const refreshUrl = new URL(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/token/refresh/`,
    req.url
  );

  const refreshRes = await fetch(refreshUrl.toString(), {
    method: "POST",
    headers: {
      Cookie: req.headers.get("cookie") ?? "",
    },
  });

  if (refreshRes.ok) {
    const setCookieHeaders = refreshRes.headers.get("set-cookie");

    const res = NextResponse.next();

    if (setCookieHeaders) {
      const cookies = setCookieHeaders.split(/,(?=[^;]+=[^;]+)/);
      cookies.forEach((c) => {
        const [cookiePart] = c.split(";");
        const [name, value] = cookiePart.split("=");
        if (name && value) {
          res.cookies.set(name.trim(), value.trim(), {
            path: "/",
            httpOnly: true,
            secure: true,
          });
        }
      });
    }
    return res;
  } else {
    return onRedirectToLogin(req);
  }
};

const onVerifyToken = async (token: string, req: NextRequest) => {
  try {
    const payload = decodeJwt(token);
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return false;
    }

    const roles: string[] = Array.isArray(payload.roles)
      ? payload.roles.map(String)
      : [];

    const hasAdminAccess = roles.some((r) => r === "client");

    if (!hasAdminAccess) {
      return onRedirectToLogin(req);
    }

    return true;
    // eslint-disable-next-line
  } catch (err: any) {
    return false;
  }
};

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const token = req.cookies.get("auth-jwt")?.value;
  const refreshToken = req.cookies.get("auth-refresh-jwt")?.value;

  if (!path.startsWith("/") || path === "/") return NextResponse.next();

  let isAuthenticated: boolean = false;

  if (token) {
    const ver = await onVerifyToken(token, req);
    if (ver === true) {
      isAuthenticated = true;
    } else if (ver === false) {
      isAuthenticated = false;
    } else {
      return ver;
    }
  }

  if (!isAuthenticated && refreshToken) {
    try {
      return onRefreshToken(req);
      // eslint-disable-next-line
    } catch (err: any) {
      return onRedirectToLogin(req);
    }
  }

  if (path.startsWith("/auth")) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  }

  if (!isAuthenticated) return onRedirectToLogin(req);

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

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|manifest.js|manifest.webmanifest|sw.js|images|.*\\.svg$).*)",
  ],
};
