import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

// Your Joi login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email address.',
    'any.required': 'Email is required.',
    'string.empty': 'Email cannot be empty.'
  }),
  password: Joi.string().required().messages({
    'any.required': 'Password is required.',
    'string.empty': 'Password cannot be empty.'
  })
});

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1) Validate input
    const { error } = loginSchema.validate(body, { abortEarly: false });
    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.details.map((detail) => detail.message).join(', '),
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 2) Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email please check your email' },
        { status: 401 }
      );
    }

    // 3) Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password please check your password' },
        { status: 401 }
      );
    }

    // 4) Generate token
    const token = jwt.sign(
      { userId: user._id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 5) Return response + cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
