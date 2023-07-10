"use client";
import { useTimer } from "@/hooks/useTimer";
import { StorageRes, UserDataResponse } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "@react-icons/all-files/hi/HiOutlineDownload";
const mimeType = "audio/webm";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useMotionValue } from "framer-motion";
import { ChangeEventHandler, MouseEventHandler } from "react";
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
  accessKeyId: "AKIA2ARLEFL4TZQSFZWJ",
  secretAccessKey: "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",
  region: "EU(Stockholm)eu-north-1",
});

function NewPost({
  profileImage,
  username,
  setNewPostModel,
  newPostModel,
  setUpdatePosts,
  updatePosts,
}) {
  const { data: session } = useSession();
  const [audio, setAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState<Blob>(null);
  const [mode, setMode] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [userText, setUserText] = useState("");
  const [stream, setStream] = useState(null);
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  // const [currentFile, setCurrentFile] = useState(undefined);
  const [previewArray, setPreviewArray] = useState([]);
  const [postDisabled, setPostDisabled] = useState(true);
  const [files, setFiles] = useState<FileList | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const progress = useMotionValue(0);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    progress.set(0);
    setUpload(null);
  }, [files]);

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFiles(e.target.files);
  };

  const { milliseconds, setTime, startAndStop, seconds, hours, minutes } =
    useTimer();

  const selectFile = (event) => {
    for (let i = 0; i < event.target.files.length; i++) {
      setPreviewArray((prev) => [
        ...prev,
        event.target.files[i].type.includes("video") // if video file
          ? URL.createObjectURL(event.target.files[i]).concat("mp4") // create video url
          : URL.createObjectURL(event.target.files[i]), // else create image url  // create image url
      ]);
    }
  };

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
    if (audioBlob !== null) {
      setPostDisabled(false);
    }
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
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      setAudioBlob(audioBlob);
      const audioUrl = URL.createObjectURL(audioBlob);
      // setAudioBlob(mp3Blob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    let names: string[] = [];
    let audioName: string = `${Date.now()}.mp3`;
    e.preventDefault();
    setUploading(true);
    try {
      // 3. build form data for audio
      const formData = new FormData();
      formData.append(`${Date.now()}.mp3`, audioBlob);
      const params = {
        Bucket: "darkduck",
        Key: audioName,
        Body: audioBlob,
      };

      try {
        const upload = s3.upload(params);
        setUpload(upload);
        upload.on("httpUploadProgress", (p) => {
          progress.set(p.loaded / p.total);
        });
        await upload.promise();
      } catch (err) {
        console.error(err);
      }
    } catch (error) {
      if (error) {
        console.log(
          "Audio recording not uploaded." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      let file = files[i];
      const params = {
        Bucket: "darkduck",
        Key: file.name,
        Body: file,
      };

      try {
        const upload = s3.upload(params);
        setUpload(upload);
        upload.on("httpUploadProgress", (p) => {
          progress.set(p.loaded / p.total);
        });
        await upload.promise();
        names.push(file.name);
      } catch (err) {
        console.error(err);
      }
    }
    // 2. Use the FileName and store the Post Data in MongoDB
    try {
      const req = await axios.post(
        "/api/v1/posts/new_post",
        {
          userId: session?.user?.id,
          audio: audioName,
          audience: mode,
          text: userText,
          data: names,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (req.status === 200) {
        setUpdatePosts(!updatePosts);
        setNewPostModel(!newPostModel);
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
    handleCancel();
    setUploading(false);
  };

  function handleCancel() {
    if (!upload) return;
    upload.abort();
    progress.set(0);
    setUpload(null);
    setUserText("");
    setAudio(null);
    setPreviewArray([]);
    setNewPostModel(!newPostModel);
    setPostDisabled(true);
    setTime(0);
  }

  return (
    <main className=" border border-gray-900 dark:border-gray-200 w-72 h-110 sm:w-[400px] rounded-lg">
      <section className=" flex h-12 items-center rounded-t-lg justify-between px-4 border-b border-gray-400 dark:text-gray-100">
        <h1 className="font-bold">Create Post</h1>
        <button
          onClick={() => setNewPostModel(!newPostModel)}
          className="  bg-gray-300 dark:bg-gray-600 px-2 rounded-full"
        >
          X
        </button>
      </section>
      <form className="dark:text-gray-100 rounded-lg" onSubmit={handleNewPost}>
        <div className=" flex items-center gap-2 pl-3 pt-3 ">
          <img
            className="w-8 h-8 rounded-full"
            src={profileImage ? profileImage : "/assets/avatar.png"}
            alt=""
          />
          <span>
            <h2 className=" font-semibold text-sm"> {username}</h2>
            <select
              className=" text-sm bg-gray-300 dark:bg-gray-700 border border-black dark:border-gray-200  rounded-md px-1 "
              name="audience"
              id="audience"
            >
              <option onSelect={() => setMode("public")} value="public">
                Public
              </option>
              <option onSelect={() => setMode("private")} value="private">
                Only Me
              </option>
            </select>
          </span>
        </div>
        <input
          value={userText}
          className=" text-sm w-full h-12 px-2"
          onChange={(e) => {
            setUserText(e.target.value);
            if (e.target.value !== "") {
              setPostDisabled(false);
            } else if (e.target.value === "") {
              setPostDisabled(true);
            }
          }}
          placeholder={" What's on your mind, " + username + "?"}
          type="text"
        />
        <div className=" flex justify-center items-center ">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col items-center justify-center w-60 h-30 sm:w-[380px] sm:h-[200px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center w-full justify-center pt-5 pb-6  sm:h-[500px]">
              {previewArray.length !== 0 ? (
                <>
                  {" "}
                  <Carousel
                    showArrows={true}
                    showThumbs={false}
                    showStatus={false}
                    infiniteLoop={true}
                    transitionTime={500}
                    stopOnHover={true}
                    swipeable={true}
                    emulateTouch={true}
                    dynamicHeight={true}
                    // onChange={onChange}
                    // onClickItem={onClickItem}
                    // onClickThumb={onClickThumb}
                    showIndicators={false}
                    width={"200px"}
                  >
                    {previewArray.map((item) => {
                      if (item.includes("mp4")) {
                        const item2 = item?.substring(0, item.length - 3);
                        return <video key={item2} src={item2} controls />;
                      } else {
                        return <img key={item} src={item} alt="" />;
                      }
                    })}
                  </Carousel>
                </>
              ) : (
                <>
                  <svg
                    aria-hidden="true"
                    className="w-10 h-10  mb-3 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG or JPG / MP4 or MOV
                  </p>
                </>
              )}
            </div>
            <input
              name="files"
              accept="image/*,video/*"
              ref={ref}
              multiple
              onChange={(e) => {
                selectFile(e);
                handleFileChange(e);
                if (e.target.value !== "") {
                  setPostDisabled(false);
                } else if (e.target.value === "") {
                  setPostDisabled(true);
                }
              }}
              id="dropzone-file"
              type="file"
              className="hidden"
            />
          </label>
        </div>
        <div className=" flex justify-center border-b pb-2 border-gray-400">
          <article className="bg-transparent flex flex-col gap-3 w-[300px] items-center">
            <div className="bg-transparent flex flex-col gap-3 items-center ">
              <div className="space-y-3 sm:p-7 sm:m-2 bg-transparent py-2">
                <p id="counter" className=" bg-transparent text-3x text-center">
                  {hours}:{minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}:
                  {milliseconds.toString().padStart(2, "0")}
                </p>
                <div className=" bg-transparent flex justify-center flex-col   items-center">
                  {!permission ? (
                    <button
                      type="button"
                      onClick={getMicrophonePermission}
                      className=" bg-yellow-400 dark:text-gray-900 dark:bg-yellow-400 p-2 text-sm rounded-md"
                    >
                      Get Microphone
                    </button>
                  ) : null}
                  {permission && recordingStatus === "inactive" ? (
                    <button
                      type="button"
                      onClick={() => {
                        startRecording();
                        startAndStop();
                      }}
                      className=" bg-green-400 dark:bg-green-400 dark:text-gray-900 px-4 py-1 text-sm rounded-md"
                    >
                      Start Recording
                    </button>
                  ) : null}
                  {recordingStatus === "recording" ? (
                    <button
                      type="button"
                      onClick={() => {
                        pauseRecording();
                        startAndStop();
                      }}
                      className=" bg-blue-400 dark:bg-blue-400 dark:text-gray-900 px-3 py-1 text-sm rounded-md"
                    >
                      Pause Recording
                    </button>
                  ) : null}
                  {recordingStatus === "paused" ? (
                    <button
                      type="button"
                      onClick={() => {
                        resumeRecording();
                        startAndStop();
                      }}
                      className=" bg-purple-400 dark:text-gray-900 dark:bg-purple-400 px-4 py-1 text-sm rounded-md"
                    >
                      Resume Recording
                    </button>
                  ) : null}
                  {recordingStatus === "recording" ? (
                    <button
                      type="button"
                      onClick={() => {
                        startAndStop();
                        setTime(0);
                        stopRecording();
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
              <input name="userId" hidden />
              <input id="audio" name="audio" type="audio" hidden />
            </div>
          </article>
        </div>
        <div className=" flex gap-2 pb-3 mt-3 rounded-lg  justify-center w-full">
          <button
            onClick={handleCancel}
            type="button"
            className="bg-red-400 dark:bg-red-500 dark:text-gray-900 sm:px-14 px-6 rounded-md"
          >
            Cancel
          </button>
          <button
            className="bg-green-300 dark:bg-green-500 dark:text-gray-900 sm:px-16  px-9 rounded-md disabled:opacity-50"
            disabled={postDisabled}
            type="submit"
          >
            {uploading ? "wait..." : "Post"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default NewPost;
