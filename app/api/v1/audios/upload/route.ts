// app/api/upload

import dbConnect from "@/lib/mongodb/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: Request) {
  await dbConnect();
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "audio",
  });
  // get the form data
  const data = await req.formData();
  console.log(data);

  let fileName: string;
  // map through all the entries
  try {
    for (const entry of Array.from(data.entries())) {
      const [key, value] = entry;
      console.log(key);

      // FormDataEntryValue can either be type `Blob` or `string`
      // if its type is object then it's a Blob
      const isFile = typeof value == "object";

      if (isFile) {
        const blob = value as Blob;
        const filename = key;
        fileName = key;
        const existing = gridFSBucket.find();
        const file = await existing.toArray();
        console.log(file);
        // if (existing) {
        //   // If file already exists, let's skip it.
        //   // If you want a different behavior such as override, modify this part.
        //   continue;
        // }

        //conver the blob to stream
        const buffer = Buffer.from(await blob.arrayBuffer());
        const stream = Readable.from(buffer);

        const uploadStream = gridFSBucket.openUploadStream(filename, {
          // make sure to add content type so that it will be easier to set later.
          contentType: blob.type,
          metadata: {}, //add your metadata here if any
        });

        // pipe the readable stream to a writeable stream to save it to the database
        stream.pipe(uploadStream);
      }
    }
    return NextResponse.json({ success: fileName });
  } catch (error) {
    return NextResponse.json({ failed: true }, { status: 400 });
  }

  // return the response after all the entries have been processed.
}
