"use client";

import axios from "axios";

import { useState } from "react";
import { GiDuck } from "@react-icons/all-files/gi/GiDuck";

function LikeButton({ userId, postId }: { userId: string; postId: string }) {
  const [liked, setLiked] = useState(false);
  async function handleLike(postId: string) {
    try {
      const req = await axios.post(
        "/api/v1/posts/like",
        {
          userId: userId,
          postId: postId,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (req.status === 200) {
        setLiked(!liked);
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "post not liked by the API, probably the post is not found or request failed." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  }

  return (
    <>
      <button
        onClick={() => handleLike(postId)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
      >
        <img
          src={liked ? "/assets/red-duck.png" : "/assets/yellow-duck.png"}
          className={liked ? " w-6 h-6" : " w-6 h-6"}
        />
      </button>
    </>
  );
}

export default LikeButton;
