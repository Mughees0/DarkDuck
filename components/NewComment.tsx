"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { RiSendPlaneLine } from "@react-icons/all-files/ri/RiSendPlaneLine";

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
        setUserComment("");
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
  console.log(userData?.profilePicture);

  return (
    <main
      className={
        reply && postId == postId
          ? "flex flex-col justify-evenly py-4 gap-5 bg-white"
          : "hidden"
      }
    >
      {" "}
      <section className="flex flex-col justify-evenly gap-2 bg-transparent">
        <h1 className=" underline font-bold text-lg dark:text-white bg-transparent">
          Comments
        </h1>
        {post?.comments?.map((data, i) => {
          return data !== null ? (
            <div key={i} className="flex gap-4 rounded-lg  py-1 px-2">
              <div className="flex items-center rounded-lg">
                <img
                  src={
                    userData?.profilePicture != undefined
                      ? process.env.REACT_APP_IMAGES_PATH +
                        userData?.profilePicture
                      : "/assets/avatar.png"
                  }
                  alt=""
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className=" flex flex-col dark:text-gray-200">
                <h2 className=" font-semibold ">{data?.userId?.username}</h2>
                <p> {data.comment}</p>
              </div>
            </div>
          ) : (
            <h1>No Comments</h1>
          );
        })}
      </section>
      <section className="border border-gray-500 rounded-lg overflow-hidden shadow-slate-400 shadow-md">
        {/* <h1 className=" underline font-bold text-lg">Write a comment</h1> */}
        <form
          onSubmit={handleNewComment}
          className=" bg-slate-200 flex justify-between px-3 py-2 rounded-lg "
        >
          <div className="flex gap-2 bg-transparent ">
            <label htmlFor="comment" className="bg-transparent">
              <img
                className="w-10 h-10 rounded-full bg-transparent"
                src={
                  userData?.profilePicture != undefined
                    ? process.env.REACT_APP_IMAGES_PATH +
                      userData?.profilePicture
                    : "/assets/avatar.png"
                }
              />
            </label>
            <input
              id="comment"
              className="bg-transparent  text-sm dark:text-white"
              type="text"
              placeholder="Write a comment..."
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
            />
          </div>
          <button type="submit">
            <RiSendPlaneLine className="bg-transparent dark:text-white" />
          </button>
        </form>
      </section>
    </main>
  );
}

export default NewComment;
