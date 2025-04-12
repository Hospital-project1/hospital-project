
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';
import Patient from '@/app/models/Patient';
import Doctor from '@/app/models/Doctor';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await dbConnect();

  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Get and validate query parameters
    const limit = Math.min(parseInt(searchParams.get('limit')) || 10, 50);
    const page = parseInt(searchParams.get('page')) || 1;
    const status = searchParams.get('status') || 'upcoming';
    const sort = searchParams.get('sort') || 'appointmentDate';
    const search = searchParams.get('search') || '';
    const appointmentType = searchParams.get('type') || '';

    // Validate doctor ID
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid doctor ID format' },
        { status: 400 }
      );
    }

    // Build base query
    const query = { doctor: new mongoose.Types.ObjectId(id) };
    
    // Date filters based on status
    const now = new Date();
    switch (status) {
      case 'upcoming':
        query.appointmentDate = { $gte: now };
        query.status = { $in: ['pending', 'confirmed'] };
        break;
      case 'past':
        query.appointmentDate = { $lt: now };
        query.status = { $nin: ['canceled'] };
        break;
      case 'today':
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        query.appointmentDate = { $gte: startOfDay, $lte: endOfDay };
        query.status = { $in: ['pending', 'confirmed'] };
        break;
      default:
        // Specific status filter
        if (['pending', 'confirmed', 'canceled', 'completed'].includes(status)) {
          query.status = status;
        }
    }

    // Additional filters
    if (appointmentType && ['clinic', 'video'].includes(appointmentType)) {
      query.appointmentType = appointmentType;
    }

    // Search filter (patient name)
    if (search) {
      const patients = await Patient.find({
        $or: [
          { 'user.name': { $regex: search, $options: 'i' } },
          { 'user.phone': { $regex: search, $options: 'i' } }
        ]
      }).select('_id');
      
      query.patient = { $in: patients.map(p => p._id) };
    }

    // Get appointments with pagination and population
    const appointments = await Appointment.find(query)
      .populate({
        path: 'patient',
        select: 'user',
        populate: {
          path: 'user',
          select: 'name phone profilePicture'
        }
      })
      .populate({
        path: 'doctor',
        select: 'user specialty',
        populate: [
          { path: 'user', select: 'name profilePicture' },
          { path: 'specialty', select: 'name' }
        ]
      })
      .sort({ [sort]: status === 'past' ? -1 : 1 }) // Descending for past appointments
      .limit(limit)
      .skip((page - 1) * limit)
      .lean(); // Convert to plain JS objects

    // Format appointment data
    const formattedAppointments = appointments.map(appt => ({
      id: appt._id,
      date: appt.appointmentDate,
      time: appt.timeSlot,
      type: appt.appointmentType,
      status: appt.status,
      reason: appt.reason,
      meetingLink: appt.meetingLink,
      paymentStatus: appt.paymentStatus,
      patient: {
        id: appt.patient?._id,
        name: appt.patient?.user?.name || 'Unknown',
        phone: appt.patient?.user?.phone || '',
        avatar: appt.patient?.user?.profilePicture || ''
      },
      doctor: {
        id: appt.doctor?._id,
        name: appt.doctor?.user?.name || 'Unknown',
        specialty: appt.doctor?.specialty?.name || 'General',
        avatar: appt.doctor?.user?.profilePicture || ''
      },
      createdAt: appt.createdAt
    }));

    // Get total count for pagination
    const total = await Appointment.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: formattedAppointments,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        status,
        sort,
        hasMore: page * limit < total
      }
    });

  } catch (error) {
    console.error('Appointments error:', error);
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