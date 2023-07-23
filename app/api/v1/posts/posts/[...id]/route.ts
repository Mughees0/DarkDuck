// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import dbConnect from "../../../../../../lib/mongodb/dbConnect";
import { NextResponse } from "next/server";
import Post from "@/models/Post";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const userPosts = await Post.find({ userId: id }).populate("userId");
    userPosts.reverse();
    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
