import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

// Helper function to verify JWT token
async function verifyToken(req) {
  const cookies = req.cookies.get('token'); // Extract token from cookies
  if (!cookies) {
    return { success: false, message: 'No token provided', status: 401 };
  }

  const token = cookies.value;
  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, message: 'Invalid or expired token', status: 401 };
  }
}

// GET Profile: Fetch the user profile
export async function GET(req) {
  try {
    // 1) Connect to MongoDB
    await dbConnect();

    // 2) Verify the JWT token using the helper function
    const { success, decoded, message, status } = await verifyToken(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status });
    }

    // 3) Fetch the user from the database
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // 4) Return user profile
    return NextResponse.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phoneNumber: user.phone || '',
        address: user.address || '',
        profilePicture: user.profilePicture || '',
      },
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}

// PUT Profile: Update the user profile
export async function PUT(req) {
  try {
    // 1) Connect to MongoDB
    await dbConnect();

    // 2) Verify the JWT token using the helper function
    const { success, decoded, message, status } = await verifyToken(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status });
    }

    // 3) Fetch the user from the database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // 4) Extract the update data from request body
    const body = await req.json();
    const { name, email, phone, address, profilePicture } = body;

    // 5) Prepare update data
    const updatedData = {
      name: name || user.name, // Update if new value is provided
      email: email || user.email,
      phone: phone || user.phone,
      address: address || user.address,
      profilePicture: profilePicture || user.profilePicture,
    };

    // 6) Save the updated user
    const updatedUser = await User.findByIdAndUpdate(user._id, updatedData, { new: true });

    // 7) Return the updated profile
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        phoneNumber: updatedUser.phone || '',
        address: updatedUser.address || '',
        profilePicture: updatedUser.profilePicture || '',
      },
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
