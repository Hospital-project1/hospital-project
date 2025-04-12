import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Doctor from '@/app/models/Doctor';
import Patient from '@/app/models/Patient';
import Appointment from '@/app/models/Appointment';
import Prescription from '@/app/models/Prescription';
import User from '@/app/models/User'; 
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const id = params?.id;
    console.log('Received doctor ID:', id);

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid doctor ID',
          message: 'Please provide a valid 24-character doctor ID'
        },
        { status: 400 }
      );
    }

    const doctorId = new mongoose.Types.ObjectId(id);

    const [
      doctor, 
      patientCount, 
      appointmentStats,
      recentPatients,
      upcomingAppointments
    ] = await Promise.all([
      Doctor.findById(doctorId)
        .populate({
          path: 'user',
          model: 'User',
          select: 'name email phone profilePicture'
        })
        .populate({
          path: 'specialty',
          select: 'name'
        }),
      
      Patient.countDocuments({ doctor: doctorId }),
      
      Appointment.aggregate([
        { $match: { doctor: doctorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      Patient.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'user',
          model: 'User',
          select: 'name email phone profilePicture'
        }),
      
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
        populate: {
          path: 'user',
          model: 'User',
          select: 'name profilePicture'
        }
      })
    ]);

    let recentPrescriptions = [];
    try {
      recentPrescriptions = await Prescription.find({ doctor: doctorId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate({
          path: 'patient',
          populate: {
            path: 'user',
            model: 'User',
            select: 'name'
          }
        });
    } catch (prescriptionError) {
      console.warn('Could not fetch prescriptions:', prescriptionError.message);
    }

    if (!doctor) {
      return NextResponse.json(
        { success: false, error: 'Doctor not found' },
        { status: 404 }
      );
    }

    const statusStats = appointmentStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    const totalAppointments = Object.values(statusStats).reduce((a, b) => a + b, 0);

    const overviewData = {
      doctorInfo: {
        id: doctor._id,
        name: doctor.user.name,
        email: doctor.user.email,
        phone: doctor.user.phone,
        profilePicture: doctor.user.profilePicture,
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
        name: patient.user.name,
        email: patient.user.email,
        phone: patient.user.phone,
        profilePicture: patient.user.profilePicture,
        lastVisit: patient.createdAt
      })),
      upcomingAppointments: upcomingAppointments.map(appt => ({
        id: appt._id,
        patientName: appt.patient.user.name,
        patientAvatar: appt.patient.user.profilePicture,
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

    return NextResponse.json({
      success: true,
      data: overviewData
    });

  } catch (error) {
    console.error('Doctor overview error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: error.message 
      },
      { status: 500 }
    );
  }
}