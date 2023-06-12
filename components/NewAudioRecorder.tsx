"use client";
import { useTimer } from "@/hooks/useTimer";
import { StorageRes } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
const mimeType = "audio/webm";
import { HiOutlineDownload } from "@react-icons/all-files/hi/HiOutlineDownload";
import { log } from "console";
import vmsg, { Recorder } from "vmsg";
import { set } from "mongoose";

const recorder = new Recorder({
  wasmURL: "https://cdn.rawgit.com/Kagami/vmsg/df671f6b/vmsg.wasm",
  shimURL: "https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js",
});

// const trying = () => {
//   // vmsg
//   //   .record({
//   //     wasmURL: require("../../node_modules/vmsg/dist/vmsg.wasm"),
//   //     shimURL: "https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js",
//   //   })
//   //   .then((blob) => {
//   //     console.log("Recorded MP3", blob);
//   //   });
//   // Can be used like this:
//   //
//   // const form = new FormData();
//   // form.append("file[]", blob, "record.mp3");
//   // fetch("/upload.php", {
//   //   credentials: "include",
//   //   method: "POST",
//   //   body: form,
//   // }).then(resp => {
//   // });

//   vmsgRecoder.startRecording();
// };

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

  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState<Blob>(null);
  const [mode, setMode] = useState("");
  const [uploading, setUploading] = useState(false);
  const { milliseconds, setTime, startAndStop, seconds, hours, minutes } =
    useTimer();

  const startRecording = async () => {
    setIsLoading(true);

    if (isRecording) {
      const blob = await recorder.stopRecording();
      setAudioBlob(blob);
      setAudio(URL.createObjectURL(blob));
      setIsRecording(false);
      setIsLoading(false);
    } else {
      try {
        await recorder.initAudio();
        await recorder.initWorker();
        recorder.startRecording();
        setIsRecording(true);
        setIsLoading(false);
      } catch (error) {
        console.log("====================================");
        console.log(error);
        console.log("====================================");
        setIsLoading(false);
      }
    }
  };

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
          recordModeSwingId: mode
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

  return (
    <div className="pointer-events-none dark:border-2 dark:border-gray-100 relative rounded-lg lg:w-[30%] translate-y-[-50px] transition-all duration-300 ease-in-out z-[9999] transform-none opacity-100 dark:text-neutral-200 w-[80%] sm:w-[450px] ">
      <div className="min-[576px]:shadow-[0_0.5rem_1rem_rgba(#000, 0.15)] pointer-events-auto relative flex w-full flex-col rounded-md bg-clip-padding text-current outline-none space-y-5">
        <div className="flex flex-shrink-0 items-center justify-between  sm:w-full bg-gray-300 rounded-t-md p-4">
          <h2 className="text-xl bg-gray-300 font-medium leading-normal text-neutral-800 dark:text-neutral-200">
            Create Post
          </h2>
          <button
            type="button"
            className="box-content bg-gray-300 rounded-none border-none hover:no-underline hover:opacity-75 focus:opacity-100 focus:shadow-none focus:outline-none"
            aria-label="Close"
            onClick={() => setAudioRecordingModel(!audioRecordingModel)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-6 w-6 bg-gray-300 dark:text-neutral-200"
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
            <div className="space-y-3 sm:p-7 sm:m-2 bg-transparent border-2 py-2  rounded border-gray-200">
              <p id="counter" className=" bg-transparent text-3x text-center">
                {hours}:{minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}:
                {milliseconds.toString().padStart(2, "0")}
              </p>
              <div className=" bg-transparent flex justify-center flex-col w-72  items-center">
                {/* {!permission ? (
                  <button
                    onClick={getMicrophonePermission}
                    className=" bg-yellow-400 dark:text-gray-900 dark:bg-yellow-400 p-2 text-sm rounded-md"
                  >
                    Get Microphone
                  </button>
                ) : null} */}
                {!isRecording ? (
                  <button
                    onClick={() => {
                      startRecording();
                      startAndStop();
                    }}
                    className=" bg-green-400 dark:bg-green-400 dark:text-gray-900 px-4 py-1 text-sm rounded-md"
                  >
                    Start Recording
                  </button>
                ) : null}
                {/* {isRecording ? (
                  <button
                    onClick={() => {
                      pauseRecording();
                      startAndStop();
                    }}
                    className=" bg-blue-400 dark:bg-blue-400 dark:text-gray-900 px-3 py-1 text-sm rounded-md"
                  >
                    Pause Recording
                  </button>
                ) : null} */}
                {/* {recordingStatus === "paused" ? (
                  <button
                    onClick={() => {
                      resumeRecording();
                      startAndStop();
                    }}
                    className=" bg-purple-400 dark:text-gray-900 dark:bg-purple-400 px-4 py-1 text-sm rounded-md"
                  >
                    Resume Recording
                  </button>
                ) : null} */}
                {isRecording ? (
                  <button
                    onClick={() => {
                      startAndStop();
                      setTime(0);
                      startRecording();
                    }}
                    className=" bg-red-400 dark:text-gray-900 dark:bg-red-400 px-4 py-1 my-3 text-sm rounded-md"
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
                    className=" w-52 gap-2 p-1 self-center bg-blue-300 dark:bg-blue-300 dark:text-gray-900 rounded-lg hover:text-green-700 active:bg-yellow-700 flex justify-center items-center"
                  >
                    <HiOutlineDownload className="bg-blue-300 dark:bg-blue-300 " />
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
                className="block w-full p-2  text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              >
                <option value="Select Record Mode Swing">
                  Select Record Mode Swing
                </option>
                <option
                  onClick={() => setMode("633919ee9729ead90e0f6ac4")}
                  value="633919ee9729ead90e0f6ac4"
                >
                  Public Mode
                </option>
                <option
                  onClick={() => setMode("63391b065ef1e76cfdcf539c")}
                  value="63391b065ef1e76cfdcf539c"
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
              className=" py-1 bg-green-300 inline-block rounded bg-primary-100 px-6 mb-2 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-primary-700 transition duration-150 ease-in-out hover:bg-primary-accent-100 dark:bg-gray-100 dark:text-gray-900 focus:bg-primary-accent-100 focus:outline-none focus:ring-0 active:bg-primary-accent-200"
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
