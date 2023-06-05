// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../../../../lib/mongodb/dbConnect";
import User from "../../../../../../models/User";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }) {
  await dbConnect();
  const { id } = params;
  try {
    const user = await User.findById({ _id: id });
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
