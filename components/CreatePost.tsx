function CreatePost({ newPostModel, setNewPostModel, profileImage, username }) {
  function handleModel() {
    setNewPostModel(!newPostModel);
  }

  return (
    <main className=" border-2 border-gray-900 dark:border-white rounded-lg col-span-2 m-auto h-full max-w-3xl overflow-hidden overflow-y-auto mt-3 lg:pt-6 ">
      <section className=" flex items-center gap-5 px-5 border-b pt-3 pb-5 border-gray-400">
        <img className="rounded-full w-12 h-12" src={profileImage} alt="" />
        <span
          onClick={handleModel}
          className=" text-sm text-white flex justify-center items-center bg-gray-400 w-full h-12 border border-white rounded-full"
        >
          What's on your mind, {username}?
        </span>
      </section>
      <section className="flex dark:text-white justify-around py-3">
        <button onClick={handleModel}>Audio</button>
        <button onClick={handleModel}>Image</button>
      </section>
    </main>
  );
}

export default CreatePost;
