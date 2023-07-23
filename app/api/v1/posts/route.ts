import dbConnect from "../../../../lib/mongodb/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../models/Post";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest, params: Params) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  let page = searchParams.get("page");
  const perPage = 5;
  const endIndex = Number(page) * perPage;
  const startIndex = endIndex - perPage;
  try {
    const totalCount = await Post.count();
    let pageCount = 1;
    let userPosts = {};
    if (totalCount > perPage) {
      const num = totalCount / perPage + 1;
      pageCount = Math.trunc(num);
      userPosts = await Post.find()
        .sort({ _id: -1 })
        .skip(startIndex)
        .limit(endIndex)
        .populate("userId")
        .exec();
    } else {
      page = "1";
      userPosts = await Post.find().sort({ _id: -1 }).populate("userId").exec();
    }

    return NextResponse.json(
      {
        meta: {
          success: true,
          totalCount,
          pageCount,
          currentPage: Number(page),
          perPage,
        },
        result: userPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
