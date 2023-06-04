// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../lib/mongodb/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const validateForm = async (email: string) => {
  if (!validateEmail(email)) {
    return { error: "Email is invalid" };
  }

  await dbConnect();
  const emailUser = await User.findOne({ email: email });

  if (!emailUser) {
    return { error: "Email doesn't exists" };
  }

  return null;
};

// export async function GET({ params }) {
//   await dbConnect();
//   const { id } = params;
//   return NextResponse.json(await User.findOne({ id }));
// }

export async function POST(request: Request) {
  await dbConnect();
  const { email }: { email: string } = await request.json();
  const errorMessage = await validateForm(email);
  if (errorMessage) {
    return NextResponse.json(errorMessage, { status: 400 });
  }

  const OTP = Math.floor(100000 + Math.random() * 900000);

  const updatedUser = User.updateOne({ email: email }, { $set: { otp: OTP } });

  let transporter = await nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_AUTH_USER, // generated ethereal user
      pass: process.env.EMAIL_AUTH_PASSWORD, // generated ethereal password
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Password Reset",
    text: String(OTP),
    html: `<p>Please the following OTP to reset your password: ${OTP}</p>`,
  });
  const emailUser = await User.findOne({ email: email });
  return updatedUser
    .then(() => NextResponse.json({ emailUser }, { status: 200 }))
    .catch((err: string) => NextResponse.json({ error: err }, { status: 400 }));
}

export async function PUT(request: Request) {
  await dbConnect();
  const { _id, newPassword }: { _id: string; newPassword: string } =
    await request.json();

  const newHashedPassword = await bcrypt.hash(newPassword, 12);
  const updatedUser = User.updateOne(
    { _id },
    { $set: { hashedPassword: newHashedPassword } }
  );

  return updatedUser
    .then(() => NextResponse.json({ success: "done" }, { status: 200 }))
    .catch((err: string) => NextResponse.json({ error: err }, { status: 400 }));
}
