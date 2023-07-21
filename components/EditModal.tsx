"use client";

import axios from "axios";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";
import { RiDeleteBin5Line } from "@react-icons/all-files/ri/RiDeleteBin5Line";
import { RiEdit2Line } from "@react-icons/all-files/ri/RiEdit2Line";

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
    <div className="flex justify-between flex-col w-40 pb-3 my-4 px-2 text-base list-none bg-white rounded-xl divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
      <div className=" flex justify-end bg-transparent">
        <IoMdCloseCircle
          className=" bg-transparent mt-3"
          onClick={() => setDeletePostModal(!deletePostModal)}
        />
      </div>
      <div className=" bg-transparent">
        <div className="flex gap-2 items-center bg-transparent">
          <RiDeleteBin5Line />
          <button onClick={handleDelete} className="hover:text-gray-500">
            Delete Post
          </button>
        </div>
        <div className="flex gap-2 items-center bg-transparent">
          <RiEdit2Line className=" bg-transparent" />
          <button
            onClick={() => {
              setEditPostModal(!editPostModal);
              setDeletePostModal(!deletePostModal);
            }}
            className="hover:text-gray-500"
          >
            Edit Post
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
