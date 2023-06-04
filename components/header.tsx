"use client";
import React, { useState, useEffect } from "react";

import { GiDuck } from "@react-icons/all-files/gi/GiDuck";
import { BsMoon } from "@react-icons/all-files/bs/BsMoon";
import { BiSun } from "@react-icons/all-files/bi/BiSun";
import { FiMessageCircle } from "@react-icons/all-files/fi/FiMessageCircle";
import { GoHome } from "@react-icons/all-files/go/GoHome";

import axios from "axios";
import useColorMode from "@/hooks/useColorMode";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { UserDataResponse } from "@/types";
import AudioRecorder from "./AudioRecorder";

const Header = ({ setUpdatePosts, updatePosts }) => {
  const [colorMode, setColorMode] = useColorMode();
  const [audioRecordingModel, setAudioRecordingModel] = useState(false);
  const [userData, setUserData] = useState<UserDataResponse>();
  const [toggleUserModal, setToggleUserModal] = useState(false);
  const { data: session } = useSession();

  const fetchUserData = async (id: string) => {
    try {
      // const id = session?.user?.id;
      const req = await axios.get(`/api/v1/users/user/${id}`);
      const res = await req.data;
      setUserData(res);
    } catch (error) {
      if (error.response.status === 400) {
        console.log(
          "User not fetched by the API, probably the user is not found or request failed."
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  };

  useEffect(() => {
    if (!session?.user?.id) {
      return;
    }
    fetchUserData(session?.user?.id);
  }, [session?.user?.id]);

  return (
    <>
      <header>
        <nav className="bg-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 dark:border dark:border-l-0 dark:border-t-0 dark:border-b-2 dark:border-r-0 dark:border-red-700">
          <div className="flex bg-gray-200 dark:bg-gray-800 flex-wrap justify-between items-center">
            <div className="flex bg-gray-200 dark:bg-gray-800  justify-start items-center">
              {/* Icon/logo */}
              <a href="/" className="flex mr-4 bg-gray-200 dark:bg-gray-800">
                <GiDuck className="mr-3 h-8 w-8 bg-gray-200 dark:text-red-700 dark:bg-gray-800" />
              </a>
            </div>
            <div className="flex items-center bg-gray-200 dark:bg-gray-800 lg:order-2">
              <button
                onClick={() => setAudioRecordingModel(!audioRecordingModel)}
                type="button"
                className="sm:hidden items-center justify-center text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs p-2 mr-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                <svg
                  aria-hidden="true"
                  className=" w-5 h-5 text-gray-200 dark:bg-transparent bg-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              {/* Big Screen New Post Button */}
              <button
                onClick={() => setAudioRecordingModel(!audioRecordingModel)}
                type="button"
                className=" hidden sm:inline-flex items-center justify-center text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-xs px-3 py-1.5 mr-2 dark:bg-gray-600 dark:hover:bg-gray-700 focus:outline-none dark:focus:ring-gray-800"
              >
                <svg
                  aria-hidden="true"
                  className="mr-1 -ml-1 w-5 h-5 text-white bg-gray-800"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
                New Post
              </button>
              <div
                className={
                  audioRecordingModel
                    ? "h-screen w-screen absolute flex justify-center items-center bg-opacity-25 dark:bg-opacity-25 bg-gray-400 top-0 left-0 right-0 bottom-0 "
                    : "hidden"
                }
              >
                <AudioRecorder
                  setAudioRecordingModel={setAudioRecordingModel}
                  audioRecordingModel={audioRecordingModel}
                  setUpdatePosts={setUpdatePosts}
                  updatePosts={updatePosts}
                />
              </div>
              {/* <!-- Home --> */}
              <a
                href="/"
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mr-1"
              >
                <GoHome className="h-6 w-6 bg-gray-200 hover:bg-transparent" />
              </a>
              {/* <!-- Messages --> */}
              <button
                type="button"
                className="p-2 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white mr-1"
              >
                <FiMessageCircle className="h-6 w-6 bg-gray-200 hover:bg-transparent" />
              </button>
              {/* <!-- Notifications --> */}
              <button
                type="button"
                data-dropdown-toggle="notification-dropdown"
                className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              >
                <span className="sr-only">View notifications</span>
                {/* <!-- Bell icon --> */}
                <svg
                  aria-hidden="true"
                  className="w-6 h-6 bg-gray-200 hover:bg-transparent"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path>
                </svg>
              </button>
              {/* <!-- Dropdown menu --> */}
              <div
                className="hidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700"
                id="notification-dropdown"
              >
                <div className="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  Notifications
                </div>
                <div>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/bonnie-green.png"
                        alt="Bonnie Green avatar"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
                        <svg
                          aria-hidden="true"
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8.707 7.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2a1 1 0 00-1.414-1.414L11 7.586V3a1 1 0 10-2 0v4.586l-.293-.293z"></path>
                          <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        New message from{" "}
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Bonnie Green
                        </span>
                        : "Hey, what's up? All set for the presentation?"
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        a few moments ago
                      </div>
                    </div>
                  </a>
                  <a
                    href="#"
                    className="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600"
                  >
                    <div className="flex-shrink-0">
                      <img
                        className="w-11 h-11 rounded-full"
                        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/avatars/jese-leos.png"
                        alt="Jese Leos avatar"
                      />
                      <div className="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 bg-gray-900 rounded-full border border-white dark:border-gray-700">
                        <svg
                          aria-hidden="true"
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="pl-3 w-full">
                      <div className="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                        <span className="font-semibold text-gray-900 dark:text-white">
                          Jese leos
                        </span>{" "}
                        and{" "}
                        <span className="font-medium text-gray-900 dark:text-white">
                          5 others
                        </span>{" "}
                        started following you.
                      </div>
                      <div className="text-xs font-medium text-primary-700 dark:text-primary-400">
                        10 minutes ago
                      </div>
                    </div>
                  </a>
                </div>
                <a
                  href="#"
                  className="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline"
                >
                  <div className="inline-flex items-center ">
                    <svg
                      aria-hidden="true"
                      className="mr-2 w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    View all
                  </div>
                </a>
              </div>
              {/* user profile button */}
              {!session ? (
                <Link className="nav-link" href="/login">
                  Login
                </Link>
              ) : (
                <>
                  {" "}
                  <button
                    type="button"
                    className="flex mx-2 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                    id="user-menu-button"
                    aria-expanded="false"
                    data-dropdown-toggle="dropdown"
                    onClick={() => setToggleUserModal(!toggleUserModal)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="w-8 h-8 rounded-full"
                      src={
                        userData?.profilePicture
                          ? process.env.REACT_APP_IMAGES_PATH +
                            userData?.profilePicture
                          : "/assets/avatar.png"
                      }
                      alt=""
                    />
                  </button>
                  {/* <!-- Dropdown menu --> */}
                  <div
                    className={
                      toggleUserModal
                        ? " absolute z-50 my-4 w-56 h-50 right-4 top-8 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                        : "hidden"
                    }
                    id="dropdown"
                  >
                    <div className="py-3 px-4">
                      <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                        {session?.user?.name}
                      </span>
                      <span className="block text-sm font-light text-gray-500 truncate dark:text-gray-400">
                        {session?.user?.email}
                      </span>
                    </div>
                    <ul
                      className="py-1 font-light text-gray-500 dark:text-gray-400"
                      aria-labelledby="dropdown"
                    >
                      <li>
                        <Link
                          className="block py-2 px-4 mx-full text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                          href="/profile"
                        >
                          My profile
                        </Link>
                      </li>
                      {/* <li>
                        <a
                          href="#"
                          className="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white"
                        >
                          Account settings
                        </a>
                      </li> */}
                      <li className="hover:text-blue-700  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-400">
                        <button
                          className="block py-2 px-4 text-sm bg-transparent  dark:bg-transparent"
                          onClick={() => {
                            signOut();
                          }}
                        >
                          Sign out
                        </button>
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {/* <!-- Toggle --> */}
              <button
                className=" text-white bg-blue-400 dark:bg-yellow-800 ml-3 dark:text-white"
                onClick={() =>
                  setColorMode(colorMode === "light" ? "dark" : "light")
                }
              >
                {colorMode === "light" ? (
                  <BsMoon className="text-black bg-gray-200" />
                ) : (
                  <BiSun className="dark:bg-gray-800" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
