
// app/api/patients/[id]/route.js
import { NextResponse } from "next/server";
import connect from "../../../../lib/dbConnect";
import Patient from "../../../models/User";

// GET - Get patient by ID
export async function GET(request, context) {
  try {
    // Connect to database
    await connect();
    
    // Get the patient ID from context.params
    const id = context.params.id;
    
    // Find the patient by ID
    const patient = await Patient.findById(id);
    
    // Check if patient exists
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }
    
    // Return the patient
    return NextResponse.json(
      { success: true, data: patient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patient data" },
      { status: 500 }
    );
  }
}

// PUT - Update patient by ID
export async function PUT(request, context) {
  try {
    // Connect to database
    await connect();
    
    // Get the patient ID from context.params
    const id = context.params.id;
    
    // Parse the request body
    const body = await request.json();
    
    // Find the patient by ID
    const patient = await Patient.findById(id);
    
    // Check if patient exists
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }
    
    // Update the patient fields if provided
    if (body.name) patient.name = body.name;
    if (body.email) patient.email = body.email;
    if (body.phone !== undefined) patient.phone = body.phone;
    if (body.address !== undefined) patient.address = body.address;
    
    // Save the updated patient
    const updatedPatient = await patient.save();
    
    // Return the updated patient
    return NextResponse.json(
      { success: true, data: updatedPatient },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update patient" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete patient by setting isDeleted to true
export async function DELETE(request, context) {
  try {
    // Connect to database
    await connect();
    
    // Get the patient ID from context.params
    const id = context.params.id;
    
    // Find the patient by ID
    const patient = await Patient.findById(id);
    
    // Check if patient exists
    if (!patient) {
      return NextResponse.json(
        { success: false, message: "Patient not found" },
        { status: 404 }
      );
    }
    
    // Set isDeleted to true (soft delete)
    patient.isDeleted = true;
    
    // Save the updated patient
    await patient.save();
    
    // Return success message
    return NextResponse.json(
      { success: true, message: "Patient deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete patient" },
      { status: 500 }
    );
  }
}