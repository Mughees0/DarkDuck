import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
const [isLoading, setIsLoading] = useState(false);
const [isRecording, setIsRecording] = useState(false);
const [audio, setAudio] = useState(null);
const [audioBlob, setAudioBlob] = useState<Blob>(null);
const [mode, setMode] = useState("");
const [uploading, setUploading] = useState(false);
const [updatePosts, setUpdatePosts] = useState(false);
const [audioRecordingModel, setAudioRecordingModel] = useState(false);
const { data: Session } = useSession();

const handleAudioSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  setUploading(true);
  let storageRes: StorageRes;
  // 1. Store Audio Data In Mongo Blob
  try {
    const formData = new FormData();
    formData.append(`${Date.now()}.mp3`, audioBlob);
    const storageReq = await axios.post("/api/v1/audios/upload", formData);

    if (storageReq.status == 200) {
      storageRes = await storageReq.data;
    }
  } catch (error) {
    if (error.response.status === 400) {
      console.log(
        "Audio recording not uploaded." +
          " The error message:> " +
          error.message
      );
    } else {
      console.log("Wrong call to the api.");
    }
  }
  // 2. Use the FileName and store the Post Data in MongoDB
  try {
    const req = await axios.post(
      "/api/v1/posts/new_post",
      {
        userId: Session?.user?.id,
        audio: storageRes?.success,
        recordModeSwingId: mode ? "public" : "private",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    if (req.status == 200) {
      setUpdatePosts(!updatePosts);
      setAudioRecordingModel(!audioRecordingModel);
    }
    const res = await req.data;
  } catch (err) {
    if (err.response.status === 400) {
      console.log(
        "Audio is uploaded but new post was not created." +
          " The error message:> " +
          err.message
      );
    } else {
      console.log("Wrong call to the api.");
    }
  }
  setUploading(false);
};

const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setUploading(true);
  let storageResImage: StorageRes;
  let storageResAudio: StorageRes;
  const input = ref.current!;
  // 1. Store Audio Data In Mongo Blob
  try {
    // 2. build form data
    const formData = new FormData();
    for (const file of Array.from(input.files ?? [])) {
      formData.append(file.name, file);
    }
    const storageReq = await axios.post("/api/v1/images/upload", formData);
    if (storageReq.status == 200) {
      storageResImage = await storageReq.data;
    }
  } catch (error) {
    if (error.response.status === 400) {
      console.log(
        "Image not uploaded." + " The error message:> " + error.message
      );
    } else {
      console.log("Wrong call to the api.");
    }
  }
  try {
    // 3. build form data for audio
    const formData = new FormData();
    formData.append(`${Date.now()}.mp3`, audioBlob);
    const storageReq = await axios.post("/api/v1/audios/upload", formData);

    if (storageReq.status == 200) {
      storageResAudio = await storageReq.data;
    }
  } catch (error) {
    if (error.response.status === 400) {
      console.log(
        "Audio recording not uploaded." +
          " The error message:> " +
          error.message
      );
    } else {
      console.log("Wrong call to the api.");
    }
  }
  // 2. Use the FileName and store the Post Data in MongoDB
  try {
    const req = await axios.post(
      "/api/v1/posts/new_post",
      {
        userId: Session?.user?.id,
        audio: storageResAudio?.success,
        audience: mode ? "public" : "private",
        text: userText,
        image: storageResImage?.success,
        updatedAt: { type: Date, default: Date.now() },
        createdAt: { type: Date, default: Date.now() },
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
      setBannerModal(!bannerModal);
    }
    const res = await req.data;
  } catch (err) {
    if (err.response.status === 400) {
      console.log(
        "Data is uploaded but post did not update." +
          " The error message:> " +
          err.message
      );
    } else {
      console.log("Wrong call to the api.");
    }
  }
  setUploading(false);
};
