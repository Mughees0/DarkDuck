import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../lib/mongodb/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../models/Post";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
export const dynamic = "force-dynamic";

interface ResponseData {
  error?: string;
  msg?: string;
}

export async function GET(request: NextRequest, params: Params) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  let page = searchParams.get("page");
  const endIndex = Number(page) * 10;
  const startIndex = endIndex - 10;
  try {
    const totalCount = await Post.count();
    let pageCount = 1;
    let userPosts = {};
    if (totalCount > 10) {
      const num = totalCount / 10 + 1;
      pageCount = Math.trunc(num);
      userPosts = await Post.find()
        .sort({ createdAt: "desc" })
        .skip(startIndex)
        .limit(endIndex)
        .populate("userId")
        .exec();
    } else {
      page = "1";
      userPosts = await Post.find()
        .sort({ createdAt: "desc" })
        .populate("userId")
        .exec();
    }

    return NextResponse.json(
      {
        meta: {
          success: true,
          totalCount,
          pageCount,
          currentPage: Number(page),
          perPage: 10,
        },
        result: userPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error }, { status: 400 });
  }
}
