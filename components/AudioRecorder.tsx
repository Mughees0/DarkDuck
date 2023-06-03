"use client";
import Session from "@/models/Session";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
const mimeType = "audio/webm";

const AudioRecorder = () => {
  const { data: Session } = useSession();
  const [stream, setStream] = useState(null);
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState<Blob>(null);
  const [mode, setMode] = useState("Public Mode");
  const [uploading, setUploading] = useState(false);

  const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    setRecordingStatus("recording");
    //create new Media recorder instance using the stream
    const media = new MediaRecorder(stream, { mimeType });
    //set the MediaRecorder instance to the mediaRecorder ref
    mediaRecorder.current = media;
    //invokes the start method to start the recording process
    mediaRecorder.current.start();
    let localAudioChunks = [];
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const pauseRecording = async () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.pause();
      setRecordingStatus("paused");
      // recording paused
    }
  };

  const resumeRecording = async () => {
    if (mediaRecorder.current?.state === "paused") {
      mediaRecorder.current.resume();
      setRecordingStatus("recording");
    }
  };
  console.log(mediaRecorder.current?.state);

  // 1. add reference to input element
  const ref = useRef<HTMLInputElement>(null);

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const handleAudioSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    setUploading(true);
    let storageRes: StorageRes;
    // 1. Store Audio Data In Mongo Blob
    try {
      const formData = new FormData();
      formData.append(`${Date.now()}.webm`, audioBlob);
      const storageReq = await axios.post("/api/v1/audios/upload", formData);

      if (storageReq.status == 200) {
        storageRes = await storageReq.data;
      }
      console.log(storageRes.success);
    } catch (error) {}
    // 2. Use the FileName and store the Post Data in MongoDB
    try {
      const req = await axios.post(
        "/api/v1/posts",
        {
          userId: Session?.user?.id,
          audio: storageRes?.success,
          recordModeSwingId:
            mode === "Public Mode"
              ? "633919ee9729ead90e0f6ac4"
              : "63391b065ef1e76cfdcf539c",
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const res = await req.data;
      console.log(res);
    } catch (err) {
      console.log("error in update post", err);
    }
    setUploading(false);
  };

  return (
    <div className=" h-52 w-64 flex-col flex justify-center items-center gap-3  bg-red-200">
      <h2 className=" bg-transparent text-2xl">Audio Recorder</h2>
      <main className="bg-transparent flex flex-col gap-3 items-center">
        <div className=" bg-transparent w-auto ">
          {" "}
          {!permission ? (
            <button
              onClick={getMicrophonePermission}
              className=" bg-yellow-400 px-4 py-1 text-sm rounded-md"
            >
              Get Microphone
            </button>
          ) : null}
          {permission && recordingStatus === "inactive" ? (
            <button
              onClick={startRecording}
              className=" bg-green-400 px-4 py-1 text-sm rounded-md"
            >
              Start Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              onClick={pauseRecording}
              className=" bg-blue-400 px-4 py-1 text-sm rounded-md"
            >
              Pause Recording
            </button>
          ) : null}
          {recordingStatus === "paused" ? (
            <button
              onClick={resumeRecording}
              className=" bg-purple-400 px-4 py-1 text-sm rounded-md"
            >
              Resume Recording
            </button>
          ) : null}
          {recordingStatus === "recording" ? (
            <button
              onClick={stopRecording}
              className=" bg-red-400 px-4 py-1 text-sm rounded-md"
            >
              Stop Recording
            </button>
          ) : null}
        </div>
        {audio ? (
          <div className=" bg-transparent flex flex-col gap-3">
            <audio
              src={audio}
              className="w-56 h-9 rounded-full"
              controls
            ></audio>
            <a
              download
              href={audio}
              className=" w-44 px-2 self-center rounded-lg hover:text-green-700 active:bg-yellow-700"
            >
              Download Recording
            </a>
          </div>
        ) : null}

        <label htmlFor="mode"></label>
        <select name="mode" id="mode">
          <option onSelect={() => setMode("Public Mode")} value="Public Mode">
            Public Mode
          </option>
          <option onSelect={() => setMode("Private Mode")} value="Private Mode">
            Private Mode
          </option>
        </select>

        <input name="userId" hidden value={Session?.user?.id} />
        <input id="audio" name="audio" type="audio" hidden value={audio} />
        <button onClick={handleAudioSubmit} className=" px-4 py-1 bg-green-300">
          Post
        </button>
      </main>
    </div>
  );
};
export default AudioRecorder;
