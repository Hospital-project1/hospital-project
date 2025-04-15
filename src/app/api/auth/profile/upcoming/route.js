import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';
import Doctor from '@/app/models/Doctor';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

async function verifyToken(req) {
  const cookies = req.cookies.get('token'); 
  if (!cookies) {
    return { success: false, message: 'No token provided', status: 401 };
  }

  const token = cookies.value;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, message: 'Invalid or expired token', status: 401 };
  }
}

export async function GET(req) {
  try {
    await dbConnect();

    const { success, decoded, message, status } = await verifyToken(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'patient') {
      return NextResponse.json(
        { success: false, message: 'Only patients can view appointments' },
        { status: 403 }
      );
    }

    const currentDate = new Date();

    const appointments = await Appointment.find({
      patient: user._id,
      appointmentDate: { $gte: currentDate },
      status: { $in: ['pending', 'confirmed'] }
    })
    .populate({
      path: 'doctor',
      select: 'user specialty',
      populate: {
        path: 'user',
        select: 'name'
      }
    })
    .sort({ appointmentDate: 1 })
    .lean();

    // Format the response data
    const formattedAppointments = appointments.map(appointment => ({
      id: appointment._id,
      doctor: {
        name: appointment.doctor?.user?.name || 'Unknown Doctor',
        specialty: appointment.doctor?.specialty || 'General',
      },
      appointmentDate: appointment.appointmentDate,
      appointmentType: appointment.appointmentType,
      status: appointment.status,
      reason: appointment.reason,
      paymentStatus: appointment.paymentStatus
    }));

    return NextResponse.json(
      { 
        success: true, 
        appointments: formattedAppointments 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      { success: false, message: 'Server error while fetching appointments' },
      { status: 500 }
    );
  }
}