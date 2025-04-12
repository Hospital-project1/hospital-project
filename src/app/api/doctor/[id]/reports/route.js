// app/api/reports/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import MedicalReport from '@/app/models/MedicalReport';

export async function POST(request) {
  await dbConnect();
  
  try {
    const { doctorId, patientId, ...reportData } = await request.json();
    
    // التحقق من البيانات المطلوبة
    if (!doctorId || !patientId || !reportData.title || !reportData.details) {
      return NextResponse.json(
        { success: false, error: 'الحقول المطلوبة ناقصة' },
        { status: 400 }
      );
    }

    const newReport = await MedicalReport.create({
      doctor: doctorId,
      patient: patientId,
      ...reportData
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
    console.error('خطأ في إنشاء التقرير:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في الخادم',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();
  
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');
    const patientId = searchParams.get('patientId');
    const reportType = searchParams.get('type');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;

    // بناء كائن البحث
    const query = {};
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;
    if (reportType) query.reportType = reportType;

    const [reports, total] = await Promise.all([
      MedicalReport.find(query)
        .populate('doctor', 'name specialty')
        .populate('patient', 'name phone')
        .sort({ date: -1 })
        .skip((page - 1) * limit)
        .limit(limit),
      
      MedicalReport.countDocuments(query)
    ]);

    return NextResponse.json({
      success: true,
      data: reports,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    console.error('خطأ في جلب التقارير:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'خطأ في الخادم',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}