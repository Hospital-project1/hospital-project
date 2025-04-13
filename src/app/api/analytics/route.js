import dbConnect from "../../../lib/dbConnect";
import User from "../../models/User";
import Doctor from "../../models/Doctor";
import Appointment from "../../models/Appointment";
import Billing from "../../models/Billing";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  await dbConnect();

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    let userId = null;
    let patientId = null;

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.userId;

        const user = await User.findById(userId);
        if (user?.role === "patient") {
          patientId = userId;
        }
      } catch (err) {
        console.error("token in not valid", err);
      }
    }

    const userCount = await User.countDocuments();
    const doctors = await Doctor.find().lean();
    const doctorCount = doctors.length;

    const specialtyCounts = doctors.reduce((acc, doc) => {
      acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
      return acc;
    }, {});

    const appointmentCount = await Appointment.countDocuments();
    const billings = await Billing.find({ status: "paid" }).lean();
    const totalRevenue = billings.reduce((sum, b) => sum + b.totalAmount, 0);

    const latestAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("doctor", "name")
      .lean();

    return Response.json({
      patientId, // إرسال الـ Patient ID للفرونت
      userCount,
      doctorCount,
      specialtyCounts,
      appointmentCount,
      totalRevenue,
      latestAppointments,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
    });
  }
}
