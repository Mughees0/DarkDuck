// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../lib/mongodb/dbConnect";
import User from "../../../../models/User";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  await dbConnect();

  try {
    const users = await User.find();
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

export async function POST(request: Request) {
  await dbConnect();
  const { _id, otp }: { _id: string; otp: number } = await request.json();

  const userOtpCheck = await User.findById({ _id });

  if (otp == userOtpCheck.otp) {
    return NextResponse.json({ success: "Done" }, { status: 200 });
  } else {
    return NextResponse.json(
      { success: false, error: "Incorrect OTP" },
      { status: 400 }
    );
  }
}
