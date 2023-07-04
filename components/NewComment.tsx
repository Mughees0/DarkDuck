"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

function NewComment({
  userData,
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
    <main
      className={
        reply && postId == postId
          ? "flex flex-col justify-evenly py-2 gap-5"
          : "hidden"
      }
    >
      {" "}
      <section className="flex flex-col justify-evenly gap-2">
        <h1 className=" underline font-bold text-lg">Comments</h1>
        {post?.comments?.map((data, i) => {
          return data !== null ? (
            <div
              key={i}
              className="flex gap-4 rounded-lg border border-gray-500 py-1 px-2"
            >
              <div className="flex items-center rounded-lg">
                <img
                  src={
                    process.env.REACT_APP_IMAGES_PATH +
                    data.userId.profilePicture
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className=" flex flex-col">
                <h2 className=" font-semibold ">{data.userId.username}</h2>
                <p> {data.comment}</p>
              </div>
            </div>
          ) : (
            <h1>No Comments</h1>
          );
        })}
      </section>
      <section>
        <h1 className=" underline font-bold text-lg">Write a comment</h1>
        <form
          onSubmit={handleNewComment}
          className=" bg-gray-200 flex justify-between px-5 py-3 rounded-lg"
        >
          <label htmlFor="comment" className="bg-transparent">
            <img
              className="w-10 h-10 rounded-full bg-transparent"
              src={process.env.REACT_APP_IMAGES_PATH + userData?.profilePicture}
            />
          </label>
          <input
            id="comment"
            className="bg-transparent "
            type="text"
            placeholder="Write a comment..."
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </section>
    </main>
  );
}

export default NewComment;
