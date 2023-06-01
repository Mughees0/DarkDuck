import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb/dbConnect";
import { NextResponse } from "next/server";
import Post from "../../../../models/Post";

interface ResponseData {
  error?: string;
  msg?: string;
}

export async function GET(request: Request) {
  await dbConnect();
  return NextResponse.json(await Post.find().populate("userId").exec());
}
