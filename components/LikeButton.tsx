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
      throw new Error("Like doesn't work:> " + error);
    }
  }

  return (
    <>
      <button
        onClick={() => handleLike(postId)}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
      >
        <GiDuck
          className={
            liked
              ? " w-5 h-5 text-red-400"
              : " w-5 h-5 hover:text-blue-600 text-yellow-400"
          }
        />
      </button>
    </>
  );
}

export default LikeButton;
