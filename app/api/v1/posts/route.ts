import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../models/Post";

interface ResponseData {
  error?: string;
  msg?: string;
}

export async function GET(request: Request) {
  await dbConnect();
  return NextResponse.json(await Post.find().populate("userId").exec());
}
export async function POST(request: NextRequest) {
  await dbConnect();
  const { userId, audio, recordModeSwingId } = await request.json();

  // create new Post on MongoDB
  const newPost = new Post({
    userId: userId,
    audio: audio,
    recordModeSwingId: recordModeSwingId,
  });

  return newPost
    .save()
    .then(() =>
      NextResponse.json(
        { msg: "Successfuly created new User: " + newPost },
        { status: 200 }
      )
    )
    .catch((err: string) => NextResponse.json({ error: err }, { status: 400 }));
}
