"use client";
import useColorMode from "@/hooks/useColorMode";
import Validation from "@/utils/validator/validators";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";

import { GiDuck } from "react-icons/gi";
import { GoHome } from "react-icons/go";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SignIn = () => {
  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState({ email: "", password: "" });
  const [apiError, setApiError] = useState();
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const [colorMode, setColorMode] = useColorMode();
  const pathname = usePathname();
  const router = useRouter();

  const isValid = () => {
    let isValid = true;

    if (!user.email) {
      error.email = "Email is required";
      isValid = false;
    }

    if (!Validation.EmailValidation(user.email)) {
      error.email = "Please Enter valid Email";
      isValid = false;
    }

    if (!user.password) {
      error.password = "Password is required";
      isValid = false;
    }

    if (!Validation.passwordValidation(user.password)) {
      error.password = "Please provide password of minimum length 8";
      isValid = false;
    }
    setError({ ...error });
    return isValid;
  };

  const redirectToHome = () => {
    if (pathname === "/sign-up" || pathname === "/sign-in") {
      // TODO: redirect to a success register page
      router.push("/");
    }
  };

  const loginUser = async () => {
    setLoading(true);
    const res: any = await signIn("credentials", {
      redirect: false,
      email: user?.email,
      password: user?.password,
      callbackUrl: `${window.location.origin}`,
    });
    res.error ? setApiError(res.error) : redirectToHome();
    setLoading(false);
  };
  let notify;
  if (apiError !== undefined) {
    colorMode === "light"
      ? (notify = () =>
          toast.error(apiError, {
            style: { background: "#F5F5F5" },
          }))
      : (notify = () =>
          toast.error(apiError, {
            style: { background: "#000000" },
          }));
  }

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser();
  };

  if (!session) {
    return (
      <>
        <section className="bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-end">
            {/* <!-- Home --> */}
            <Link
              href="/"
              type="button"
              className="py-4 bg-transparent text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-1"
            >
              <GoHome className="h-6 w-6 bg-gray-200" />
            </Link>
            <button
              className=" text-white dark:text-white p-4"
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
          <div className="flex flex-col items-center justify-center h-screen px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div className="w-full bg-black rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8 border border-white rounded-lg outline-none ">
                <div className="flex justify-center">
                  <GiDuck className=" text-[50px] dark:text-white" />
                </div>
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
                </h1>
                <form className="space-y-4 md:space-y-6" onSubmit={formSubmit}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={user.email || ""}
                      onChange={(e) =>
                        setUser({ ...user!, email: e.target.value! })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                    {error.email && (
                      <span className="text-danger">{error.email}</span>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      value={user.password || ""}
                      onChange={(e) =>
                        setUser({ ...user!, password: e.target.value! })
                      }
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    {error.password && (
                      <span className="text-danger">{error.password}</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <Link
                      href="/forgot"
                      className="text-sm font-medium  dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={notify}
                    className="w-full text-gray-200 dark:text-gray-700 bg-gray-600 hover:bg-black  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-300 dark:hover:bg-white dark:focus:ring-primary-800"
                  >
                    {loading ? "Please Wait..." : "Sign in"}
                  </button>
                  <ToastContainer />
                  <p className="text-sm font-light text-gray-500 dark:text-white">
                    Dont have an account yet?{" "}
                    <Link
                      href="/sign-up"
                      className="font-medium  dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                    >
                      Sign up
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default SignIn;
