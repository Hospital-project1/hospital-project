
// app/api/patients/route.js
import { NextResponse } from "next/server";
import connect from "../../../lib/dbConnect";
import User from "../../models/User";

export async function GET(request) {
  try {
    // Connect to database
    await connect();
    
    // Find all users with role "patient" who aren't deleted
    // and select only the requested fields
    const patients = await User.find(
      { 
        role: "patient" 
        // isDeleted: false 
      },
      "name email password phone address createdAt updatedAt"
    );
    
    // Return the result
    return NextResponse.json(
      { 
        success: true, 
        count: patients.length,
        data: patients 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching patients:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch patients data" },
      { status: 500 }
    );
  }
}