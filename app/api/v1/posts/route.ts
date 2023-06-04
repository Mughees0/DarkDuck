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
  try {
    const userPosts = await Post.find().populate("userId").exec();
    userPosts.reverse();
    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ failed: true }, { status: 400 });
  }
}
