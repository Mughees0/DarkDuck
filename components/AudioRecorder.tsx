"use client";
import { useTimer } from "@/hooks/useTimer";
import Session from "@/models/Session";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
const mimeType = "audio/webm";

const AudioRecorder = ({ setAudioRecordingModel, audioRecordingModel }) => {
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
  const { milliseconds, setTime, startAndStop, seconds, hours, minutes } =
    useTimer();

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
    } catch (err) {
      throw err;
    }
    setUploading(false);
  };

  return (
    <div className="pointer-events-none relative w-[40%] translate-y-[-50px] transition-all duration-300 ease-in-out z-[9999] transform-none opacity-100">
      <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md border-none bg-white bg-clip-padding text-current shadow-lg outline-none dark:bg-neutral-600 space-y-5">
        <div className="flex flex-shrink-0 items-center justify-between rounded-t-md border-b-2 border-neutral-100 border-opacity-100 p-4 dark:border-opacity-50">
          <h2 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
            Create Post
          </h2>
          <button
            type="button"
            className="box-content rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            aria-label="Close"
            onClick={() => setAudioRecordingModel(!audioRecordingModel)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <main className="bg-transparent flex flex-col gap-3 items-center ">
          <div className="space-y-3 p-3 bg-transparent ">
            <p id="counter" className=" bg-transparent text-3x text-center">
              {hours}:{minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}:
              {milliseconds.toString().padStart(2, "0")}
            </p>
            <div className=" bg-transparent w-44 flex flex-col items-center">
              {" "}
              {!permission ? (
                <button
                  onClick={getMicrophonePermission}
                  className=" bg-yellow-400 p-2 text-sm rounded-md"
                >
                  Get Microphone
                </button>
              ) : null}
              {permission && recordingStatus === "inactive" ? (
                <button
                  onClick={() => {
                    startRecording();
                    startAndStop();
                  }}
                  className=" bg-green-400 px-4 py-1 text-sm rounded-md"
                >
                  Start Recording
                </button>
              ) : null}
              <div className="flex justify-between w-44 bg-transparent">
                {recordingStatus === "recording" ? (
                  <button
                    onClick={() => {
                      pauseRecording();
                      startAndStop();
                    }}
                    className=" bg-blue-400 px-4 py-1 text-sm rounded-md"
                  >
                    Pause Recording
                  </button>
                ) : null}
                {recordingStatus === "paused" ? (
                  <button
                    onClick={() => {
                      resumeRecording();
                      startAndStop();
                    }}
                    className=" bg-purple-400 px-4 py-1 text-sm rounded-md"
                  >
                    Resume Recording
                  </button>
                ) : null}
              </div>
              {recordingStatus === "recording" ? (
                <button
                  onClick={() => {
                    startAndStop();
                    setTime(0);
                    stopRecording();
                  }}
                  className=" bg-red-400 px-4 py-1 text-sm rounded-md"
                >
                  Stop Recording
                </button>
              ) : null}
            </div>
            {audio ? (
              <div className=" bg-transparent flex items-center flex-col gap-3">
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
            <div className="flex  bg-transparent justify-center w-auto border-1 border-black m-3">
              <label htmlFor="mode"></label>
              <select
                className=" border-2 border-gray-500"
                name="mode"
                id="mode"
              >
                <option
                  onSelect={() => setMode("Public Mode")}
                  value="Public Mode"
                >
                  Public Mode
                </option>
                <option
                  onSelect={() => setMode("Private Mode")}
                  value="Private Mode"
                >
                  Private Mode
                </option>
              </select>
            </div>

            <input name="userId" hidden value={Session?.user?.id} />
            <input id="audio" name="audio" type="audio" hidden value={audio} />
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md bg-transparent border-opacity-100 p-4 dark:border-opacity-50">
            <button
              onClick={handleAudioSubmit}
              className=" py-1 bg-green-300 inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
            >
              Post
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AudioRecorder;
