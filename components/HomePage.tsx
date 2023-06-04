"use client";
import React, { useEffect, useState } from "react";

import { GiDuck } from "@react-icons/all-files/gi/GiDuck";
import { BsMoon } from "@react-icons/all-files/bs/BsMoon";
import { BiSun } from "@react-icons/all-files/bi/BiSun";

import useColorMode from "@/hooks/useColorMode";
import Link from "next/link";
import Loader from "./Loader";

const Home = () => {
  const [colorMode, setColorMode] = useColorMode();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  return isLoaded ? (
    <>
      <nav className="flex justify-between py-3 px-3 dark:text-white">
        <div>
          <img
            src="/assets/logo.png"
            className=" dark:text-red-400 w-8 h-8 text-3xl"
          />
        </div>
        <div>
          <div className="flex text-lg gap-3">
            <button
              onClick={() =>
                setColorMode(colorMode === "light" ? "dark" : "light")
              }
            >
              {colorMode === "light" ? (
                <BsMoon className="text-black dark:text-white" />
              ) : (
                <BiSun className="text-black dark:text-white" />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className=" h-screen mt-22 flex justify-center items-center dark:text-white ">
        <div className="flex flex-col gap-3 pb-10 items-center">
          <img src="/assets/logo.png" className="w-40 h-40" />
          <h3 className="text-sm lg:text-2xl w-2/3 lg:w-1/3 text-center leading-relaxed">
            "Experience the future of comprehensive digital interaction with
            DarkDuck, an all-in-one solution for housing, supply chain
            management, musical collaboration, and social connectivity –
            transforming your online world seamlessly."
          </h3>
          <div className="flex justify-between gap-3">
            <Link
              className=" border-2 rounded hover:bg-black hover:text-white dark:hover:bg-gray-50 dark:hover:text-gray-900 p-2"
              href="/sign-in"
            >
              Login
            </Link>
            {/* </button> */}
            <Link
              className=" border-2 rounded hover:bg-black hover:text-white dark:hover:bg-gray-50 dark:hover:text-gray-900 p-2"
              href="/sign-up"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loader />
  );
};

export default Home;
