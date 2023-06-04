"use client";

import axios from "axios";

import { useEffect, useState } from "react";

function LikeButton({ userId, postId, setUpdateLikes, updateLikes, post }) {
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
        setLiked(true);
        setUpdateLikes(!updateLikes);
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

  async function handleUnLike(postId: string) {
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
        setLiked(false);
        setUpdateLikes(!updateLikes);
      }
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "post not unliked by the API, probably the post is not found or request failed." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  }

  useEffect(() => {
    if (post?.likes?.includes(userId)) {
      setLiked(true);
    }
  }, []);

  return (
    <>
      <button
        onClick={() => {
          if (post.likes.includes(userId)) {
            handleUnLike(postId);
          } else {
            handleLike(postId);
          }
        }}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
      >
        <img
          src={
            liked && post.likes.includes(userId)
              ? "/assets/solid-red-duck.png"
              : "/assets/yellow-duck.png"
          }
          className={liked ? " w-6 h-6" : " w-6 h-6"}
        />
      </button>
    </>
  );
}

export default LikeButton;
