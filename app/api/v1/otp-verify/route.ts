// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../lib/mongodb/dbConnect";
import User from "../../../../models/User";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  await dbConnect();
  return NextResponse.json(await User.find());
}

export async function POST(request: Request) {
  await dbConnect();
  const { _id, otp }: { _id: string; otp: number } = await request.json();

  const userOtpCheck = await User.findById({ _id });

  if (otp == userOtpCheck.otp) {
    return NextResponse.json({ success: "Done" }, { status: 200 });
  } else {
    return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
  }
}
