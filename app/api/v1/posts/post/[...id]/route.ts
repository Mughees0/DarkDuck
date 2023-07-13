// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/mongodb/dbConnect";
import User from "../../../../../../models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import Post from "@/models/Post";
export const dynamic = "force-dynamic";

interface ResponseData {
  error?: string;
  msg?: string;
}

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

export async function DELETE(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const userPosts = await Post.findOneAndDelete({ _id: id });
    return NextResponse.json({ success: true, userPosts }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
