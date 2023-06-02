// working fine

import { NextResponse } from "next/server";
import { Directus } from "@directus/sdk";
import { Blob } from "node:buffer";
import FormData from "form-data";

export async function POST(request: Request) {
  // Get Directus configuration
  const token: string = process.env.DIRECTUS_JOB_TOKEN!;
  const url: string = process.env.DIRECTUS_URL!;

  const directus = new Directus<any>(url);
  await directus.auth.static(token).then((res) => {
    console.log("res", res);
  });

  // Get formData from request
  const formData = await request.formData();

  // Get file from formData
  const file = formData.get("file");

  if (file instanceof Blob) {
    // Convert file to stream
    const stream = file.stream();

    // Convert stream to buffer
    const chunks = [];
    for await (const chunk of stream as unknown as NodeJS.ReadableStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Make a new FormData
    const directusFormData = new FormData();
    directusFormData.append("folder", "887b5198-6b28-4289-8117-87deb4df5e71");
    if (file instanceof File) {
      directusFormData.append("file", buffer, file.name);
    }

    try {
      // const response = await directus.files.createOne(directusFormData);
      const response = await directus.files
        .createOne(directusFormData)
        .then(async (response) => {
          return response;
        });
      console.log("response", response);
      return NextResponse.json({ message: "Hello, Next.js!" });
    } catch (error) {
      console.log(error);
      return NextResponse.json({ message: "Error" });
    }
  }
}
