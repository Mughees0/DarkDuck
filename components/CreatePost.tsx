function CreatePost({ newPostModel, setNewPostModel }) {
  function handleModel() {
    setNewPostModel(!newPostModel);
  }

  return (
    <main className=" border-2 border-gray-900 dark:border-white rounded-lg col-span-2 m-auto h-full max-w-3xl overflow-hidden overflow-y-auto mt-3 lg:pt-6 ">
      <section className=" flex items-center gap-5 px-5 border-b pt-3 pb-5 border-gray-400">
        <img
          className="rounded-full w-12 h-12"
          src="https://scontent-hel3-1.xx.fbcdn.net/v/t39.30808-1/292874351_3208190852763462_524660816298735829_n.jpg?stp=c60.0.480.480a_dst-jpg_p480x480&_nc_cat=100&ccb=1-7&_nc_sid=7206a8&_nc_ohc=Dk-ZuluxqhwAX9hNMip&_nc_ht=scontent-hel3-1.xx&oh=00_AfB65BuI0Lb3u6xEhWy5qZZE6Td1GfzYQHfmD1-yT22cVA&oe=6493B34C"
          alt=""
        />
        <span className=" text-sm text-white flex justify-center items-center bg-gray-400 w-full h-12 border border-white rounded-full">
          What's on your mind, mughees
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
