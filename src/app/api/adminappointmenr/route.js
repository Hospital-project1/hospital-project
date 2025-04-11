import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Appointment from "../../models/Appointment";
import Billing from "../../models/Billing";

export async function GET() {
  await dbConnect();

  try {
    // استعلام للحصول على بيانات المواعيد مع الطبيب فقط
    const appointments = await Appointment.find().populate({
      path: "doctor",
      populate: { path: "user", select: "name" },
    });

    // تجهيز البيانات لعرضها
    const data = await Promise.all(
      appointments.map(async (appt) => {
        // جلب بيانات الدفع حسب الـ appointment فقط، بدون استخدام patient
        const billing = await Billing.findOne({ appointment: appt._id });
        return {
          doctorName: appt.doctor?.user?.name || "N/A",
          appointmentDate: appt.appointmentDate,
          isPaid: billing?.status === "paid", // التحقق من حالة الدفع
        };
      })
    );

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
