import dbConnect from "@/lib/mongodb/dbConnect";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { userId, audio, audience, image, text } = await request.json();

  // create new Post on MongoDB
  const newPost = new Post({
    userId: userId,
    audio: audio,
    audience: audience,
    image: image,
    text: text,
  });

  return newPost
    .save()
    .then(() => NextResponse.json({ success: true }, { status: 200 }))
    .catch((err: string) =>
      NextResponse.json({ success: false, error: err }, { status: 400 })
    );
}
