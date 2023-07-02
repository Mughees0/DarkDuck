import dbConnect from "@/lib/mongodb/dbConnect";
import Post from "@/models/Post";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  const { postId, userId, comment } = await request.json();

  try {
    const post = await Post.findOne({ _id: postId });

    // await post.likes.pull(userId);
    const user = await User.findById({ _id: userId });
    const data = { userId: user, comment: comment };
    await post.comments.push({ userId: user, comment: comment });

    await post.save();
    return NextResponse.json({ success: data }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
