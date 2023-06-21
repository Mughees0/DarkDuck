import { useTimer } from "@/hooks/useTimer";
import { StorageRes, UserDataResponse } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { HiOutlineDownload } from "@react-icons/all-files/hi/HiOutlineDownload";
import { Recorder } from "vmsg";

const recorder = new Recorder({
  wasmURL: "https://cdn.rawgit.com/Kagami/vmsg/df671f6b/vmsg.wasm",
  shimURL: "https://unpkg.com/wasm-polyfill.js@0.2.0/wasm-polyfill.js",
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
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState(null);
  const [audioBlob, setAudioBlob] = useState<Blob>(null);
  const [mode, setMode] = useState("public");
  const [uploading, setUploading] = useState(false);
  const [userText, setUserText] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const [currentFile, setCurrentFile] = useState(undefined);
  const [previewImage, setPreviewImage] = useState(undefined);
  const [postDisabled, setPostDisabled] = useState(true);
  const { milliseconds, setTime, startAndStop, seconds, hours, minutes } =
    useTimer();

  const selectFile = (event) => {
    setCurrentFile(event.target.files[0]);
    setPreviewImage(URL?.createObjectURL(event.target.files[0]));
  };
  const startRecording = async () => {
    setIsLoading(true);
    if (isRecording) {
      const blob = await recorder.stopRecording();
      setAudioBlob(blob);
      setAudio(URL?.createObjectURL(blob));
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
    if (audioBlob !== null) {
      setPostDisabled(false);
    }
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
          userId: session?.user?.id,
          audio: storageResAudio?.success,
          audience: mode,
          text: userText,
          image: storageResImage?.success,
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
    setUploading(false);
  };

  function handleCancel() {
    setAudio(null);
    setPreviewImage(null);
    setNewPostModel(!newPostModel);
    setPostDisabled(true);
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
            <div className="flex flex-col items-center w-full justify-center pt-5 pb-6  sm:h-[200px]">
              {previewImage ? (
                <img className="  h-44 " src={previewImage} alt="" />
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG or JPG (MAX. 800x400px)
                  </p>{" "}
                </>
              )}
            </div>
            <input
              name="files"
              accept="image/*"
              ref={ref}
              multiple
              onChange={(e) => {
                selectFile(e);
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
                  {!isRecording ? (
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
                  {isRecording ? (
                    <button
                      type="button"
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
