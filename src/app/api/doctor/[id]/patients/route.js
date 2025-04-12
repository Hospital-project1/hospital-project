// app/api/doctors/[id]/patients/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Patient from '@/app/models/Patient';

export async function GET(request, { params }) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit')) || 20;

    const patients = await Patient.find({ doctor: params.id })
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: patients.length,
      data: patients
    });
  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}