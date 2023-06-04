"use client";
import { PostsResponse } from "@/types";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { SiAudiomack } from "react-icons/si";
import { Loader } from "./Loader";
import { useSession } from "next-auth/react";
import LikeButton from "./LikeButton";

const convertDate = (TZdate) => {
  let date = new Date(TZdate);
  return date;
  //   dateFormat(date, "mmmm dd, yyyy");
};

const Dashboard = ({ updatePosts }) => {
  const [reply, setReply] = useState(false);
  const [posts, setPosts] = useState<PostsResponse>();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const { data: session } = useSession();

  const getPosts = async () => {
    const res = await axios
      .get("/api/v1/posts")
      .then(async (res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        throw error;
      });
  };

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
    getPosts();
  }, [updatePosts]);

  if (posts && isLoaded) {
    return (
      <>
        <main className="bg-gray-50">
          <section className="bg-cover bg-center bg-bgCover text-black text-center flex flex-col items-center dark:text-white">
            <h1 className="bg-transparent dark:bg-transparent pt-20 text-3xl font-bold">
              DarkDuck
            </h1>

            <p className="bg-transparent dark:bg-transparent pt-2 text-sm lg:text-2xl w-3/4 lg:w-2/4 pb-3">
              "Experience the future of comprehensive digital interaction with
              DarkDuck, an all-in-one solution for housing, supply chain
              management, musical collaboration, and social connectivity –
              transforming your online world seamlessly."
            </p>
            <div className=" text-black rounded items-center p-2 m-5 bg-gray-200 dark:bg-gray-400 hover:text-white hover:bg-gray-400 hover:text-lg dark:hover:bg-gray-600 px-3">
              <button className="flex items-center gap-2 dark:text-white bg-transparent dark:bg-transparent">
                View Posts
                <BsFillArrowRightCircleFill className=" bg-transparent dark:bg-transparent dark:text-white" />
              </button>
            </div>
          </section>
          <div className="flex flex-col items-center lg:flex-row lg:items-start ">
            <section className="lg:w-2/3 pb-4 md:px-6 md:w-full">
              <h1 className="text-3xl font-bold col-span-2 m-auto max-w-3xl space-y-6 overflow-y-auto mt-3 lg:pt-6  dark:text-white">
                Fresh Posts
              </h1>
              <ul>
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
                                      alt="Portrait Neil Sims"
                                      src={
                                        post?.userId?.profilePicture
                                          ? process.env.REACT_APP_IMAGES_PATH +
                                            post?.userId?.profilePicture
                                          : "https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/joseph-mcfall.png"
                                      }
                                      className="h-10 w-10 rounded-full"
                                    />
                                  </div>
                                  <div className="min-w-0 flex-1 items-start flex flex-col gap-2 h-20  ">
                                    <strong className=" justify-self-start p-1 px-2 bg-gray-900 text-gray-50 rounded dark:bg-white dark:text-black ">
                                      {post?.recordModeSwingId ==
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
                                  <a
                                    href="#"
                                    className="inline-flex cursor-pointer justify-center rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                                  >
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
                                  {/* <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                                Hi @everyone, the new designs are attached. Go
                                check them out and let me know if I missed
                                anything. Thanks!
                              </p> */}
                                  <div className="flex flex-wrap">
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
                                <div className="flex space-x-6 border-y border-gray-200 py-3 dark:border-gray-700">
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
                                    >
                                      Reply
                                    </button>
                                    <LikeButton
                                      userId={session?.user?.id}
                                      postId={post?._id}
                                    />
                                  </a>

                                  <a
                                    href="#"
                                    className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                                  ></a>
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
              <div className="w-full space-y-10 mt-4 px-4 xl:sticky xl:flex xl:flex-col border-l border-black dark:border dark:border-l-1 dark:border-t-0 dark:border-b-0 dark:border-r-0 dark:border-red-700">
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600 dark:bg-purple-600">
                        <SiAudiomack className=" bg-transparent text-white" />
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
                        <SiAudiomack className=" bg-transparent text-white " />
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white dark:bg-black">
                        <SiAudiomack className=" bg-transparent text-black" />
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
