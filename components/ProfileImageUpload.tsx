"use client";

import { StorageRes } from "@/types";
import axios from "axios";
import { Blob } from "buffer";
import { useSession } from "next-auth/react";
import { Input } from "postcss";
import React, { FormEvent, useRef, useState } from "react";

const ImageUploader = () => {
  // 1. add reference to input element
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { data: Session } = useSession();
  const [selectedFile, setSelectedFile] = useState<File>();
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

  // const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   // 2. get reference to the input element
  //   const input = ref.current!;

  //   // 3. build form data
  //   const formData = new FormData();
  //   for (const file of Array.from(input.files ?? [])) {
  //     formData.append(file.name, file);
  //   }
  //   // 4. use axios to send the FormData
  //   await axios.post("/api/v1/images/upload", formData);
  // };

  const handleImageSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploading(true);
    let storageRes: StorageRes;
    const input = ref.current!;
    // 1. Store Audio Data In Mongo Blob
    try {
      // 3. build form data
      const formData = new FormData();
      for (const file of Array.from(input.files ?? [])) {
        formData.append(file.name, file);
      }
      const storageReq = await axios.post("/api/v1/images/upload", formData);
      if (storageReq.status == 200) {
        storageRes = await storageReq.data;
      }
    } catch (error) {}
    // 2. Use the FileName and store the Post Data in MongoDB
    try {
      const req = await axios.post(
        "/api/v1/users/upload/profile_img",
        {
          id: Session?.user?.id,
          profilePicture: storageRes?.success,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const res = await req.data;
    } catch (err) {
      throw err;
    }
    setUploading(false);
  };

  return (
    <>
      <form
        onSubmit={handleImageSubmit}
        className=" bg-yellow-300 h-64 w-[350px] flex justify-center items-center flex-col"
      >
        <label htmlFor="picture" className="btn btn-default  p-0">
          <input
            id="picture"
            type="file"
            name="files"
            accept="image/*"
            ref={ref}
            multiple
            onChange={selectFile}
            className="bg-red-400"
          />
        </label>
        {previewImage && <img className=" w-60" src={previewImage} alt="" />}
        <input
          className="px-2 py-1 rounded-md bg-violet-50 text-violet-500"
          disabled={!currentFile}
          type="submit"
          value="Change Profile Image"
        />
      </form>

      {/* <form
        id="uploadForm"
        action=""
        name="bannerForm"
        method="post"
        encType="multipart/form-data"
        className="w-2/4 rounded-md shadow"
        onSubmit={(e) => {
          e.preventDefault();
          // e.nativeEvent.submitter.name === "profilepic"
          //   ? handleProfilePicSubmit(e)
          //   : handleBannerPicSubmit(e);
        }}
      >
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              aria-hidden="true"
              className="w-10 h-10 mb-3 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              ></path>
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            name="file"
            type="file"
            className="hidden"
            onChange={changeHandler}
          />
          <input name="comment" className="hidden" value={userIdFormSession} />
          <input name="userId" className="hidden" value={"profile Picture"} />
        </label>
        <input
          className=" bg-green-400 px-3 py-1 rounded-lg dark:text-white dark:bg-green-600 mr-2"
          type="submit"
          name="profilepic"
          value="Update Profile Picture"
        />
        <input
          className=" bg-green-400 px-3 py-1 rounded-lg dark:text-white dark:bg-green-600"
          type="submit"
          name="bannerpic"
          value="Update Banner"
        />
      </form> */}
    </>
  );
};

export default ImageUploader;
