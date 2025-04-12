import { NextResponse } from 'next/server';
import  dbConnect from '@/lib/dbConnect';
import Doctor from '@/app/models/Doctor';
import Patient from '@/app/models/Patient';
import Appointment from '@/app/models/Appointment';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    // 1. جلب التوكن من الكوكيز (باستخدام await)
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    // 2. التحقق من وجود التوكن
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - لا يوجد توكن' },
        { status: 401 }
      );
    }

    // 3. فك تشفير التوكن مع معالجة الأخطاء
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return NextResponse.json(
          { success: false, error: 'انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى' },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'توكن غير صالح' },
        { status: 401 }
      );
    }

    // 4. التحقق من الصلاحية (طبيب أو مدير)
    if (decoded.role !== 'doctor' && decoded.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'غير مصرح - صلاحيات غير كافية' },
        { status: 403 }
      );
    }

    // 5. استخدام رقم الطبيب من الرابط
    const doctorId = params.id;

    // التحقق من صحة معرف الطبيب
    if (!doctorId || doctorId.length !== 24) {
      return NextResponse.json(
        { success: false, error: 'معرف الطبيب غير صالح' },
        { status: 400 }
      );
    }

    // 6. جلب بيانات الطبيب من قاعدة البيانات
    const doctor = await Doctor.findById(doctorId)
      .populate('user', 'name email phone')
      .populate('specialty', 'name');

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'الطبيب غير موجود' },
        { status: 404 }
      );
    }

    // 7. جلب المرضى والمواعيد
    const [patients, appointments] = await Promise.all([
      Patient.find({ doctor: doctorId })
        .populate('user', 'name phone')
        .limit(5),
      Appointment.find({
        doctor: doctorId,
        appointmentDate: { $gte: new Date() }
      })
      .populate('patient', 'user')
      .sort({ appointmentDate: 1 })
      .limit(5)
    ]);

    return NextResponse.json({
      success: true,
      data: { doctor, patients, appointments }
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { success: false, error: 'خطأ في الخادم الداخلي' },
      { status: 500 }
    );
  }
}