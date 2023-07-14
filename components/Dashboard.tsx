"use client";
import { PostsResponse, UserDataResponse } from "@/types";
import axios from "axios";
import React, { useState, useEffect, FormEvent } from "react";
import { BsArrowRight } from "@react-icons/all-files/bs/BsArrowRight";
import { SiAudiomack } from "@react-icons/all-files/si/SiAudiomack";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import LikeButton from "./LikeButton";
import NewPost from "./NewPost";
import CreatePost from "./CreatePost";
import { Carousel } from "react-responsive-carousel";
import NewComment from "./NewComment";
import EditModal from "./EditModal";
import ReactPaginate from "react-paginate";

const convertDate = (TZdate) => {
  let date = new Date(TZdate);
  return date;
  //   dateFormat(date, "mmmm dd, yyyy");
};

const Dashboard = ({ setUpdatePosts, updatePosts }) => {
  const [reply, setReply] = useState(false);
  const [posts, setPosts] = useState<PostsResponse>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [updateLikes, setUpdateLikes] = useState(false);
  const [newPostModel, setNewPostModel] = useState(false);
  const [newCommentModel, setNewCommentModel] = useState(false);
  const [userData, setUserData] = useState<UserDataResponse>();
  const { data: session } = useSession();
  const [userComment, setUserComment] = useState("");
  const [uploading, setUploading] = useState(false);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState<string>("-1");
  const [currentPage, setCurrentPage] = useState(null);
  const [pageCount, setPageCount] = useState(1);

  const toggleHandler = (id: string) => () =>
    setActive((active) => (active === id ? "-1" : id));

  const getPosts = async (page) => {
    try {
      const req = await fetch(`/api/v1/posts?page=${page}`, {
        cache: "no-store",
      });
      const res = await req.json();
      setPageCount(res.meta.pageCount);
      setCurrentPage(res.meta.currentPage);
      setPosts(res.result);
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "Posts not fetched by the API, probably the posts is not found or request failed." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  };

  const fetchUserData = async (id: string) => {
    try {
      // const id = session?.user?.id;
      const req = await axios.get(`/api/v1/users/user/${id}`);
      const res = await req.data;
      setUserData(res);
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "User not fetched by the API, probably the user is not found or request failed." +
            " The error message:> " +
            error.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  };

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
          postId: e.currentTarget.id,
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

  function handlePageClick({ selected: selectedPage }) {
    console.log("selected page", selectedPage);

    getPosts(selectedPage + 1);
    console.log("api called", posts);
  }

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    fetchUserData(session?.user?.id);
    setIsLoaded((isLoaded) => true);
    if (currentPage === null) {
      getPosts(1);
    } else {
      getPosts(currentPage);
    }
  }, [updatePosts, updateLikes, session?.user?.id]);

  if (posts && isLoaded) {
    return (
      <>
        <main className="bg-gray-50">
          {/* <section className="bg-cover bg-center bg-bgCover text-black text-center flex flex-col items-center">
            <div className="bg-transparent dark:bg-transparent pt-5 md:pt-10 font-bold">
              <img
                height={100}
                width={300}
                src="/assets/name.png"
                className=" w-36 h-10 md:w-96 md:h-24 bg-transparent dark:bg-transparent "
                alt="DarkDuck Logos"
              />
            </div>

            <p className="bg-transparent dark:bg-transparent pt-2 text-sm lg:text-2xl w-3/4 lg:w-2/4 pb-3">
              "Experience the future of comprehensive digital interaction with
              DarkDuck, an all-in-one solution for housing, supply chain
              management, musical collaboration, and social connectivity –
              transforming your online world seamlessly."
            </p>
            <div className=" text-black rounded items-center p-2 m-5 bg-gray-200 dark:bg-gray-400  hover:bg-gray-400 hover:text-lg dark:hover:bg-gray-600 px-3">
              <button className="flex items-center gap-2 bg-transparent dark:bg-transparent">
                View Posts
                <BsArrowRight className=" bg-transparent dark:bg-transparent" />
              </button>
            </div>
          </section> */}
          <div className="flex flex-col items-center lg:flex-row lg:items-start ">
            <section className="lg:w-2/3 pb-4 md:px-6 md:w-full">
              <h1 className="text-3xl font-serif font-bold col-span-2 m-auto max-w-3xl space-y-6 overflow-y-auto mt-3 lg:pt-6  dark:text-white">
                Latest
              </h1>

              <div
                className={
                  newPostModel
                    ? "flex justify-center items-center bg-opacity-25 dark:bg-opacity-25 bg-gray-400 fixed top-0 z-40 h-screen w-full left-0 right-0"
                    : "hidden"
                }
              >
                <NewPost
                  username={userData?.username}
                  profileImage={
                    process.env.REACT_APP_IMAGES_PATH + userData?.profilePicture
                  }
                  setNewPostModel={setNewPostModel}
                  newPostModel={newPostModel}
                  setUpdatePosts={setUpdatePosts}
                  updatePosts={updatePosts}
                />
              </div>
              <ul>
                <div className="col-span-2 m-auto h-full max-w-3xl overflow-hidden overflow-y-auto mt-3 lg:pt-6 border-2 rounded-lg border-gray-600">
                  <CreatePost
                    username={userData?.username}
                    profileImage={
                      process.env.REACT_APP_IMAGES_PATH +
                      userData?.profilePicture
                    }
                    newPostModel={newPostModel}
                    setNewPostModel={setNewPostModel}
                  />
                </div>
                {posts ? (
                  posts?.length ? (
                    posts?.map((post) => {
                      return (
                        <li key={post?._id}>
                          <div className="col-span-2 m-auto h-full max-w-3xl space-y-6 overflow-hidden overflow-y-auto mt-3 lg:pt-6 ">
                            <div className="flex rounded-lg border-2 overflow-hidden border-black bg-white dark:border-gray-700 dark:bg-gray-800 flex-col shadow ">
                              <div className="flex h-full flex-col justify-center gap-3 p-6 pb-0">
                                <div className="flex items-center space-x-4">
                                  <div className="shrink-0">
                                    <img
                                      width={40}
                                      height={40}
                                      alt="User Profile Picture"
                                      src={
                                        post?.userId?.profilePicture
                                          ? process.env.REACT_APP_IMAGES_PATH +
                                            post?.userId?.profilePicture
                                          : "/assets/avatar.png"
                                      }
                                      className="h-10 w-10 rounded-full"
                                    />
                                  </div>
                                  <div className="min-w-0  flex-1 items-start flex flex-col gap-1 h-20  ">
                                    <strong className=" justify-self-start p-1 px-2 bg-gray-900 text-gray-50 rounded dark:bg-white dark:text-black ">
                                      {post?.audience === "public"
                                        ? "Public"
                                        : "Private" ||
                                          post?.recordModeSwingId ===
                                            "633919ee9729ead90e0f6ac4"
                                        ? "Public World Mode"
                                        : "Private World Mode"}
                                    </strong>
                                    <p className="truncate text-sm  font-semibold text-gray-900 dark:text-white">
                                      {post?.userId?.username}
                                    </p>
                                    <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                                      {post?.createdAt
                                        ? new Date(
                                            post.createdAt
                                          ).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                          })
                                        : null}
                                    </p>
                                  </div>
                                  <a className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth="0"
                                      viewBox="0 0 20 20"
                                      className="text-2xl"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"></path>
                                    </svg>
                                  </a>
                                </div>
                                <div className="space-y-4">
                                  <div className="flex dark:text-gray-200 flex-col gap-4">
                                    {post?.text ? (
                                      post.text.length > 182 ? (
                                        active === post?._id ? (
                                          <>
                                            <p>{post?.text}</p>
                                            <button
                                              className="text-blue-500 underline"
                                              onClick={toggleHandler(post?._id)}
                                            >
                                              show less
                                            </button>
                                          </>
                                        ) : (
                                          <>
                                            <p className="overflow-hidden h-12 ">
                                              {post?.text}
                                            </p>
                                            <div className="flex gap-2">
                                              <span>...</span>
                                              <button
                                                className="text-blue-500 underline"
                                                onClick={toggleHandler(
                                                  post?._id
                                                )}
                                              >
                                                show more
                                              </button>
                                            </div>
                                          </>
                                        )
                                      ) : (
                                        <p>{post?.text}</p>
                                      )
                                    ) : (
                                      <></>
                                    )}

                                    {post?.data?.length !== 0 ? (
                                      <>
                                        {" "}
                                        <Carousel
                                          showArrows={true}
                                          showThumbs={false}
                                          showStatus={false}
                                          infiniteLoop={true}
                                          transitionTime={500}
                                          stopOnHover={true}
                                          swipeable={true}
                                          emulateTouch={true}
                                          dynamicHeight={true}
                                          // onChange={onChange}
                                          // onClickItem={onClickItem}
                                          // onClickThumb={onClickThumb}
                                          showIndicators={false}
                                          width={"300px"}
                                        >
                                          {post?.data?.map((item) =>
                                            item.includes("mp4") ||
                                            item.includes("mov") ||
                                            item.includes("avi") ? (
                                              <video
                                                key={item}
                                                width="300"
                                                height="auto"
                                                playsInline
                                                muted
                                                autoPlay
                                                controls
                                              >
                                                <source
                                                  src={
                                                    process.env
                                                      .REACT_APP_IMAGES_PATH +
                                                    item
                                                  }
                                                />
                                                Your browser does not support
                                                the video tag.
                                              </video>
                                            ) : (
                                              <img
                                                width={300}
                                                height={300}
                                                key={item}
                                                src={
                                                  process.env
                                                    .REACT_APP_IMAGES_PATH +
                                                  item
                                                }
                                                alt=""
                                              />
                                            )
                                          )}
                                        </Carousel>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                    {post?.audio ? (
                                      <audio controls>
                                        <source
                                          src={
                                            process.env.REACT_APP_AUDIO_PATH +
                                            post?.audio
                                          }
                                          type="audio/mp3"
                                        />
                                      </audio>
                                    ) : (
                                      <></>
                                    )}
                                  </div>
                                </div>
                                <div className="flex space-x-3 border-y border-gray-200 py-3 dark:border-gray-700">
                                  <a className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                                    <svg
                                      stroke="currentColor"
                                      fill="currentColor"
                                      strokeWidth="0"
                                      viewBox="0 0 24 24"
                                      className="mr-2 text-lg"
                                      height="1em"
                                      width="1em"
                                      xmlns="http://www.w3.org/2000/svg"
                                    >
                                      <path
                                        fill="none"
                                        d="M0 0h24v24H0z"
                                      ></path>
                                      <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                                    </svg>
                                    <button
                                      data-accordion-target="#accordion-collapse-body-1"
                                      aria-expanded="true"
                                      aria-controls="accordion-collapse-body-1"
                                      onClick={() => {
                                        setReply(!reply);
                                      }}
                                      className=" mr-3"
                                    >
                                      Reply
                                    </button>
                                    <LikeButton
                                      userId={session?.user?.id}
                                      postId={post?._id}
                                      setUpdateLikes={setUpdateLikes}
                                      updateLikes={updateLikes}
                                      post={post}
                                    />
                                  </a>

                                  <div className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white">
                                    {post.likes.length}
                                  </div>
                                </div>
                                <div>
                                  <NewComment
                                    userData={userData}
                                    reply={reply}
                                    post={post}
                                    postId={post?._id}
                                    setNewPostModel={setNewCommentModel}
                                    newPostModel={newCommentModel}
                                    setUpdatePosts={setUpdatePosts}
                                    updatePosts={updatePosts}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <li className="col-span-2 m-auto h-full max-w-3xl space-y-6 overflow-hidden overflow-y-auto mt-3 lg:pt-6 ">
                      No Posts Found
                    </li>
                  )
                ) : (
                  <Loader />
                )}
              </ul>
            </section>
            <aside className="lg:w-1/3 hidden lg:block lg:mt-5">
              <h3 className="text-xl w-44 relative left-6 top-5 text-gray-600 dark:text-white">
                Search in Site
              </h3>
              <div className="w-full space-y-10 mt-6 px-4 xl:sticky xl:flex xl:flex-col border-l border-black dark:border dark:border-l-1 dark:border-t-0 dark:border-b-0 dark:border-r-0 dark:border-red-700">
                <button
                  type="button"
                  className="DocSearch DocSearch-Button border rounded shadow overflow-hidden"
                  aria-label="Search"
                  control-id="ControlID-51"
                >
                  <span className="DocSearch-Button-Container flex justify-between p-3 lg:w-[20rem]">
                    <div className="">
                      <svg
                        width="20"
                        height="20"
                        className="DocSearch-Search-Icon dark:text-white"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z"
                          stroke="currentColor"
                          fill="none"
                          fillRule="evenodd"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></path>
                      </svg>
                    </div>
                    <input
                      className="dark:text-white w-full pl-3
                  "
                      placeholder="Search"
                    />
                    {/* <span className="DocSearch-Button-Placeholder dark:text-white">
                    Search
                  </span> */}
                  </span>
                </button>
                <div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
                    MOST POPULAR POSTS
                  </h3>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="flex items-center space-x-4 pb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-600 ">
                        <SiAudiomack className=" bg-transparent text-white dark:bg-transparent" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          The Large Hadron Collider
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Read more
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4 py-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 dark:bg-gray-400">
                        <SiAudiomack className=" bg-transparent text-white dark:bg-transparent" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          The Large Hadron Collider
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Read more
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4 pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-gray-800">
                        <SiAudiomack className=" bg-transparent text-black dark:text-white dark:bg-transparent" />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          The Large Hadron Collider
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Read more
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="xl:sticky">
                  <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
                    Authors
                  </h3>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="flex items-center space-x-4 pb-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900 text-sm font-bold uppercase text-white dark:bg-gray-600">
                        J
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          Jayne
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          12 posts
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4 pt-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold uppercase text-white bg-blue-500 dark:bg-blue-500">
                        T
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          Thomas
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          10 posts
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
          <div className="mb-10 pt-5">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              pageCount={pageCount}
              onPageChange={handlePageClick}
              containerClassName={"pagination"}
              previousLinkClassName={"pagination__link"}
              nextLinkClassName={"pagination__link"}
              disabledClassName={"pagination__link--disabled"}
              activeClassName={"pagination__link--active"}
            />
          </div>
        </main>

        {/* <Footer /> */}
      </>
    );
  } else {
    return (
      <main className=" flex h-screen w-screen items-center justify-center">
        <Loader />
      </main>
    );
  }
};

export default Dashboard;
