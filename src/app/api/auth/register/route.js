import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

const registerSchema = Joi.object({
    name: Joi.string().required().messages({
      'any.required': 'Name is required.',
      'string.empty': 'Name cannot be empty.'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email address.',
      'any.required': 'Email is required.',
      'string.empty': 'Email cannot be empty.'
    }),
    password: Joi.string()
      .pattern(new RegExp('^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must be at least 8 characters long, include one uppercase letter, and one special character from @$!%*?&.',
        'any.required': 'Password is required.',
        'string.empty': 'Password cannot be empty.'
      }),
    phone: Joi.string()
      .pattern(/^07\d{8}$/)  // Starts with 07 and followed by 8 digits
      .required()
      .messages({
        'string.pattern.base': 'Phone number must start with 07 and be 10 digits long.',
        'any.required': 'Phone number is required.',
        'string.empty': 'Phone number cannot be empty.'
      })
  });
  

export async function POST(req) {
  try {

    await dbConnect();

    const body = await req.json();

    const { error } = registerSchema.validate(body, { abortEarly: false });
    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.details.map((detail) => detail.message).join(', '),
        },
        { status: 400 },
      );
    }

    const { name, email, password, phone } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, phone });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, name:newUser.name, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone
        },
      },
      { status: 201 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, 
    });

    return response;
  } catch (error) {
    console.error('Register Error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    );
  }
}
