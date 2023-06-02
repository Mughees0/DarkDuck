"use client";
import { useState, useRef } from "react";
const mimeType = "audio/webm";
const AudioRecorder = () => {
  const [stream, setStream] = useState(null);
  const [permission, setPermission] = useState(false);
  const mediaRecorder = useRef(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);

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

  //   mediaRecorder.onpause = () => {
  //     // do something in response to
  //     // recording being paused
  //   };

  //   mediaRecorder.onresume = () => {
  //     // do something in response to
  //     // recording being resumed
  //   };

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
      </main>
    </div>
  );
};
export default AudioRecorder;
