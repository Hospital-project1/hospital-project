// // import { NextResponse } from 'next/server';
// // import dbConnect from '@/lib/dbConnect';
// // import Doctor from '@/app/models/Doctor';
// // import Patient from '@/app/models/Patient';
// // import Appointment from '@/app/models/Appointment';
// // import Prescription from '@/app/models/Prescription';
// // import User from '@/app/models/User'; 
// // import mongoose from 'mongoose';


// // async function getParams(request) {
// //   const { id } = await request.params;
// //   return { id };
// // }
// // export async function GET(request) {
 
  
// //   try {
// //     await dbConnect();
// //     const { id } = await getParams(request);
// //     console.log('Received doctor ID:', id);

// //     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
// //       return NextResponse.json(
// //         { 
// //           success: false, 
// //           error: 'Invalid doctor ID',
// //           message: 'Please provide a valid 24-character doctor ID'
// //         },
// //         { status: 400 }
// //       );
// //     }

// //     const doctorId = new mongoose.Types.ObjectId(id);

// //     const [
// //       doctor, 
// //       patientCount, 
// //       appointmentStats,
// //       recentPatients,
// //       upcomingAppointments
// //     ] = await Promise.all([
// //       Doctor.findById(doctorId)
// //         .populate({
// //           path: 'user',
// //           model: 'User',
// //           select: 'name email phone profilePicture'
// //         })
// //         .populate({
// //           path: 'specialty',
// //           select: 'name'
// //         }),
      
// //       Patient.countDocuments({ doctor: doctorId }),
      
// //       Appointment.aggregate([
// //         { $match: { doctor: doctorId } },
// //         { $group: { _id: '$status', count: { $sum: 1 } } }
// //       ]),
      
// //       Patient.find({ doctor: doctorId })
// //         .sort({ createdAt: -1 })
// //         .limit(5)
// //         .populate({
// //           path: 'user',
// //           model: 'User',
// //           select: 'name email phone profilePicture'
// //         }),
      
// //       Appointment.find({
// //         doctor: doctorId,
// //         appointmentDate: { 
// //           $gte: new Date(), 
// //           $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
// //         },
// //         status: { $in: ['pending', 'confirmed'] }
// //       })
// //       .sort({ appointmentDate: 1 })
// //       .populate({
// //         path: 'patient',
// //         populate: {
// //           path: 'user',
// //           model: 'User',
// //           select: 'name profilePicture'
// //         }
// //       })
// //     ]);

// //     let recentPrescriptions = [];
// //     try {
// //       recentPrescriptions = await Prescription.find({ doctor: doctorId })
// //         .sort({ createdAt: -1 })
// //         .limit(5)
// //         .populate({
// //           path: 'patient',
// //           populate: {
// //             path: 'user',
// //             model: 'User',
// //             select: 'name'
// //           }
// //         });
// //     } catch (prescriptionError) {
// //       console.warn('Could not fetch prescriptions:', prescriptionError.message);
// //     }

// //     if (!doctor) {
// //       return NextResponse.json(
// //         { success: false, error: 'Doctor not found' },
// //         { status: 404 }
// //       );
// //     }

// //     const statusStats = appointmentStats.reduce((acc, curr) => {
// //       acc[curr._id] = curr.count;
// //       return acc;
// //     }, {});

// //     const totalAppointments = Object.values(statusStats).reduce((a, b) => a + b, 0);

