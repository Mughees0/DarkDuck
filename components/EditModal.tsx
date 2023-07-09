"use client";

import axios from "axios";
import { IoMdCloseCircle } from "@react-icons/all-files/io/IoMdCloseCircle";

function EditModal({
  postId,
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
      console.log("====================================");
      console.log(res);
      console.log("====================================");
      setUpdatePosts(!updatePosts);
      setEditPostModal(!editPostModal);
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
    <div className="flex justify-between w-40 h-10 my-4 px-4 text-base list-none bg-white rounded divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
      <button onClick={handleDelete} className="hover:text-gray-500">
        Delete Post
      </button>
      <IoMdCloseCircle
        className=" bg-transparent mt-3"
        onClick={() => setEditPostModal(!editPostModal)}
      />
    </div>
  );
}

export default EditModal;
