"use client";

import axios from "axios";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";
import { RiDeleteBin5Line } from "@react-icons/all-files/ri/RiDeleteBin5Line";
import { RiEdit2Line } from "@react-icons/all-files/ri/RiEdit2Line";
import { S3 } from "aws-sdk";

const s3 = new S3({
  accessKeyId: process.env.ACCESSKEYID,
  secretAccessKey: process.env.SECRETACCESSKEY,
  region: process.env.REGION,
});

function EditModal({
  postId,
  deletePostModal,
  setDeletePostModal,
  editPostModal,
  setEditPostModal,
  updatePosts,
  setUpdatePosts,
}) {
  const deletePostData = async (id: string) => {
    try {
      // const id = session?.user?.id;
      const req = await axios.delete(`/api/v1/posts/post/${id}`);
      const res = await req.data;
      for (let i = 0; i < res?.userPosts.data?.length; i++) {
        const params = {
          Bucket: "darkduck",
          Key: res?.userPosts?.data[i],
        };

        try {
          await s3.headObject(params).promise();
          try {
            await s3.deleteObject(params).promise();
          } catch (err) {
            console.log("ERROR in file Deleting : " + JSON.stringify(err));
          }
        } catch (err) {
          console.log("File not Found ERROR : " + err.code);
        }
      }
      setUpdatePosts(!updatePosts);
      setDeletePostModal(!deletePostModal);
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "Post not deleted" + " The error message:> " + error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  };
  function handleDelete(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    deletePostData(postId);
  }

  return (
    <div className="flex justify-between flex-col w-40 pb-3 my-4 px-2 text-base list-none bg-white rounded-xl divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 dark:text-gray-50">
      <div className=" flex justify-end bg-transparent dark:bg-gray-700">
        <IoMdCloseCircle
          className=" bg-transparent mt-3 dark:bg-gray-700"
          onClick={() => setDeletePostModal(!deletePostModal)}
        />
      </div>
      <div className=" bg-transparent dark:bg-gray-700">
        <div className="flex gap-2 items-center bg-transparent dark:bg-gray-700">
          <RiDeleteBin5Line className=" dark:bg-gray-700" />
          <button
            onClick={handleDelete}
            className="hover:text-gray-500 dark:bg-gray-700"
          >
            Delete Post
          </button>
        </div>
        <div className="flex gap-2 items-center bg-transparent dark:bg-gray-700">
          <RiEdit2Line className=" bg-transparent dark:bg-gray-700" />
          <button
            onClick={() => {
              setEditPostModal(!editPostModal);
              setDeletePostModal(!deletePostModal);
            }}
            className="hover:text-gray-500 dark:bg-gray-700"
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
