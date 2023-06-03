// app/api/uploads/[filename]/route.ts
import dbConnect from "@/lib/mongodb/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  // 1. get GridFS bucket
  await dbConnect();
  var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "audio",
  });
  try {
    const existing = gridFSBucket.find();
    const file = await existing.toArray();
    return NextResponse.json({ success: true, data: file }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err }, { status: 400 });
  }
}
