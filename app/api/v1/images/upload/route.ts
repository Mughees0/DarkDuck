// app/api/upload

import dbConnect from "@/lib/mongodb/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { Readable } from "stream";

export async function POST(req: Request) {
  await dbConnect();
  const gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "image",
  });
  // get the form data
  const data = await req.formData();
  let fileName: string;
  try {
    // map through all the entries
    for (const entry of Array.from(data.entries())) {
      const [key, value] = entry;
      // FormDataEntryValue can either be type `Blob` or `string`
      // if its type is object then it's a Blob
      const isFile = typeof value == "object";
      fileName = key;
      if (isFile) {
        const blob = value as Blob;
        const filename = blob.name;
        // const existing = gridFSBucket.find({ filename });
        // // const file = await existing.toArray();
        // // console.log(file.at(0).filename);
        // if (existing) {
        //   // If file already exists, let's skip it.
        //   // If you want a different behavior such as override, modify this part.
        //   return NextResponse.json(
        //     { Failed: "image already in DB" },
        //     { status: 400 }
        //   );
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

    // return the response after all the entries have been processed.
    return NextResponse.json({ success: fileName });
  } catch (error) {
    return NextResponse.json({ failed: true }, { status: 400 });
  }
}
