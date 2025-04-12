import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';
import jwt from 'jsonwebtoken';

async function verifyToken(req) {
  const cookies = req.cookies.get('token'); 
  if (!cookies) {
    return { success: false, message: 'No token provided', status: 401 };
  }

  const token = cookies.value;
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { success: true, decoded };
  } catch (error) {
    return { success: false, message: 'Invalid or expired token', status: 401 };
  }
}

export async function GET(req) {
  try {

    await dbConnect();

    const { success, decoded, message, status } = await verifyToken(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status });
    }

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

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

export async function PUT(req) {
  try {

    await dbConnect();

    const { success, decoded, message, status } = await verifyToken(req);
    if (!success) {
      return NextResponse.json({ success: false, message }, { status });
    }

    const body = await req.json();
    const { name, email, phone, address, profilePicture } = body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, message: 'Invalid email format' },
          { status: 400 }
        );
      }

      const existingUser = await User.findOne({ email, _id: { $ne: decoded.userId } });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: 'Email already in use, please choose another' },
          { status: 400 }
        );
      }
    }

    if (phone) {
      const phoneRegex = /^07\d{8}$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { success: false, message: 'Phone number must be 10 digits starting with 07' },
          { status: 400 }
        );
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;
    if (profilePicture) updateData.profilePicture = profilePicture;

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password'); 

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

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
      { success: false, message: 'Server error', error: error.message },
      { status: 500 }
    );
  }
}