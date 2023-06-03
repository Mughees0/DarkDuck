// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/mongodb/dbConnect";
import User from "../../../../../../models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

interface ResponseData {
  error?: string;
  msg?: string;
}

// const validateEmail = (email: string): boolean => {
//   const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
//   return regEx.test(email);
// };

// const validateForm = async (
//   username: string,
//   email: string,
//   password: string
// ) => {
//   if (username.length < 3) {
//     return { error: "Username must have 3 or more characters" };
//   }
//   if (!validateEmail(email)) {
//     return { error: "Email is invalid" };
//   }

//   await dbConnect();
//   const emailUser = await User.findOne({ email: email });

//   if (emailUser) {
//     return { error: "Email already exists" };
//   }

//   if (password.length < 5) {
//     return { error: "Password must have 5 or more characters" };
//   }

//   return null;
// };

// export default async function handler(res: NextApiResponse<ResponseData>) {
//   // validate if it is a POST

//   if (req.method !== "POST") {
//     return res
//       .status(200)
//       .json({ error: "This API call only accepts POST methods" });
//   }

//   // get and validate body variables
//   const { username, email, password } = req.body;

//   const errorMessage = await validateForm(username, email, password);
//   if (errorMessage) {
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }

//   // hash password
//   const hashedPassword = await bcrypt.hash(password, 12);

//   // create new User on MongoDB
//   const newUser = new User({
//     name: username,
//     email,
//     hashedPassword,
//   });

//   newUser
//     .save()
//     .then(() =>
//       res.status(200).json({ msg: "Successfuly created new User: " + newUser })
//     )
//     .catch((err: string) =>
//       res.status(400).json({ error: "Error on '/api/register': " + err })
//     );
// }

export async function GET(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  return NextResponse.json(await User.findById({ _id: id }));
}

// export async function POST(request: Request) {
//   await dbConnect();
//   const { username, email, password } = await request.json();
//   const errorMessage = await validateForm(username, email, password);
//   if (errorMessage) {
//     return NextResponse.json(errorMessage, { status: 400 });
//   }

//   // hash password
//   const hashedPassword = await bcrypt.hash(password, 12);

//   // create new User on MongoDB
//   const newUser = new User({
//     name: username,
//     email,
//     hashedPassword,
//   });

//   return newUser
//     .save()
//     .then(() =>
//       NextResponse.json(
//         { msg: "Successfuly created new User: " + newUser },
//         { status: 200 }
//       )
//     )
//     .catch((err: string) =>
//       NextResponse.json(
//         { error: "Error on '/api/register': " + err },
//         { status: 400 }
//       )
//     );
// }

// export async function PUT(request) {
//   await mongooseConnect();
//   const { title, description, price, _id } = await request.json();
//   const updateDoc = await Product.updateOne(
//     { _id },
//     { title, description, price }
//   );
//   return NextResponse.json(updateDoc);
// }
