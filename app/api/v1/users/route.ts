// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb/dbConnect";
import User from "../../../../models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface ResponseData {
  error;
  msg;
}

const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

const validateForm = async (
  username: string,
  email: string,
  password: string
) => {
  if (username.length < 3) {
    return { error: "Username must have 3 or more characters" };
  }
  if (!validateEmail(email)) {
    return { error: "Email is invalid" };
  }

  await dbConnect();
  const emailUser = await User.findOne({ email: email });

  if (emailUser) {
    return { error: "Email already exists" };
  }

  if (password.length < 5) {
    return { error: "Password must have 5 or more characters" };
  }

  return null;
};

export async function POST(request: Request) {
  await dbConnect();
  const {
    username,
    email,
    password,
    alias,
    countryCode,
    phone,
    age,
    country,
    language,
    occupation,
    instruments,
    research,
    software,
    highEducation,
    zipCode,
    address,
    city,
    termsCondition,
    profilePicture,
    bannerPicture,
  } = await request.json();
  const errorMessage = await validateForm(username, email, password);
  if (errorMessage) {
    return NextResponse.json(errorMessage, { status: 400 });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // create new User on MongoDB
  const newUser = new User({
    email,
    hashedPassword,
    username,
    alias,
    countryCode,
    phone,
    age,
    country,
    language,
    occupation,
    instruments,
    research,
    software,
    highEducation,
    zipCode,
    address,
    city,
    termsCondition,
    profilePicture,
    bannerPicture,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });

  return newUser
    .save()
    .then(() =>
      NextResponse.json(
        { msg: "Successfuly created new User: " + newUser },
        { status: 200 }
      )
    )
    .catch((err: string) =>
      NextResponse.json(
        { error: "Error on '/api/register': " + err },
        { status: 400 }
      )
    );
}

// export async function PUT(request) {
//   await mongooseConnect();
//   const { title, description, price, _id } = await request.json();
//   const updateDoc = await Product.updateOne(
//     { _id },
//     { title, description, price }
//   );
//   return NextResponse.json(updateDoc);
// }
