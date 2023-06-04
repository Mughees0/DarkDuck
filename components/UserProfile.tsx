"use client";
import { PostsResponse, UserDataResponse } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GiGuitarBassHead, GiDuck } from "react-icons/gi";
import { BsFillCameraFill } from "react-icons/bs";
import { MdLanguage, MdWork } from "react-icons/md";
import ProfileImageUpload from "./ProfileImageUpload";
import BannerImageUpload from "./BannerImageUpload";
import LikeButton from "./LikeButton";
import { Loader } from "./Loader";

const UserBio = ({ updatePosts }) => {
  const { data: session } = useSession();
  const userIdFromSession = session?.user?.id;

  const [userData, setUserData] = useState<UserDataResponse>();
  const [posts, setPosts] = useState<PostsResponse>(null);

  const [liked, setLiked] = useState(false);
  const [profileModal, setProfileModal] = useState(false);
  const [bannerModal, setBannerModal] = useState(false);
  const [updateImage, setUpdateImage] = useState(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // apis
  const getUserDetails = async (userId: string) => {
    try {
      const id = session?.user?.id;
      const res = await axios.get(`/api/v1/users/user/${id}`);
      const user = await res.data;

      setUserData(user);
    } catch (error) {
      throw error;
    }
  };

  async function getUserPosts(userId: string) {
    try {
      const res = await axios.get(`/api/v1/posts/post/${userId}`);
      const posts = await res.data;
      setPosts(posts);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
    getUserDetails(userIdFromSession);
    getUserPosts(userIdFromSession);
  }, [updatePosts, updateImage]);

  if (userData && isLoaded) {
    return (
      <>
        {/* profile modal */}
        <div
          // onClick={() => setModal(!modal)}
          className={
            profileModal
              ? " flex flex-col items-center justify-center absolute top-0 bg-opacity-40 z-40 h-screen w-screen bg-gray-500"
              : "hidden"
          }
        >
          <ProfileImageUpload
            updateImage={updateImage}
            setUpdateImage={setUpdateImage}
          />
          <button
            className="text-white bg-gray-600 m-3 p-2 rounded dark:bg-gray-400"
            onClick={() => setProfileModal(!profileModal)}
          >
            Go Back
          </button>
        </div>

        {/* banner modal */}
        <div
          // onClick={() => setModal(!modal)}
          className={
            bannerModal
              ? " flex flex-col items-center justify-center absolute top-0 bg-opacity-40 z-40 h-screen w-screen bg-gray-500"
              : "hidden"
          }
        >
          <BannerImageUpload
            updateImage={updateImage}
            setUpdateImage={setUpdateImage}
          />
          <button
            className="text-white bg-gray-600 m-3 p-2 rounded dark:bg-gray-400"
            onClick={() => setBannerModal(!bannerModal)}
          >
            Go Back
          </button>
        </div>

        {/* Saba's code */}

        <div
          onClick={() => setBannerModal(!bannerModal)}
          className="h-80 overflow-hidden"
        >
          <img
            className="object-cover w-full absolute h-80"
            src={
              userData?.bannerPicture
                ? process.env.REACT_APP_IMAGES_PATH + userData?.bannerPicture
                : "/assets/dummy-banner.jpeg"
            }
            alt="User Banner Picture"
          />
          <div className="bg-gray-200 rounded-full overflow-hidden  cursor-pointer absolute top-56 right-5 mt-32 ml-100 p-1 hover:shadow-outline">
            <BsFillCameraFill
              className=" bg-transparent text-gray-700 w-5 h-5 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
              onClick={() => setProfileModal(!bannerModal)}
            />
          </div>
        </div>
        <div className="h-screen">
          <div className="container-user w-auto mx-2 flex flex-col lg:flex-row">
            <aside className="sm:w-2/10 lg:-mx-10 dark:bg-transparent flex flex-col items-center mb-2">
              <div className="main dark:bg-transparent">
                <div className="html dark:bg-transparent">
                  <div className="body dark:bg-transparent">
                    <div className="circle dark:bg-transparent">
                      <div className="text-profile-pic dark:bg-transparent">
                        <p className="para">
                          {userData?.username &&
                            userData.username?.split("").map((char, i) => {
                              return (
                                <span
                                  key={i}
                                  style={{ transform: `rotate(${i * 5.8}deg)` }}
                                >
                                  {char}
                                </span>
                              );
                            })}
                        </p>
                      </div>

                      <img
                        src={
                          userData?.profilePicture
                            ? process.env.REACT_APP_IMAGES_PATH +
                              userData?.profilePicture
                            : "/assets/avatar.png"
                        }
                        className="logo absolute object-cover object-center"
                        alt="User Profile Picture"
                      />
                      <div className="bg-gray-200 rounded-full overflow-hidden  cursor-pointer absolute top-[3.7rem] left-18 mt-32 ml-40 p-2 hover:shadow-outline">
                        <BsFillCameraFill
                          className=" bg-transparent text-gray-700 w-5 h-5 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-50"
                          onClick={() => setProfileModal(!profileModal)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <h1 className="text-lg mt-3 font-bold dark:text-white">
                  {userData?.username}
                </h1>
                <p className="w-2/4 dark:text-white">
                  ❤️ Simply passionate about creating and transforming
                  interfaces!
                </p>

                <ul className="mt-3 list-none text-sm text-gray-400">
                  <li className="gap-2 items-center flex">
                    <img src={"/assets/place.svg"} alt="Place" />
                    {userData?.city ? userData.city : "none"}
                  </li>
                  <li className="gap-2 items-center flex">
                    <img src={"/assets/url.svg"} alt="URL" />
                    {userData?.email}
                  </li>
                  <li className="gap-2 items-center flex">
                    <GiGuitarBassHead />
                    {userData?.instruments ? userData.instruments : "none"}
                  </li>
                  <li className="gap-2 items-center flex">
                    <MdWork />
                    {userData?.occupation ? userData.occupation : "none"}
                  </li>
                  <li className="gap-2 items-center flex">
                    <MdLanguage />
                    {userData?.language ? userData.language : "none"}
                  </li>
                  <li className="gap-1 items-center flex">
                    <img src={"/assets/joined.svg"} alt="Joined" />
                    Created At{" "}
                    {userData?.createdAt
                      ? new Date(userData.createdAt).toLocaleDateString(
                          undefined,
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "..."}
                  </li>
                </ul>
              </div>
            </aside>
            <section className="grow sm:w-6/10 mt-3 border-t-2 lg:border-none lg:mr-10">
              <nav>
                <h3 className="text-3xl font-bold pl-2 pt-3 dark:text-white text-center lg:text-left lg:w-44">
                  Your Posts
                </h3>
              </nav>

              <ul className="tweets-user">
                {posts ? (
                  posts?.map((post) => {
                    return (
                      <li
                        key={post?._id}
                        className="flex h-full flex-col justify-center gap-4 p-4 rounded-lg border-2 overflow-hidden border-black dark:border-white m-3"
                      >
                        <div className="flex items-center space-x-4 ">
                          <div className="shrink-0">
                            <img
                              alt="Portrait Neil Sims"
                              src={"/assets/avatar.png"}
                              className="h-10 w-10 rounded-full"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                              {userData?.username}
                              <span>@{userData?.username}</span>
                            </p>
                            <p className="truncate text-sm font-normal text-gray-500 dark:text-gray-400">
                              {post?.createdAt
                                ? new Date(post.createdAt).toLocaleDateString(
                                    undefined,
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                : null}
                            </p>
                          </div>
                          <a
                            href="#hello"
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
                          <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Hi @everyone, the new designs are attached. Go check
                            them out and let me know if I missed anything.
                            Thanks!
                          </p>
                          <div className="flex flex-wrap">
                            <audio controls>
                              <source
                                src={
                                  process.env.REACT_APP_AUDIO_PATH + post?.audio
                                }
                                type="audio/mp3"
                              />
                            </audio>
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
                              <path fill="none" d="M0 0h24v24H0z"></path>
                              <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                            </svg>
                            Reply
                          </a>
                          <div>
                            <LikeButton
                              userId={session?.user?.id}
                              postId={post?._id}
                            />
                          </div>
                        </div>
                      </li>
                    );
                  })
                ) : (
                  <li className="flex h-full flex-col justify-center gap-4 p-4 rounded-lg border-2 overflow-hidden border-black dark:border-white dark:text-white m-3">
                    <div className="flex items-center justify-center space-x-4">
                      <h1>No posts found</h1>
                    </div>
                  </li>
                )}
              </ul>
            </section>

            <aside className="mt-3 sm:w-2/10 ">
              {/* new layout */}
              <div className="hidden w-full space-y-10 py-2 px-4 lg:mt-8 xl:sticky xl:flex xl:flex-col dark:border dark:border-l-1 dark:border-t-0 dark:border-b-0 dark:border-r-0 dark:border-red-700">
                <div>
                  <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
                    Recent public information sent by friends
                  </h3>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="flex items-center space-x-4 pb-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ">
                        <img
                          className="rounded-full"
                          src={"/assets/avatar.png"}
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          Antti
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Web Developer, New York USA
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ">
                        <img
                          className="rounded-full"
                          src={"/assets/avatar.png"}
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          Markus
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          React Developer, Palo Alto USA
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4 pt-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg">
                        <img
                          className="rounded-full"
                          src={"/assets/avatar.png"}
                        />
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          Yu
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          Frontend Dev, Calfornia USA
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="xl:sticky">
                  <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
                    Recent trip users near me
                  </h3>
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    <li className="flex items-center space-x-4 pt-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold uppercase text-white bg-black">
                        Su
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          @Tom
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          1km away
                        </span>
                      </div>
                    </li>
                    <li className="flex items-center space-x-4 pt-2">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-700 text-sm font-bold uppercase text-white bg-red-700">
                        Th
                      </div>
                      <div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white">
                          @Harry
                        </div>
                        <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                          2km away
                        </span>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
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
export default UserBio;
