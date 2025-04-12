// app/api/doctors/[id]/appointments/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';

export async function GET(request, { params }) {
  await connectDB();
  
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 10;

    const query = { doctor: params.id };
    if (status) query.status = status;

    const appointments = await Appointment.find(query)
      .populate({
        path: 'patient',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name phone'
        }
      })
      .sort({ appointmentDate: 1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم' },
      { status: 500 }
    );
  }
}