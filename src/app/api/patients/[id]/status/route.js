// app/api/users/[id]/route.js
import { NextResponse } from "next/server";
import connect from "../../../../../lib/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";

// GET - Get user by ID
export async function GET(request, { params }) {
  try {
    // Connect to database
    await connect();
    
    // Get the user ID from params
    const { id } = params;
    
    // Find the user by ID
    const user = await User.findById(id).select("-password");
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Return the user
    return NextResponse.json(
      { success: true, data: user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}

// PUT - Update user by ID
export async function PUT(request, { params }) {
  try {
    // Connect to database
    await connect();
    
    // Get the user ID from params
    const { id } = params;
    
    // Parse the request body
    const body = await request.json();
    
    // Find the user by ID
    const user = await User.findById(id);
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Update the user fields if provided
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    if (body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(body.password, salt);
    }
    if (body.role) user.role = body.role;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.address !== undefined) user.address = body.address;
    if (body.profilePicture !== undefined) user.profilePicture = body.profilePicture;
    if (body.socialLogin !== undefined) user.socialLogin = body.socialLogin;
    
    // Update isDeleted and isBlocked fields if provided
    if (body.isDeleted !== undefined) user.isDeleted = body.isDeleted;
    if (body.isBlocked !== undefined) user.isBlocked = body.isBlocked;
    
    // Save the updated user
    const updatedUser = await user.save();
    
    // Remove password from response
    const userResponse = updatedUser.toObject();
    delete userResponse.password;
    
    // Return the updated user
    return NextResponse.json(
      { success: true, data: userResponse },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Soft delete user by setting isDeleted to true
export async function DELETE(request, { params }) {
  try {
    // Connect to database
    await connect();
    
    // Get the user ID from params
    const { id } = params;
    
    // Find the user by ID
    const user = await User.findById(id);
    
    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    
    // Set isDeleted to true (soft delete)
    user.isDeleted = true;
    
    // Save the updated user
    await user.save();
    
    // Return success message
    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete user" },
      { status: 500 }
    );
  }
}