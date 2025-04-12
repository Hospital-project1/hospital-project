import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  // Check if the request is for dashboard routes
  const isDashboardRoute = req.nextUrl.pathname.startsWith('/dashboard');
  
  // Check if the request is for protected API routes
  const isProtectedApiRoute = req.nextUrl.pathname.startsWith('/api/auth/profile') || 
                             req.nextUrl.pathname.startsWith('/api/auth/me');
  
  // For dashboard routes, check admin access
  if (isDashboardRoute) {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', req.url);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Check if user has admin role
      if (decoded.role !== 'admin') {
        // Redirect non-admin users to home or unauthorized page
        return NextResponse.redirect(new URL('/', req.url));
      }
      
      // Attach user info to request
      req.user = decoded;
      return NextResponse.next();
    } catch (error) {
      // Redirect to login on invalid token
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // For protected API routes, use your existing logic
  if (isProtectedApiRoute) {
    const token = req.cookies.get('token')?.value;
    
    if (!token) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  }
  
  // For all other routes, proceed normally
  return NextResponse.next();
}

// Updated matcher to include both API routes and dashboard routes
export const config = {
  matcher: [
    '/api/auth/profile/:path*', 
    '/api/auth/me/:path*',
    '/dashboard/:path*'
  ],
};