
// app/api/patients/route.js
import { NextResponse } from "next/server";
import connect from "../../../lib/dbConnect";
import Patient from "../../models/User";

// GET - Get all patients (non-deleted ones)
export async function GET() {
  try {
    // Connect to database
    await connect();
    
    // Find all non-deleted patients
    const patients = await Patient.find({ isDeleted: { $ne: true } }).sort({ createdAt: -1 });
    
    // Return the patients
    return NextResponse.json(
      { success: true, data: patients },
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
    
    // Create a new patient
    const patient = new Patient(body);
    
    // Save the patient
    await patient.save();
    
    // Return the newly created patient
    return NextResponse.json(
      { success: true, data: patient },
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