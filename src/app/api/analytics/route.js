import dbConnect from "../../../lib/dbConnect";
import User from "../../models/User";
import Doctor from "../../models/Doctor";
import Appointment from "../../models/Appointment";
import Billing from "../../models/Billing";

export async function GET() {
  await dbConnect();

  try {
    const userCount = await User.countDocuments();
    const doctors = await Doctor.find().lean();
    const doctorCount = doctors.length;

    // حساب التخصصات
    const specialtyCounts = doctors.reduce((acc, doc) => {
      acc[doc.specialty] = (acc[doc.specialty] || 0) + 1;
      return acc;
    }, {});

    const appointmentCount = await Appointment.countDocuments();
    const billings = await Billing.find({ status: "paid" }).lean();
    const totalRevenue = billings.reduce((sum, b) => sum + b.totalAmount, 0);

    // أحدث 10 مواعيد
    const latestAppointments = await Appointment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("patient", "name")
      .populate("doctor", "name")
      .lean();

    return Response.json({
      userCount,
      doctorCount,
      specialtyCounts,
      appointmentCount,
      totalRevenue,
      latestAppointments, // ✅ أضفناها هون
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Server error", error }), {
      status: 500,
    });
  }
}
