import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect'; // adjust path if needed

export async function GET() {
  try {
    await dbConnect();
    // If we made it here, the connection is established
    return NextResponse.json({ message: 'DB connection successful!..🥭' });
  } catch (err) {
    console.error('Error connecting to DB:', err);
    return NextResponse.json(
      { message: 'DB connection failed', error: err.message },
      { status: 500 }
    );
  }
}
