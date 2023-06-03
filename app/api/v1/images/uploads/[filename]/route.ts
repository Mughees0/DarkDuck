// app/api/uploads/[filename]/route.ts
import dbConnect from "@/lib/mongodb/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type Params = {
  params: { filename: string };
};

export async function GET(req: Request, { params }: Params) {
  // 1. get GridFS bucket
  await dbConnect();
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "image",
  });

  const { filename } = params;
  // 2. validate the filename
  if (!filename) {
    return new NextResponse(null, { status: 400, statusText: "Bad Request" });
  }

  const files = await gridFSBucket.find({ filename }).toArray();
  if (!files.length) {
    return new NextResponse(null, { status: 404, statusText: "Not found" });
  }

  // 3. get file data
  const file = files.at(0)!;

  // 4. get the file contents as stream
  // Force the type to be ReadableStream since NextResponse doesn't accept GridFSBucketReadStream
  const stream = gridFSBucket.openDownloadStreamByName(
    filename
  ) as unknown as ReadableStream;

  // 5. return a streamed response
  return new NextResponse(stream, {
    headers: {
      "Content-Type": file.contentType!,
    },
  });
}
