import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Appointment from "@/app/models/Appointment";
import Patient from "@/app/models/Patient";
import Doctor from "@/app/models/Doctor";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// الحصول على جميع المواعيد
export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const doctorId = searchParams.get("doctorId");
    const patientId = searchParams.get("patientId");

    let query = {};
    if (status) query.status = status;
    if (doctorId) query.doctor = doctorId;
    if (patientId) query.patient = patientId;

    const appointments = await Appointment.find(query)
      .populate("patient", "name email")
      .populate("doctor", "name specialization")
      .sort({ appointmentDate: 1 });

    return NextResponse.json({ success: true, data: appointments });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

// إنشاء موعد جديد
export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();

    // 1. الحصول على التوكن من الكوكيز
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "يجب تسجيل الدخول أولاً" },
        { status: 401 }
      );
    }

    // 2. فك تشفير التوكن
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, error: "توكن غير صالح أو منتهي الصلاحية" },
        { status: 401 }
      );
    }

    // 3. التحقق من أن المستخدم مريض
    if (decoded.role !== "patient") {
      return NextResponse.json(
        { success: false, error: "فقط المرضى يمكنهم حجز المواعيد" },
        { status: 403 }
      );
    }

    // 4. استخدام بيانات المريض من التوكن، وتجهيز كل الحقول القادمة من النموذج
    const {
      doctor,
      appointmentDate,
      appointmentType,
      timeSlot,
      day,
      reason,
      amount,
      currency,
    } = body;

    // 5. التحقق من الحقول المطلوبة
    if (!doctor || !appointmentDate || !day || !reason) {
      return NextResponse.json(
        { success: false, error: "Fill all input " },
        { status: 400 }
      );
    }

    const appointmentData = {
      doctor,
      patient: decoded.userId,
      patientName: decoded.name,
      appointmentDate,
      appointmentType,
      timeSlot,
      day,
      reason,
      amount: amount || 15,
      currency: currency || "JOD",
      status: "pending",
    };

    // 6. إنشاء الموعد
    const appointment = await Appointment.create(appointmentData);

    return NextResponse.json(
      {
        success: true,
        data: appointment,
        message: "Create appointment done",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error to crate appointment :", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Error to crate appointment :",
      },
      { status: 400 }
    );
  }
}
