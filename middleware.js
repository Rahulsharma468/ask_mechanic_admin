// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();
  
  // Redirect root path (/) to /home
  if (url.pathname === '/') {
    url.pathname = '/home';
    return NextResponse.redirect(url);
  }

  // Continue to the next middleware or route
  return NextResponse.next();
}

// Specify which paths this middleware applies to
export const config = {
  matcher: ['/', '/home/:path*'], // Apply to root and home paths
};