"use client";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { FormEvent, useRef, useState } from "react";

const ImageUploader = ({
  setUpdateImage,
  updateImage,
  profileModal,
  setProfileModal,
}) => {
  // 1. add reference to input element
  const ref = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { data: Session } = useSession();
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
  };

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

      if (req.status === 200) {
        setUpdateImage(!updateImage);
        setProfileModal(!profileModal);
      }
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
          value={uploading ? "Please Wait..." : "Change Profile Image"}
        />
      </form>
    </>
  );
};

export default ImageUploader;
