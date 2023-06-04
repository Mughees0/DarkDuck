"use client";
import { useTimer } from "@/hooks/useTimer";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
const mimeType = "audio/webm";
import HiOutlineDownload from "@react-icons/all-files/hi/HiOutlineDownload";

const AudioRecorder = ({
  setAudioRecordingModel,
  audioRecordingModel,
  setUpdatePosts,
  updatePosts,
}) => {
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
        "/api/v1/posts/new_post",
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
      if (req.status == 200) {
        setUpdatePosts(!updatePosts);
        setAudioRecordingModel(!audioRecordingModel);
      }
      const res = await req.data;
    } catch (err) {
      throw err;
    }
    setUploading(false);
  };

  return (
    <div className="pointer-events-none relative w-[80%] lg:w-[30%] translate-y-[-50px] transition-all duration-300 ease-in-out z-[9999] transform-none opacity-100 dark:text-neutral-200 ">
      <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md bg-white bg-clip-padding text-current shadow-lg outline-none space-y-5">
        <div className="flex flex-shrink-0 items-center justify-between rounded-t-md p-4">
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
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 dark:text-neutral-200"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <main className="bg-transparent flex flex-col gap-3 items-center">
          <div className="bg-transparent flex flex-col gap-3 items-center ">
            <div className="space-y-3 p-7 m-2 bg-transparent border-2 rounded border-gray-200">
              <p id="counter" className=" bg-transparent text-3x text-center">
                {hours}:{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}:
                {milliseconds.toString().padStart(2, "0")}
              </p>
              <div className=" bg-transparent flex justify-center flex-col w-72  items-center">
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
                {recordingStatus === "recording" ? (
                  <button
                    onClick={() => {
                      pauseRecording();
                      startAndStop();
                    }}
                    className=" bg-blue-400 px-3 py-1 text-sm rounded-md"
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
                {recordingStatus === "recording" ? (
                  <button
                    onClick={() => {
                      startAndStop();
                      setTime(0);
                      stopRecording();
                    }}
                    className=" bg-red-400 px-4 py-1 my-3 text-sm rounded-md"
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
                    className=" w-52 gap-2 p-1 self-center rounded-lg hover:text-green-700 active:bg-yellow-700 flex justify-center items-center"
                  >
                    <HiOutlineDownload />
                    Download Recording
                  </a>
                </div>
              ) : null}
            </div>
            <div className="flex  bg-transparent justify-center w-auto border-1 border-black m-3">
              <label
                htmlFor="mode"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              ></label>
              <select
                name="mode"
                id="mode"
                className="block w-full p-2 mb-6 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="Select Record Mode Swing">
                  Select Record Mode Swing
                </option>
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

            <input name="userId" hidden />
            <input id="audio" name="audio" type="audio" hidden />
          </div>
          <div className="flex flex-shrink-0 flex-wrap items-center justify-end rounded-b-md bg-transparent border-opacity-100 p-4 dark:border-opacity-50">
            <button
              onClick={handleAudioSubmit}
              className=" py-1 bg-green-300 inline-block rounded bg-primary-100 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
            >
              {uploading ? "Uploading..." : "Post"}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AudioRecorder;