// //     const overviewData = {
// //       doctorInfo: {
// //         id: doctor._id,
// //         name: doctor.user.name,
// //         email: doctor.user.email,
// //         phone: doctor.user.phone,
// //         profilePicture: doctor.user.profilePicture,
// //         specialty: doctor.specialty?.name || 'General Practitioner'
// //       },
// //       stats: {
// //         totalPatients: patientCount,
// //         totalAppointments,
// //         appointmentStatus: statusStats,
// //         upcomingAppointments: upcomingAppointments.length
// //       },
// //       recentPatients: recentPatients.map(patient => ({
// //         id: patient._id,
// //         name: patient.user.name,
// //         email: patient.user.email,
// //         phone: patient.user.phone,
// //         profilePicture: patient.user.profilePicture,
// //         lastVisit: patient.createdAt
// //       })),
// //       upcomingAppointments: upcomingAppointments.map(appt => ({
// //         id: appt._id,
// //         patientName: appt.patient.user.name,
// //         patientAvatar: appt.patient.user.profilePicture,
// //         date: appt.appointmentDate,
// //         time: appt.timeSlot,
// //         type: appt.appointmentType,
// //         status: appt.status
// //       })),
// //       recentPrescriptions: recentPrescriptions.map(pres => ({
// //         id: pres._id,
// //         patientName: pres.patient?.user?.name || 'Unknown',
// //         date: pres.createdAt,
// //         medication: pres.medication ? 
// //           (pres.medication.slice(0, 3).map(m => m.name).join(', ') + 
// //           (pres.medication.length > 3 ? '...' : '')) : 
// //           'No medications'
// //       }))
// //     };

// //     return NextResponse.json({
// //       success: true,
// //       data: overviewData
// //     });

// //   } catch (error) {
// //     console.error('Doctor overview error:', error);
// //     return NextResponse.json(
// //       { 
// //         success: false, 
// //         error: 'Internal server error',
// //         message: error.message 
// //       },
// //       { status: 500 }
// //     );
// //   }
// // }



// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/dbConnect';
// import Doctor from '@/app/models/Doctor';
// import Patient from '@/app/models/Patient';
// import Appointment from '@/app/models/Appointment';
// import Prescription from '@/app/models/Prescription';
// import User from '@/app/models/User'; 
// import mongoose from 'mongoose';

// export async function GET(request, { params }) {
//   try {
//     // 1. الاتصال بقاعدة البيانات
//     await dbConnect();
//     console.log('Database connected successfully');

//     // 2. استخراج معرف الطبيب من params
//     const { id } = params;
//     console.log('Doctor ID received:', id);

//     // 3. التحقق من صحة معرف الطبيب
//     if (!id || !mongoose.Types.ObjectId.isValid(id)) {
//       return NextResponse.json(
//         { 
//           success: false, 
//           error: 'Invalid doctor ID',
//           message: 'The provided doctor ID is not valid'
//         },
//         { status: 400 }
//       );
//     }

//     const doctorId = new mongoose.Types.ObjectId(id);

//     // 4. جلب البيانات المتوازية (Parallel Data Fetching)
//     const [
//       doctor, 
//       patientCount, 
//       appointmentStats,
//       recentPatients,
//       upcomingAppointments
//     ] = await Promise.all([
//       // معلومات الطبيب الأساسية
//       Doctor.findById(doctorId)
//         .populate({
//           path: 'user',
//           select: 'name email phone profilePicture'
//         })
//         .populate({
//           path: 'specialty',
//           select: 'name'
//         })
//         .lean(), // استخدام lean() لتحسين الأداء
      
//       // عدد المرضى
//       Patient.countDocuments({ doctor: doctorId }),
      
//       // إحصائيات المواعيد
//       Appointment.aggregate([
//         { $match: { doctor: doctorId } },
//         { $group: { _id: '$status', count: { $sum: 1 } } }
//       ]),
      
