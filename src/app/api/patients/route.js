import { NextResponse } from "next/server";
import connect from "@/lib/dbConnect";
import User from "../../models/User";
import bcrypt from "bcryptjs";

// POST - Create a new user
export async function POST(request) {
  try {
    // Connect to database
    await connect();
    
    // Parse the request body
    const body = await request.json();
    
    // Check if required fields are provided
    if (!body.name || !body.email || !body.password || !body.role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User with this email already exists" },
        { status: 400 }
      );
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(body.password, salt);
    
    // Create a new user
    const newUser = new User({
      name: body.name,
      email: body.email,
      password: hashedPassword,
      role: body.role,
      phone: body.phone || "",
      address: body.address || "",
      profilePicture: body.profilePicture || "",
      socialLogin: body.socialLogin || {},
      isDeleted: body.isDeleted || false,
      isBlocked: body.isBlocked || false
    });
    
    // Save the user to database
    const savedUser = await newUser.save();
    
    // Remove password from response
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    // Return the new user
    return NextResponse.json(
      { success: true, data: userResponse },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create user" },
      { status: 500 }
    );
  }
}

// GET - Get only patients
export async function GET(request) {
  try {
    // Connect to database
    await connect();
    
    // Find only users with role "patient"
    const users = await User.find(
      { role: "patient" }, // Include only users with role "patient"
      "-password" // Exclude password field
    );
    
    // Return the result
    return NextResponse.json(
      { 
        success: true, 
        count: users.length,
        data: users 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users data" },
      { status: 500 }
    );
  }
}