import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('firebaseIdToken');
  const { pathname } = request.nextUrl;

  const authenticatedRoutes = ['/dashboard'];
  const unauthenticatedRoutes = ['/login', '/signup'];

  // If user is authenticated
  if (token) {
    // If user tries to access login or signup page, redirect to dashboard
    if (unauthenticatedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  } else { // If user is not authenticated
    // If user tries to access a protected route, redirect to login
    if (authenticatedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
}
