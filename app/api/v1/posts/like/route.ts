import dbConnect from "@/lib/mongodb/dbConnect";
import Post from "@/models/Post";
import { NextRequest, NextResponse } from "next/server";

export async function POST(reqest: NextRequest) {
  await dbConnect();
  const { postId, userId } = await reqest.json();

  try {
    const post = await Post.findOne({ _id: postId });
    console.log(post);

    const likeIds = post.likes;
    console.log(likeIds);

    if (likeIds.includes(userId)) {
      await post.likes.pull(userId);
    } else {
      await post.likes.push(userId);
    }
    await post.save();
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ failed: error }, { status: 400 });
  }
}
