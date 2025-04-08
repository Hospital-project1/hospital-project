// app/api/dashboard/stats/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Patient from '@/app/models/Patient';
import Appointment from '@/app/models/Appointment';
import Billing from '@/app/models/Billing';
import Feedback from '@/app/models/Feedback';

export async function GET() {
  try {
    await dbConnect();
    
    // Get dashboard statistics
    const patientCount = await Patient.countDocuments();
    const appointmentCount = await Appointment.countDocuments({
      date: { $gte: new Date() }
    });
    
    const billingTotal = await Billing.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);
    
    const feedbackAvg = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" }
        }
      }
    ]);
    
    return NextResponse.json({
      patients: {
        total: patientCount,
        trend: "+12.5%" // In a real app, calculate this dynamically
      },
      appointments: {
        total: appointmentCount,
        trend: "+8.1%"
      },
      revenue: {
        total: billingTotal[0]?.total || 0,
        trend: "+5.4%"
      },
      feedback: {
        average: feedbackAvg[0]?.averageRating.toFixed(1) || 0,
        trend: "+0.2"
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}