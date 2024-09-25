/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from "jwt-decode"; // Consider switching to a server-side library like jsonwebtoken
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Middleware function
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token");
  const { pathname } = req.nextUrl;

  // If there's no token and the user is trying to access a protected route
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is already logged in, prevent them from accessing login or register
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token) {
    console.log("from if", pathname, "line 21");
    try {
      const decodedData = jwtDecode(token.value as string) as any;
      // Check if user role is "user" and protect certain routes
      if (
        decodedData?.role !== "admin" &&
        (pathname === "/dashboard/products/add-product" ||
          pathname === "/dashboard/products" ||
          pathname === "/dashboard/orders")
      ) {
        return NextResponse.redirect(new URL("/dashboard/myorder", req.url));
      }

      // Check if user role is "admin" and protect certain routes
      if (decodedData?.role !== "user" && pathname === "/dashboard/myorder") {
        return NextResponse.redirect(new URL("/dashboard/products", req.url));
      }
    } catch (error) {
      console.error("Error decoding token", error);
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"], // Apply the middleware to these routes
};
