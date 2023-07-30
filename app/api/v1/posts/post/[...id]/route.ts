import dbConnect from "@/lib/mongodb/dbConnect";
import Post from "@/models/Post";
import { NextResponse } from "next/server";

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

export async function GET(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const userPost = await Post.findOne({ _id: id });
    return NextResponse.json({ success: true, userPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}

export async function POST(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  const { userId, audio, audience, data, text, createdAt } =
    await request.json();

  try {
    const userPost = await Post.findOneAndUpdate(
      { _id: id },
      {
        userId: userId,
        audio: audio,
        audience: audience,
        data: data,
        text: text,
        createdAt: createdAt,
      }
    );
    return NextResponse.json({ success: true, userPost }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
