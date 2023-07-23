import { AiFillAudio } from "@react-icons/all-files/ai/AiFillAudio";
import { FcAddImage } from "@react-icons/all-files/fc/FcAddImage";

function CreatePost({ newPostModel, setNewPostModel, profileImage, username }) {
  function handleModel() {
    setNewPostModel(!newPostModel);
  }

  return (
    <>
      <section className=" flex items-center gap-3 px-5 pt-5 lg:pt-1 border-b pb-5 border-gray-400 bg-white dark:bg-gray-800">
        <img
          className=" rounded-full w-16 h-16 object-cover"
          src={
            profileImage !=
            "https://darkduck.s3.eu-north-1.amazonaws.com/undefined"
              ? profileImage
              : "/assets/avatar.png"
          }
          alt=""
        />
        <span
          onClick={handleModel}
          className=" text-sm text-white flex justify-center items-center bg-slate-600 w-[90%] h-12  border border-white rounded-full dark:bg-slate-900"
        >
          What's on your mind, {username}?
        </span>
      </section>
      <section className="flex dark:text-white justify-around py-3 bg-gray-50 dark:bg-slate-900">
        <button
          onClick={handleModel}
          className="flex items-center gap-2 text-sm dark:bg-transparent"
        >
          <AiFillAudio className=" text-red-400 text-lg dark:bg-transparent" />
          Audio
        </button>

        <button
          onClick={handleModel}
          className="flex items-center gap-2 text-sm dark:bg-transparent"
        >
          <FcAddImage className="text-xl dark:bg-transparent" />
          Image/Video
        </button>
      </section>
    </>
  );
}

export default CreatePost;
