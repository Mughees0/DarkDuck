"use client";
import Session from "@/models/Session";
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

  // Audio Gain
  const audioCtx = new AudioContext();
  const gainNode = audioCtx.createGain();
  const mute = useRef(null);
  let source;

  const audioGain = async () => {
    if (navigator.mediaDevices.getUserMedia) {
      try {
        navigator.mediaDevices.getUserMedia(
          // constraints - only audio needed for this app
          {
            audio: true,
          }
        );
        source = audioCtx.createMediaStreamSource(stream);
      } catch (error) {
        console.error(`The following gUM error occurred: ${error}`);
      }
    } else {
      console.error("getUserMedia not supported on your browser!");
    }
    source.connect(gainNode);
    gainNode.connect(audioCtx.destination);
  };

  // …

  const HandleAudioGain = () => {
    if (mute.current.id === "") {
      // 0 means mute. If you still hear something, make sure you haven't
      // connected your source into the output in addition to using the GainNode.
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      mute.current.id = "activated";
      mute.current.textContent = "Unmute";
    } else {
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
      mute.current.id = "";
      mute.current.textContent = "Mute";
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

  const handleAudioSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("audio", audio);
      const { data } = await axios.post("/api/v1/upload/audio", formData);
      console.log(data);
    } catch (error: any) {
      console.log(error.response?.data);
    }
    setUploading(false);
  };

  // const handleAudioSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();
  //   const url = `/api/v1/upload/audio/${Session?.user?.id}`;
  //   const data = new FormData();
  //   data.set("userId", data.get("userId"));
  //   data.set("comment", data.get("comment"));
  //   data.set("audio");
  //   const config = {
  //     headers: {
  //       "content-type": "multipart/form-data",
  //     },
  //   };
  //   axios
  //     .post(url, data, config)
  //     .then((response) => {
  //       console.log(response);
  //       // eslint-disable-next-line no-restricted-globals
  //       setTimeout(() => location.reload(), 300);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  const stopRecording = () => {
    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
    };
  };

  console.log(audio);

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
        <form encType="multipart/form-data" onSubmit={handleAudioSubmit}>
          <div>
            <label htmlFor="mode"></label>
            <select name="mode" id="mode">
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
          <input id="audio" name="audio" type="audio" hidden />
          <button type="submit" className=" px-4 py-1 bg-green-300">
            Post
          </button>
        </form>
      </main>
    </div>
  );
};
export default AudioRecorder;
