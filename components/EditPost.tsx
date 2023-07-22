"use client";
import { useTimer } from "@/hooks/useTimer";
import { StorageRes, UserDataResponse, UserPostResponse } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "@react-icons/all-files/hi/HiOutlineDownload";
const mimeType = "audio/webm";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import { useMotionValue } from "framer-motion";
import { ChangeEventHandler } from "react";
import S3 from "aws-sdk/clients/s3";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";

const s3 = new S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION,
});

function EditPost({
  postId,
  profileImage,
  username,
  setEditPostModel,
  EditPostModel,
  setUpdatePosts,
  updatePosts,
  updateAudio,
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
  const [previewArray, setPreviewArray] = useState([]);
  const [previousArray, setPreviousArray] = useState([]);
  const [postDisabled, setPostDisabled] = useState(true);
  const [files, setFiles] = useState<FileList | null>(null);
  const [upload, setUpload] = useState<S3.ManagedUpload | null>(null);
  const progress = useMotionValue(0);
  const [disableInput, setDisableInput] = useState(false);

  useEffect(() => {
    return upload?.abort();
  }, []);

  useEffect(() => {
    getUserData();
  }, [postId]);

  useEffect(() => {
    progress.set(0);
    setUpload(null);
  }, [files]);

  const options = ["public", "private"];
  const onOptionChangeHandler = (event) => {
    setMode(event.target.value);
  };

  async function getUserData() {
    try {
      const req = await axios.get(`/api/v1/posts/post/${postId}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      if (req.status === 200) {
        const res = await req.data;
        setUserText(res?.userPost?.text);
        setAudio(res?.userPost?.audio);
        setMode(res?.userPost?.audience);
        setPreviousArray(res?.userPost?.data);
        const imagesArray = [];
        for (let i = 0; i < res?.userPost?.data.length; i++) {
          imagesArray.push(
            process.env.REACT_APP_IMAGES_PATH + res?.userPost?.data[i]
          );
        }
        setPreviewArray(imagesArray);
      }
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
  }

  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    setFiles(e.target.files);
  };

  const { milliseconds, setTime, startAndStop, seconds, hours, minutes } =
    useTimer();

  const selectFile = (event: ChangeEvent<HTMLInputElement>) => {
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

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = async () => {
      //creates a blob file from the audiochunks data
      const audioBlob2 = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      setAudioBlob(audioBlob2);
      const audioUrl = URL.createObjectURL(audioBlob2);
      // setAudioBlob(mp3Blob);
      setAudio(audioUrl);
      setPostDisabled(false);
      setAudioChunks([]);
    };
  };
  const handleNewPost = async (e: FormEvent<HTMLFormElement>) => {
    let names: string[] = [];
    let aName = "";
    e.preventDefault();
    setUploading(true);

    if (audioBlob) {
      try {
        // 3. build form data for audio
        let audioName: string = `${Date.now()}.mp3`;
        const params = {
          Bucket: "darkduck",
          Key: audioName,
          Body: audioBlob,
        };
        aName = audioName;
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
    }
    for (let i = 0; i < files?.length; i++) {
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
    for (let i = 0; i < previewArray.length; i++) {
      if (
        previewArray[i].includes(
          "https://darkduck.s3.eu-north-1.amazonaws.com/"
        )
      ) {
        previewArray[i] = previewArray[i].replace(
          "https://darkduck.s3.eu-north-1.amazonaws.com/",
          ""
        );
      } else if (previewArray[i].includes("blob:http://localhost:300")) {
        previewArray.splice(i, 1);
      }
    }

    const toBeDeleted = previousArray.filter((x) => !previewArray.includes(x));

    console.log("====================================");
    console.log(toBeDeleted);
    console.log("====================================");

    for (let i = 0; i < toBeDeleted?.length; i++) {
      const params = {
        Bucket: "darkduck",
        Key: toBeDeleted[i],
      };

      try {
        await s3.headObject(params).promise();
        try {
          await s3.deleteObject(params).promise();
        } catch (err) {
          console.log("ERROR in file Deleting : " + JSON.stringify(err));
        }
      } catch (err) {
        console.log("File not Found ERROR : " + err.code);
      }
    }

    try {
      const req = await axios.post(
        `/api/v1/posts/post/${postId}`,
        {
          userId: session?.user?.id,
          audio: aName,
          audience: mode,
          text: userText,
          data: [...previewArray, ...names],
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (req.status === 200) {
        // handleCancel();
        updateAudio("https://darkduck.s3.eu-north-1.amazonaws.com/" + aName);
        setEditPostModel(!EditPostModel);
      }
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

    getUserData();
    setUpdatePosts(!updatePosts);
    setUploading(false);
    handleCancel();
  };

  function handleCancel() {
    setUpload(null);
    setUserText("");
    setAudio(null);
    setPreviewArray([]);
    setEditPostModel(!EditPostModel);
    setPostDisabled(true);
    setTime(0);
    if (!upload) return;
    upload.abort();
    progress.set(0);
  }

  function handleRemoveImage(item) {
    setDisableInput(true);
    const index = previewArray.indexOf(item);
    console.log("index:", index);

    if (index > -1) {
      const newArr = previewArray.filter(function (i) {
        return i !== item;
      });
      setPreviewArray(newArr);
    }
    setPostDisabled(false);
  }

  return (
    <main className=" border border-gray-900 dark:border-gray-200 w-72 h-110 sm:w-[400px] rounded-lg">
      <section className=" flex h-12 items-center rounded-t-lg justify-between px-4 border-b border-gray-400 dark:text-gray-100">
        <h1 className="font-bold">Edit Post</h1>
        <button
          onClick={() => {
            setEditPostModel(!EditPostModel);
            getUserData();
          }}
        >
          <IoMdCloseCircle className=" text-lg" />
        </button>
      </section>
      <form className="dark:text-gray-100 rounded-lg" onSubmit={handleNewPost}>
        <div className=" flex items-center gap-2 pl-3 pt-3 ">
          <img
            className="w-8 h-8 rounded-full object-cover"
            src={profileImage ? profileImage : "/assets/avatar.png"}
            alt=""
          />
          <span>
            <h2 className=" font-semibold text-sm"> {username}</h2>
            <select
              className=" text-sm bg-gray-300 dark:bg-gray-700 border border-black dark:border-gray-200  rounded-md px-1 "
              name="audience"
              id="audience"
              onChange={onOptionChangeHandler}
            >
              {options.map((option, index) => {
                return <option key={index}>{option}</option>;
              })}
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
        <div className=" flex justify-center items-start">
          <label
            onClick={() =>
              disableInput ? setDisableInput(false) : disableInput
            }
            htmlFor="dropzone-file2"
            className="flex flex-col items-center justify-center w-60 sm:w-[380px] h-[200px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 label-scroll"
          >
            {previewArray?.length !== 0 ? (
              <div className="max-h-44 my-4">
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
                  showIndicators={false}
                  width={"200px"}
                >
                  {previewArray?.map((item, i) => {
                    if (
                      item?.includes(
                        "https://darkduck.s3.eu-north-1.amazonaws.com/"
                      ) &&
                      item?.includes("mp4", "mov")
                    ) {
                      return (
                        <>
                          <video key={item} src={item} controls playsInline />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item)}
                            className="top-0 left-0 right-0 text-yellow-700 bg-gray-200 bg-opacity-70 font-bold absolute "
                          >
                            Remove
                          </button>
                        </>
                      );
                    } else if (item?.includes("mp4")) {
                      const item2 = item?.substring(0, item.length - 3);
                      return (
                        <div>
                          <video key={item2} src={item2} controls playsInline />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item)}
                            className="top-0 left-0 right-0 text-yellow-700 bg-gray-200 bg-opacity-70 font-bold absolute "
                          >
                            Remove
                          </button>
                        </div>
                      );
                    } else {
                      return (
                        <div>
                          <img key={item} src={item} alt="" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(item)}
                            className="top-0 left-0 right-0 text-yellow-700 bg-gray-200 bg-opacity-70 font-bold absolute "
                          >
                            Remove
                          </button>
                        </div>
                      );
                    }
                  })}
                </Carousel>
              </div>
            ) : (
              <>
                <svg
                  aria-hidden="true"
                  className="w-10 h-10  mb-3 text-gray-400 bg-gray-50 dark:bg-gray-700"
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
                <p className="mb-2 text-sm text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-700">
                  <span className="font-semibold bg-gray-50 dark:bg-gray-700">
                    Click to upload
                  </span>
                </p>
                <p className="text-xs text-gray-500 bg-gray-50 dark:text-gray-400 dark:bg-gray-700">
                  PNG or JPG / MP4 or MOV
                </p>
              </>
            )}
            <input
              name="files2"
              className="hidden"
              accept="image/*,video/*"
              disabled={disableInput}
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
              id="dropzone-file2"
              type="file"
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
                    <audio className="w-56 h-9 rounded-full" controls>
                      <source
                        src={
                          audio.includes("blob:http")
                            ? audio
                            : "https://darkduck.s3.eu-north-1.amazonaws.com/" +
                              audio
                        }
                        type="audio/mpeg"
                      />
                    </audio>
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

export default EditPost;
