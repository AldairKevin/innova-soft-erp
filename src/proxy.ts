import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/login";

  const isProtected =
    pathname.startsWith("/dashboard");

  // NO logueado
  if (!token && isProtected) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  // Tiene token
  if (token) {
    try {
      jwt.verify(token, JWT_SECRET);

      // si ya inició sesión
      // y entra a login
      if (isLogin) {
        return NextResponse.redirect(
          new URL("/dashboard", req.url)
        );
      }

    } catch (error) {

      const response = NextResponse.redirect(
        new URL("/login", req.url)
      );

      response.cookies.delete("token");

      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
  ],
};