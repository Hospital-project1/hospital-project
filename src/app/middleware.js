import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(req) {
  const token = req.cookies.get('token'); 
  if (!token) {

    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 

    return NextResponse.next(); 
  } catch (error) {

    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
  }
}

// Define which paths this middleware will apply to
export const config = {
  matcher: ['/api/auth/profile/*', '/api/auth/me/*'], 
};
