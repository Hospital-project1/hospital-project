import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';

export async function POST() {
  try {
    await dbConnect();
    // Clear the cookie by setting an empty token with an immediate expiration
    const response = NextResponse.json(
      { success: true, message: 'successfully logged out ' },
      { status: 200 }
    );
    response.cookies.set('token', '', { maxAge: 0 });
    return response;
  } catch (error) {
    console.error('Logout Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
