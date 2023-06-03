import dbConnect from "@/lib/mongodb/dbConnect";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { id, bannerPicture } = await request.json();

  // create new Post on MongoDB
  const updatedUser = User.updateOne(
    { _id: id },
    { $set: { bannerPicture: bannerPicture } }
  );

  return updatedUser
    .then(() => NextResponse.json({ success: true }, { status: 200 }))
    .catch((err: string) =>
      NextResponse.json({ failed: err }, { status: 400 })
    );
}
