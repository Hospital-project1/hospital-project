// app/api/doctors/route.js
import dbconnect from '@/lib/dbConnect';

import Doctor from "@/app/models/Doctor";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbconnect();
    
    // جلب بيانات الأطباء مع عرض بيانات المستخدم والتخصص
    const doctors = await Doctor.find()
      .populate({
        path: "user",
        select: "name email"
      })
      .populate({
        path: "specialty",
        select: "name"
      });
    
    return NextResponse.json(doctors);
  } catch (error) {
    console.error("خطأ في جلب بيانات الأطباء:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب بيانات الأطباء" },
      { status: 500 }
    );
  }
}