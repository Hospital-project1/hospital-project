import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Appointment from '@/app/models/Appointment';

// Get single appointment
export async function GET(request, { params }) {
  try {
    await dbConnect();
    const appointment = await Appointment.findById(params.id)
      .populate('patient', 'name email phone')
      .populate('doctor', 'name specialization');
      
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Update appointment
export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    
    const appointment = await Appointment.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    }).populate('patient doctor');
    
    if (!appointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: appointment });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// Delete appointment
export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const deletedAppointment = await Appointment.findByIdAndDelete(params.id);
    
    if (!deletedAppointment) {
      return NextResponse.json({ success: false, error: 'Appointment not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}