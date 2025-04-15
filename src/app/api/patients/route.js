

// app/api/patients/route.js
import { NextResponse } from "next/server";
import connect from "../../../lib/dbConnect";
import Patient from "../../models/User";

// GET - Get all patients (non-deleted ones) with pagination
export async function GET(request) {
  try {
    // Connect to database
    await connect();
    
    // Get URL parameters for pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 9; // Default to 7 items per page
    const skip = (page - 1) * limit;
    
    // Find all non-deleted patients with role 'patient' with pagination
    const patients = await Patient.find({ 
      role: 'patient',
      isDeleted: false 
    })
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
    
    // Count total documents for pagination metadata
    const total = await Patient.countDocuments({
      role: 'patient',
      isDeleted: false
    });
    
    // Calculate total pages
    const totalPages = Math.ceil(total / limit);
    
    // Return the patients with pagination metadata
    return NextResponse.json(
      { 
        success: true, 
        count: patients.length,
        data: patients,
        pagination: {
          total,
          page,
          limit,
          totalPages
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patients" },
      { status: 500 }
    );
  }
}

// POST - Create a new patient
export async function POST(request) {
  try {
    // Connect to database
    await connect();
    
    // Parse the request body
    const body = await request.json();
    
    // Set default values for role and isDeleted
    const patientData = {
      ...body,
      role: 'patient', // Force role to be patient
      isDeleted: false // Default to false if not provided
    };
    
    // Create a new patient
    const patient = new Patient(patientData);
    
    // Save the patient
    await patient.save();
    
    // Remove password from response
    const patientResponse = patient.toObject();
    delete patientResponse.password;
    
    // Return the newly created patient
    return NextResponse.json(
      { success: true, data: patientResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create patient" },
      { status: 500 }
    );
  }
}