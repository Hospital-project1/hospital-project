import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Doctor from '@/app/models/Doctor';

// GET /api/doctors/availability?doctorId=...
export async function GET(request) {
  try {
    await dbConnect();

    // استخراج doctorId من query parameters
    const { searchParams } = new URL(request.url);
    const doctorId = searchParams.get('doctorId');

    if (!doctorId) {
      return NextResponse.json(
        { success: false, error: 'Doctor ID is required' },
        { status: 400 }
      );
    }

    // جلب بيانات الطبيب مع الحقول المطلوبة فقط
    const doctor = await Doctor.findById(doctorId)
      .select('availability -_id');

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // استخراج جميع الفترات الزمنية المتاحة
    const allTimeSlots = doctor.availability.map(item => item.timeSlot);

    return NextResponse.json({
      success: true,
      data: {
        timeSlots: allTimeSlots,
        days: [...new Set(doctor.availability.map(item => item.day))] // الأيام الفريدة
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}



///////////////////////////////////////
// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Doctor from '@/app/models/Doctor';

// // GET /api/doctors/[id]/availability
// export async function GET(request, context) {
//   try {
//     await dbConnect();

//     const { id } = context.params;

//     // جلب بيانات الطبيب مع الحقول المطلوبة فقط
//     const doctor = await Doctor.findById(id)
//       .select('availability -_id');

//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, error: 'Doctor not found' },
//         { status: 404 }
//       );
//     }

//     // استخراج جميع الفترات الزمنية المتاحة
//     const allTimeSlots = doctor.availability.map(item => item.timeSlot);

//     return NextResponse.json({
//       success: true,
//       data: {
//         timeSlots: allTimeSlots,
//         days: [...new Set(doctor.availability.map(item => item.day))] // الأيام الفريدة
//       }
//     });

//   } catch (error) {
//     return NextResponse.json(
//       { success: false, error: error.message },
//       { status: 400 }
//     );
//   }
// }
