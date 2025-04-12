import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/app/models/Patient';
import Appointment from '@/app/models/Appointment';
import User from '@/app/models/User';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  await dbConnect();
  
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    
    // Validate doctor ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid doctor ID',
          message: 'Doctor ID must be a valid 24-character identifier'
        },
        { status: 400 }
      );
    }

    // Get and validate query parameters
    const limit = Math.min(parseInt(searchParams.get('limit')) || 20, 100);
    const page = parseInt(searchParams.get('page')) || 1;
    const search = searchParams.get('search') || '';
    const sortField = searchParams.get('sortField') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const status = searchParams.get('status') || ''; // active, inactive, etc.
    const hasAppointments = searchParams.get('hasAppointments'); // true/false

    // Build the base query
    const query = { 
      doctor: new mongoose.Types.ObjectId(id),
      isDeleted: { $ne: true } // Exclude soft-deleted patients
    };

    // Add search filter if provided
    if (search) {
      query.$or = [
        { 'user.name': { $regex: search, $options: 'i' } },
        { 'user.email': { $regex: search, $options: 'i' } },
        { 'user.phone': { $regex: search, $options: 'i' } },
        { 'medicalRecordNumber': { $regex: search, $options: 'i' } }
      ];
    }

    // Add status filter
    if (status === 'active') {
      query.lastVisitDate = { $gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) }; // Active within last 6 months
    } else if (status === 'inactive') {
      query.$or = [
        { lastVisitDate: { $lt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) } },
        { lastVisitDate: { $exists: false } }
      ];
    }

    // Filter by appointment status
    if (hasAppointments === 'true') {
      query.hasAppointments = true;
    } else if (hasAppointments === 'false') {
      query.hasAppointments = { $ne: true };
    }

    // Get patients with pagination and population
    const [patients, total] = await Promise.all([
      Patient.find(query)
        .populate({
          path: 'user',
          select: 'name email phone gender dateOfBirth profilePicture',
          model: User
        })
        .sort({ [sortField]: sortOrder === 'asc' ? 1 : -1 })
        .limit(limit)
        .skip((page - 1) * limit)
        .lean(),
      
      Patient.countDocuments(query)
    ]);

    // Get additional patient data in parallel
    const enhancedPatients = await Promise.all(
      patients.map(async (patient) => {
        const [lastAppointment, appointmentCount, prescriptions] = await Promise.all([
          // Last appointment
          Appointment.findOne({ patient: patient._id })
            .sort({ appointmentDate: -1 })
            .select('appointmentDate status type')
            .lean(),
          
          // Appointment count
          Appointment.countDocuments({ patient: patient._id }),
          
          // Recent prescriptions (last 3)
          mongoose.models.Prescription?.find({ patient: patient._id })
            .sort({ date: -1 })
            .limit(3)
            .select('medication date')
            .lean() || []
        ]);

        return {
          id: patient._id,
          user: {
            name: patient.user?.name,
            email: patient.user?.email,
            phone: patient.user?.phone,
            gender: patient.user?.gender,
            dob: patient.user?.dateOfBirth,
            avatar: patient.user?.profilePicture
          },
          medicalInfo: {
            history: patient.medicalHistory?.slice(0, 3) || [], // Show first 3 items
            allergies: patient.allergies?.slice(0, 3) || []
          },
          stats: {
            totalAppointments: appointmentCount,
            lastVisit: lastAppointment?.appointmentDate,
            lastVisitStatus: lastAppointment?.status,
            lastVisitType: lastAppointment?.type,
            prescriptionCount: prescriptions.length
          },
          recentPrescriptions: prescriptions.map(p => ({
            date: p.date,
            medications: p.medication?.slice(0, 2).map(m => m.name) || [] // Show first 2 meds
          })),
          createdAt: patient.createdAt,
          updatedAt: patient.updatedAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enhancedPatients,
      meta: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit,
        hasMore: page * limit < total,
        filters: {
          search,
          status,
          hasAppointments,
          sort: {
            field: sortField,
            order: sortOrder
          }
        }
      }
    });

  } catch (error) {
    console.error('Error fetching patients:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Server Error',
        message: 'Failed to fetch patient data',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}