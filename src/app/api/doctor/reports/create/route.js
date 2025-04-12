// app/api/reports/create/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/dbConnect';
import MedicalReport from '@/app/models/MedicalReport';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await connectDB();
  
  try {
    // التحقق من التوكن
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }

    // فك تشفير التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // التحقق من أن المستخدم طبيب
    if (decoded.role !== 'doctor') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Doctors only' },
        { status: 403 }
      );
    }

    const { patientId, content } = await request.json();

    // إنشاء التقرير
    const newReport = await MedicalReport.create({
      doctor: decoded.userId, // يستخدم doctorId من التوكن مباشرة
      patient: patientId,
      content,
      date: new Date()
    });

    return NextResponse.json(
      { 
        success: true,
        data: newReport,
        message: 'تم إنشاء التقرير بنجاح'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Server error' },
      { status: 500 }
    );
  }
}