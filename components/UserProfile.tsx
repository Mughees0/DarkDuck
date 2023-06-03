"use client";
import {
  PostsResponse,
  UserDataResponse,
  UserInputData,
  UserResponse,
} from "@/types";
import axios from "axios";
import modal from "flowbite/lib/esm/components/modal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GiDuck, GiGuitarBassHead, GiPlasticDuck } from "react-icons/gi";
import { BsFillCameraFill } from "react-icons/bs";
import { MdLanguage, MdWork } from "react-icons/md";
import ImageUpload from "./ImageUpload";

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// const images = importAll(
//   require.context("../../assets/images", false, /\.(png|jpe?g|svg)$/)
// );

const UserBio = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userIdFormSession = session?.user?.id;
  console.log("User Id here >", userIdFormSession);

  const [file, setFile] = useState(null);
  const [userData, setUserData] = useState<UserDataResponse>();
  const [posts, setPosts] = useState<PostsResponse>(null);

  const circle = useRef(null);
  const [profile, setProfile] = useState(false);
  const [modal, setModal] = useState(false);

  const [param, setParam] = useState({
    like: [],
    newPosts: [],
    active: 0,
  });

  // apis
  const getUserDetails = async (userId: string) => {
    try {
      const id = session?.user?.id;
      const res = await axios.get(`/api/v1/user/${id}`);
      const user = await res.data;
      console.log("this is User ferom api >", user);

      setUserData(user);
    } catch (error) {
      console.log("Error:> ", error.message);
      throw error;
    }
  };

  async function getUserPosts(userId: string) {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_HOST}/api/v1/posts/${userId}`
      );
      const posts = await res.data;
      setPosts(posts);
    } catch (error) {
      console.log("Error:> ", error.message);
      throw error;
    }
  }
  const [reply, setReply] = useState(false);

  useEffect(() => {
    getUserDetails(userIdFormSession);
  }, []);
  console.log(userData);

  const handleProfilePicSubmit = (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/v1/user/upload/profilepic/${userIdFormSession}`;
    const data = new FormData(event.target);
    data.set("userId", data.get("userId"));
    data.set("comment", data.get("comment"));
    data.set("file", data.get("file"));
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, data, config)
      .then((response) => {
        console.log(response);
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => location.reload(), 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleBannerPicSubmit = (event) => {
    event.preventDefault();
    const url = `${process.env.REACT_APP_API_HOST}/api/v1/user/upload/bannerpic/${userIdFormSession}`;
    const data = new FormData(event.target);
    data.set("userId", data.get("userId"));
    data.set("comment", data.get("comment"));
    data.set("file", data.get("file"));
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios
      .post(url, data, config)
      .then((response) => {
        console.log(response);
        // eslint-disable-next-line no-restricted-globals
        setTimeout(() => location.reload(), 300);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(freshPosts);
  // console.log("userdetails", userDetails);

  const changeHandler = async (event) => {
    // setFile(event.target.value);
  };

  // if (userData != undefined) {
  //   console.log(userData.data.bannerPicture);
  // }

  return (
    <>
      <div
        // onClick={() => setModal(!modal)}
        className={
          modal
            ? " flex flex-col items-center justify-center absolute top-0 bg-opacity-40 z-40 h-screen w-screen bg-gray-500"
            : "hidden"
        }
      >
        <ImageUpload />
        <button
          className="text-white bg-gray-600 m-3 p-2 rounded dark:bg-gray-400"
          onClick={() => setModal(!modal)}
        >
          Go Back
        </button>
      </div>
      {/* Saba's code */}

      <div onClick={() => setModal(!modal)} className="h-80 overflow-hidden">
        <img
          className="object-cover w-full"
          src={userData?.bannerPicture}
          alt=""
        />
        {/* <h1 className="bg-black">Dark Duck User Profile</h1> */}
      </div>
      <div className="h-screen">
        <div className="container-user w-auto mx-2 flex flex-col lg:flex-row">
          <aside className="profile-user w-2/8 dark:bg-transparent flex flex-col items-center mb-2">
            <div className="main dark:bg-transparent">
              <div className="html dark:bg-transparent">
                <div className="body dark:bg-transparent">
                  <div className="circle dark:bg-transparent">
                    <div className="text-profile-pic dark:bg-transparent">
                      <p className="p">
                        {userData?.username &&
                          userData?.username?.split("").map((char, i) => {
                            return (
                              <span
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
                          ? userData.profilePicture
                          : "/assets/avatar.png"
                      }
                      className="logo absolute"
                      alt="User Profile Picture"
                      onClick={() => setModal(!modal)}
                    />
                    <div className="bg-gray-200 rounded-full overflow-hidden  cursor-pointer absolute top-36 left-20 mt-32 ml-40 p-2 hover:shadow-outline">
                      <BsFillCameraFill className=" bg-transparent w-10 h-10" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h1 className="text-lg mt-3 font-bold dark:text-white">
              {userData?.username}
            </h1>
            <p className="w-2/4 dark:text-white">
              ❤️ Simply passionate about creating and transforming interfaces!
            </p>

            <ul className="list-user mt-3 list-none text-sm text-gray-400">
              <li className="gap-2 items-center flex">
                <img src={"/assets/place.svg"} alt="Place" />
                {userData?.cityCode}
              </li>
              <li className="gap-2 items-center flex">
                <img src={"/assets/url.svg"} alt="URL" />
                {userData?.email}
              </li>
              <li className="gap-2 items-center flex">
                <GiGuitarBassHead />
                {userData?.instruments}
              </li>
              <li className="gap-2 items-center flex">
                <MdWork />
                {userData?.occupation}
              </li>
              <li className="gap-2 items-center flex">
                <MdLanguage />
                {userData?.language}
              </li>
              <li className="gap-1 items-center flex">
                <img src={"/assets/joined.svg"} alt="Joined" />
                Created At{" "}
                {userData?.createdAt
                  ? new Date(userData.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : null}
              </li>
            </ul>
          </aside>
          <section className="timeline-user grow sm:w-4/8 mt-3 border-t-2 lg:border-none lg:mr-10">
            <nav>
              <h3 className="text-3xl font-bold pl-2 pt-3 dark:text-white text-center lg:text-left lg:w-44">
                Your Posts
              </h3>
            </nav>

            <ul className="tweets-user">
              {posts ? (
                posts?.map((post) => {
                  return (
                    <li className="flex h-full flex-col justify-center gap-4 p-4 rounded-lg border-2 overflow-hidden border-black dark:border-white m-3">
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
                            stroke-width="0"
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
                          them out and let me know if I missed anything. Thanks!
                        </p>
                        <div className="flex flex-wrap">
                          <audio controls>
                            <source
                              src={
                                process.env.REACT_APP_AUDIO_PATH + post.audio
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
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            className="mr-2 text-lg"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"></path>
                          </svg>
                          {/* <button
                            data-accordion-target="#accordion-collapse-body-1"
                            aria-expanded="true"
                            aria-controls="accordion-collapse-body-1"
                            onClick={() => {
                              if (param.active === "0" + String(post._id)) {
                                setParam({ ...param, active: "" });
                              } else {
                                setParam({
                                  ...param,
                                  active: "0" + String(post._id),
                                });
                              }
                              setReply(!reply);
                            }}
                            eventKey={param.active}
                          >
                            Reply
                          </button> */}
                        </a>

                        {/* <button
                          ref="#"
                          class="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 hover:underline dark:text-gray-400 dark:hover:text-white"
                        >
                          {render_like(post, param.like)}
                        </button> */}
                      </div>
                      {/* {param.active == "0" + String(post._id) ? (
                        <div className={reply ? "" : "hidden"}>
                          <>
                            <ReplyComment />
                          </>
                        </div>
                      ) : (
                        <></>
                      )} */}
                    </li>
                  );
                })
              ) : (
                <li className="flex h-full flex-col justify-center gap-4 p-4 rounded-lg border-2 overflow-hidden border-black dark:border-white m-3">
                  <div className="flex items-center justify-center space-x-4">
                    <h1>No posts found</h1>
                  </div>
                </li>
              )}
            </ul>
          </section>

          <aside className="widgets-user mt-3 sm:w-2/8 ">
            {/* new layout */}
            <div className="hidden w-full space-y-10 py-2 px-4 lg:mt-8 xl:sticky xl:flex xl:flex-col dark:border dark:border-l-1 dark:border-t-0 dark:border-b-0 dark:border-r-0 dark:border-red-700">
              <div>
                <h3 className="mb-2 text-base font-bold text-gray-900 dark:text-white">
                  Recent public information sent by friends
                </h3>
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  <li className="flex items-center space-x-4 pb-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-600">
                      <img src={"/assets/avatar.png"} />
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
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-900">
                      <img src={"/assets/avatar.png"} />
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
                      <img src={"/assets/avatar.png"} />
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
      {/* <Footer /> */}
    </>
  );
};
export default UserBio;
