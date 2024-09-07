// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const url = request.nextUrl.clone();

  // Check for user authentication (example using cookies)
  const token = request.cookies.get('authToken'); // Replace 'authToken' with your actual cookie name

  // Redirect root path (/) to /home
  if (url.pathname === '/') {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Define paths that don't require authentication
  const publicPaths = ['/login']; // Add other public paths here

  // Check if the request path requires authentication
  if (!publicPaths.includes(url.pathname)) {
    // If no token is found, redirect to the login page
    if (!token) {
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  // Continue to the next middleware or route
  return NextResponse.next();
}

// Specify which paths this middleware applies to
export const config = {
  matcher: ['/', '/home/:path*', '/login/:path*'], // Apply to these paths
};