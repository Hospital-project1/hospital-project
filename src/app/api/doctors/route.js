import { NextResponse } from 'next/server';
import connectDB from '../../../lib/dbConnect';
import User from '../../models/User';
import Doctor from '../../models/Doctor';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Handler for POST request to create a new doctor
export async function POST(request) {
  try {
    // Connect to database
    await connectDB();
    
    // Parse request body
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.email || !data.password) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields (name, email, password)' },
        { status: 400 }
      );
    }

    // Validate specialty if provided
    if (data.specialty) {
      const validSpecialties = ["Orthopedist", "Internist", "Dermatologist", "ENT Doctor", "doctor"];
      if (!validSpecialties.includes(data.specialty)) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Invalid specialty value. Must be one of: ' + validSpecialties.join(', ') 
          },
          { status: 400 }
        );
      }
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already in use' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Create user with doctor role
    const newUser = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: 'doctor',
      phone: data.phone || '',
      address: data.address || '',
      profilePicture: data.profilePicture || '',
    });

    // Save user
    const savedUser = await newUser.save();

    // Create doctor profile
    const newDoctor = new Doctor({
      user: savedUser._id,
      specialty: data.specialty || 'doctor', // Use default if not provided
      availability: data.availability || [],
      details: data.details || '',
    });

    // Save doctor
    const savedDoctor = await newDoctor.save();

    return NextResponse.json({
      success: true,
      message: 'Doctor created successfully',
      doctor: {
        _id: savedDoctor._id,
        user: {
          _id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          role: savedUser.role,
          phone: savedUser.phone,
          address: savedUser.address,
        },
        specialty: savedDoctor.specialty,
        availability: savedDoctor.availability,
        details: savedDoctor.details,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating doctor:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create doctor', error: error.message },
      { status: 500 }
    );
  }
}

// Handler for GET request to get all doctors
export async function GET(request) {
  try {
    // Connect to database
    await connectDB();
    
    // Get all doctors with populated user fields
    // Note: specialty is now a String, so no need to populate it
    const doctors = await Doctor.find()
      .populate('user', '-password') // Exclude password field
      .lean();
    
    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors
    });
    
  } catch (error) {
    console.error('Error fetching doctors:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch doctors', error: error.message },
      { status: 500 }
    );
  }
}