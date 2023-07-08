import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../models/Post";
export const dynamic = "force-dynamic";

interface ResponseData {
  error?: string;
  msg?: string;
}

export async function GET(request: Request) {
  await dbConnect();
  try {
    const userPosts = await Post.find()
      .sort({ createdAt: "desc" })
      .limit(8)
      .populate("userId")
      .exec();
    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
