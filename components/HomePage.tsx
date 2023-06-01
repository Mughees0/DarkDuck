"use client";
import React from "react";
import { GiDuck } from "react-icons/gi";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import duck from "../../assets/images/dark-duck.jpg";
import useColorMode from "@/hooks/useColorMode";
import Link from "next/link";
import { useSession } from "next-auth/react";

// const darkDuck = require('../../assets/images/darkduck.png');

const Home = () => {
  // const session = useSession();
  const [colorMode, setColorMode] = useColorMode();

  return (
    <>
      <nav className="flex justify-between pt-3 px-3 dark:text-white">
        <div>
          <GiDuck className=" dark:text-red-400 text-3xl" />
        </div>
        <div>
          <div className="flex text-lg gap-3">
            <button
              className=" text-white dark:text-white"
              onClick={() =>
                setColorMode(colorMode === "light" ? "dark" : "light")
              }
            >
              {colorMode === "light" ? (
                <BsFillMoonFill className="text-black" />
              ) : (
                <BsFillSunFill />
              )}
            </button>
          </div>
        </div>
      </nav>
      <div className=" h-screen flex justify-center items-center dark:text-white ">
        <div className="flex flex-col gap-3  items-center">
          <GiDuck className="text-[100px]" />
          <h3 className="text-[20px] w-1/3 text-center leading-relaxed">
            "Experience the future of comprehensive digital interaction with
            DarkDuck, an all-in-one solution for housing, supply chain
            management, musical collaboration, and social connectivity –
            transforming your online world seamlessly."
          </h3>
          <div className="flex justify-between gap-3">
            {/* <button className="border-2 rounded hover:bg-black hover:text-white p-2"> */}
            <Link
              className=" border-2 rounded hover:bg-black hover:text-white p-2"
              href="/sign-in"
            >
              Login
            </Link>
            {/* </button> */}
            <Link
              className=" border-2 rounded hover:bg-black hover:text-white p-2"
              href="/sign-up"
            >
              Sign up
            </Link>
          </div>
          {/* <h4 className="text-2xl ">A Social media open source platform</h4> */}
        </div>
      </div>
    </>
  );
};

export default Home;