//       // أحدث المرضى (5)
//       Patient.find({ doctor: doctorId })
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .populate({
//           path: 'user',
//           select: 'name email phone profilePicture'
//         })
//         .lean(),
      
//       // المواعيد القادمة (الأسبوع الحالي)
//       Appointment.find({
//         doctor: doctorId,
//         appointmentDate: { 
//           $gte: new Date(), 
//           $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
//         },
//         status: { $in: ['pending', 'confirmed'] }
//       })
//       .sort({ appointmentDate: 1 })
//       .populate({
//         path: 'patient',
//         select: 'user',
//         populate: {
//           path: 'user',
//           select: 'name profilePicture'
//         }
//       })
//       .lean()
//     ]);

//     // 5. جلب الوصفات الطبية الحديثة (مع معالجة الخطأ)
//     let recentPrescriptions = [];
//     try {
//       recentPrescriptions = await Prescription.find({ doctor: doctorId })
//         .sort({ createdAt: -1 })
//         .limit(5)
//         .populate({
//           path: 'patient',
//           select: 'user',
//           populate: {
//             path: 'user',
//             select: 'name'
//           }
//         })
//         .lean();
//     } catch (prescriptionError) {
//       console.error('Prescription fetch error:', prescriptionError.message);
//     }

//     // 6. التحقق من وجود الطبيب
//     if (!doctor) {
//       return NextResponse.json(
//         { success: false, error: 'Doctor not found' },
//         { status: 404 }
//       );
//     }

//     // 7. معالجة إحصائيات المواعيد
//     const statusStats = appointmentStats.reduce((acc, curr) => {
//       acc[curr._id] = curr.count;
//       return acc;
//     }, {});

//     const totalAppointments = Object.values(statusStats).reduce((a, b) => a + b, 0);

//     // 8. بناء كائن الاستجابة
//     const overviewData = {
//       doctorInfo: {
//         id: doctor._id,
//         name: doctor.user?.name || 'Unknown',
//         email: doctor.user?.email || '',
//         phone: doctor.user?.phone || '',
//         profilePicture: doctor.user?.profilePicture || '',
//         specialty: doctor.specialty?.name || 'General Practitioner'
//       },
//       stats: {
//         totalPatients: patientCount,
//         totalAppointments,
//         appointmentStatus: statusStats,
//         upcomingAppointments: upcomingAppointments.length
//       },
//       recentPatients: recentPatients.map(patient => ({
//         id: patient._id,
//         name: patient.user?.name || 'Unknown',
//         email: patient.user?.email || '',
//         phone: patient.user?.phone || '',
//         profilePicture: patient.user?.profilePicture || '',
//         lastVisit: patient.createdAt
//       })),
//       upcomingAppointments: upcomingAppointments.map(appt => ({
//         id: appt._id,
//         patientName: appt.patient?.user?.name || 'Unknown',
//         patientAvatar: appt.patient?.user?.profilePicture || '',
//         date: appt.appointmentDate,
//         time: appt.timeSlot,
//         type: appt.appointmentType,
//         status: appt.status
//       })),
//       recentPrescriptions: recentPrescriptions.map(pres => ({
//         id: pres._id,
//         patientName: pres.patient?.user?.name || 'Unknown',
//         date: pres.createdAt,
//         medication: pres.medication ? 
//           (pres.medication.slice(0, 3).map(m => m.name).join(', ') + 
//           (pres.medication.length > 3 ? '...' : '')) : 
//           'No medications'
//       }))
//     };

//     // 9. إرسال الاستجابة الناجحة
//     return NextResponse.json({
//       success: true,
//       data: overviewData
//     });

//   } catch (error) {
//     // 10. معالجة الأخطاء المركزية
//     console.error('Doctor Overview API Error:', {
//       message: error.message,
//       stack: error.stack,
//       timestamp: new Date().toISOString()
//     });

//     return NextResponse.json(
//       { 
//         success: false, 
//         error: 'Internal server error',
//         message: process.env.NODE_ENV === 'development' 
//           ? error.message 
//           : 'Please try again later'
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Doctor from '@/app/models/Doctor';
import Patient from '@/app/models/Patient';
import Appointment from '@/app/models/Appointment';
import Prescription from '@/app/models/Prescription';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    // 1. الاتصال بقاعدة البيانات
    await dbConnect();
    console.log('Database connected successfully');

    // 2. استخراج معرف الطبيب من params (ننتظر params قبل استخدامه)
    const { id } = params;
    console.log('Doctor ID received:', id);

    // 3. التحقق من صحة معرف الطبيب
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid doctor ID',
          message: 'The provided doctor ID is not valid'
        },
        { status: 400 }
      );
    }

    const doctorId = new mongoose.Types.ObjectId(id);

    // 4. جلب البيانات المتوازية (Parallel Data Fetching)
    const [
      doctor, 
      patientCount, 
      appointmentStats,
      recentPatients,
      upcomingAppointments
    ] = await Promise.all([
      // معلومات الطبيب الأساسية
      Doctor.findById(doctorId)
        .populate({
          path: 'user',
          select: 'name email phone profilePicture'
        })
        .populate({
          path: 'specialty',
          select: 'name'
        })
        .lean(), // استخدام lean() لتحسين الأداء
      
      // عدد المرضى
      Patient.countDocuments({ doctor: doctorId }),
      
      // إحصائيات المواعيد
      Appointment.aggregate([
        { $match: { doctor: doctorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // أحدث المرضى (5)
      Patient.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'user',
          select: 'name email phone profilePicture'
        })
        .lean(),
      
      // المواعيد القادمة (الأسبوع الحالي)
      Appointment.find({
        doctor: doctorId,
        appointmentDate: { 
          $gte: new Date(), 
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
        },
        status: { $in: ['pending', 'confirmed'] }
      })
      .sort({ appointmentDate: 1 })
      .populate({
        path: 'patient',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name profilePicture'
        }
      })
      .lean()
    ]);

    // 5. جلب الوصفات الطبية الحديثة (مع معالجة الخطأ)
    let recentPrescriptions = [];
    try {
      recentPrescriptions = await Prescription.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'patient',
          select: 'user',
          populate: {
            path: 'user',
            select: 'name'
          }
        })
        .lean();
    } catch (prescriptionError) {
      console.error('Prescription fetch error:', prescriptionError.message);
    }

    // 6. التحقق من وجود الطبيب
    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // 7. معالجة إحصائيات المواعيد
    const statusStats = appointmentStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalAppointments = Object.values(statusStats).reduce((a, b) => a + b, 0);

    // 8. بناء كائن الاستجابة
    const overviewData = {
      doctorInfo: {
        id: doctor._id,
        name: doctor.user?.name || 'Unknown',
        email: doctor.user?.email || '',
        phone: doctor.user?.phone || '',
        profilePicture: doctor.user?.profilePicture || '',
        specialty: doctor.specialty?.name || 'General Practitioner'
      },
      stats: {
        totalPatients: patientCount,
        totalAppointments,
        appointmentStatus: statusStats,
        upcomingAppointments: upcomingAppointments.length
      },
      recentPatients: recentPatients.map(patient => ({
        id: patient._id,
        name: patient.user?.name || 'Unknown',
        email: patient.user?.email || '',
        phone: patient.user?.phone || '',
        profilePicture: patient.user?.profilePicture || '',
        lastVisit: patient.createdAt
      })),
      upcomingAppointments: upcomingAppointments.map(appt => ({
        id: appt._id,
        patientName: appt.patient?.user?.name || 'Unknown',
        patientAvatar: appt.patient?.user?.profilePicture || '',
        date: appt.appointmentDate,
        time: appt.timeSlot,
        type: appt.appointmentType,
        status: appt.status
      })),
      recentPrescriptions: recentPrescriptions.map(pres => ({
        id: pres._id,
        patientName: pres.patient?.user?.name || 'Unknown',
        date: pres.createdAt,
        medication: pres.medication ? 
          (pres.medication.slice(0, 3).map(m => m.name).join(', ') + 
          (pres.medication.length > 3 ? '...' : '')) : 
          'No medications'
      }))
    };

    // 9. إرسال الاستجابة الناجحة
    return NextResponse.json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    // 10. معالجة الأخطاء المركزية
    console.error('Doctor Overview API Error:', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' 
          ? error.message 
          : 'Please try again later'
      },
      { status: 500 }
    );
  }
}
