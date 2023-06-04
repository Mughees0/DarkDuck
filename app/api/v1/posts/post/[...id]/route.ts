// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/mongodb/dbConnect";
import User from "../../../../../../models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import Post from "@/models/Post";

interface ResponseData {
  error?: string;
  msg?: string;
}

export async function GET(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const userPosts = await Post.findOne({ userId: id });

    return NextResponse.json(userPosts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ failed: error }, { status: 400 });
  }
}
