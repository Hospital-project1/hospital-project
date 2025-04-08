import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';
import Patient from '@/app/models/Patient';
import Doctor from '@/app/models/Doctor';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

// الحصول على جميع المواعيد
export async function GET(request) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    
    let query = {};
    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;
    
    const appointments = await Appointment.find(query)
      .populate('patient', 'name email')
      .populate('doctor', 'name specialization')
      .sort({ appointmentDate: 1 });
      
    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// إنشاء موعد جديد
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // 1. الحصول على التوكن من الكوكيز
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'يجب تسجيل الدخول أولاً' },
        { status: 401 }
      );
    }

    // 2. فك تشفير التوكن
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: 'توكن غير صالح أو منتهي الصلاحية' },
        { status: 401 }
      );
    }

    // 3. التحقق من أن المستخدم مريض
    if (decoded.role !== 'patient') {
      return NextResponse.json(
        { success: false, error: 'فقط المرضى يمكنهم حجز المواعيد' },
        { status: 403 }
      );
    }

    // 4. استخدام اسم المريض من التوكن مباشرة
    const appointmentData = {
      ...body,
      patient: decoded.userId,  // رقم المريض من التوكن
      patientName: decoded.name, // اسم المريض من التوكن مباشرة
      status: 'pending' // الحالة الافتراضية
    };

    // 5. التحقق من الحقول المطلوبة
    if (!appointmentData.doctor || !appointmentData.appointmentDate) {
      return NextResponse.json(
        { success: false, error: 'الطبيب وتاريخ الموعد مطلوبان' },
        { status: 400 }
      );
    }

    // 6. إنشاء الموعد
    const appointment = await Appointment.create(appointmentData);
    
    return NextResponse.json(
      { 
        success: true, 
        data: appointment,
        message: 'تم إنشاء الموعد بنجاح'
      }, 
      { status: 201 }
    );

  } catch (error) {
    console.error('خطأ في إنشاء الموعد:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'فشل في إنشاء الموعد' 
      }, 
      { status: 400 }
    );
  }
}