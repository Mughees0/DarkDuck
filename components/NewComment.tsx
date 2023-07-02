"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

function NewComment({
  reply,
  post,
  postId,
  setNewPostModel,
  newPostModel,
  setUpdatePosts,
  updatePosts,
}) {
  const { data: session } = useSession();
  const [userComment, setUserComment] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleNewComment = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("====================================");
    console.log(e.currentTarget.id);
    console.log("====================================");
    setUploading(true);
    try {
      const req = await axios.post(
        "/api/v1/comment",
        {
          userId: session?.user?.id,
          postId: postId,
          comment: userComment,
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
      console.log("====================================");
      console.log(res);
      console.log("====================================");
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

  return (
    <main className={reply && postId == postId ? "" : "hidden"}>
      {" "}
      <section>
        {post?.comments?.map((comment) => {
          return <div>{comment.comment}</div>;
        })}
        comments
      </section>
      <form
        onSubmit={handleNewComment}
        className=" bg-gray-500 flex justify-between px-5 py-3 rounded-lg"
      >
        <input
          className="bg-transparent "
          type="text"
          placeholder="Write a comment..."
          value={userComment}
          onChange={(e) => setUserComment(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </main>
  );
}

export default NewComment;
