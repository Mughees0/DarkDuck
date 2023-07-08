"use client";

import axios from "axios";

function EditModal({ postId, editPostModal, setEditPostModal }) {
  const deletePostData = async (id: string) => {
    try {
      // const id = session?.user?.id;
      const req = await axios.delete(`/api/v1/posts/post/${id}`);
      const res = await req.data;
      console.log("====================================");
      console.log(res);
      console.log("====================================");
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
    <div className=" w-40 h-40">
      <button onClick={() => setEditPostModal(!editPostModal)}>X</button>
      <button>{postId}</button>
    </div>
  );
}

export default EditModal;
