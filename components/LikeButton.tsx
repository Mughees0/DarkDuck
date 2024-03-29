"use client";

import { useEffect, useState } from "react";

function LikeButton({ userId, postId, setUpdateLikes, updateLikes, post }) {
  const [liked, setLiked] = useState(false);

  async function handleLike(postId: string) {
    try {
      const req = await fetch("/api/v1/posts/like", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-store", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId,
        }), // body data type must match "Content-Type" header
      });
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
      const req = await fetch("/api/v1/posts/like", {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        cache: "no-store", // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          postId: postId,
        }), // body data type must match "Content-Type" header
      });
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
          if (post?.likes?.includes(userId)) {
            handleUnLike(postId);
          } else {
            handleLike(postId);
          }
        }}
        className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white bg-transparent dark:bg-transparent"
      >
        <img
          src={liked ? "/assets/solid-red-duck.png" : "/assets/yellow-duck.png"}
          className={
            liked
              ? " w-6 h-6 bg-transparent"
              : " w-6 h-6 bg-transparent dark:bg-transparent"
          }
        />
      </button>
    </>
  );
}

export default LikeButton;
