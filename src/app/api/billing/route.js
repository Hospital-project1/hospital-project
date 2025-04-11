import { NextResponse } from "next/server";
import dbConnect from "../../../lib/dbConnect";
import Billing from "../../models/Billing";

export async function GET() {
  await dbConnect();

  try {
    const billings = await Billing.find({}).populate("patient");
    return NextResponse.json(billings);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching billing data", error },
      { status: 500 }
    );
  }
}
