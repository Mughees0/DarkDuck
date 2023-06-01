"use client";
import { useEffect, useState } from "react";
// const logo = require('../../assets/images/darkduck.png');
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import OtpInput from "@/components/OtpInput";
import { UserResponse } from "@/types";

const ResetPassword = () => {
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const [error, setError] = useState("");
  const check = [null, undefined, "null", "undefined", ""];
  const [email, setEmail] = useState("");
  const pathname = usePathname();
  const router = useRouter();

  const redirectToReset = (id: string) => {
    if (pathname === "/forgot") {
      // TODO: redirect to a success register page
      router.push(`/forgot/reset/${id}`);
    }
  };

  const forgotPassword = async (Email: string) => {
    try {
      const req = await axios.post(
        `/api/v1/reset`,
        {
          email: Email,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const res = await req.data;
      redirectToReset(res?.emailUser?._id);
    } catch (error) {
      console.log(error);
    }
  };

  const formSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setLoader(true);
    await forgotPassword(email);
  };

  return (
    <>
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <div className="w-full p-6  rounded-lg shadow dark:border md:mt-0 sm:max-w-md dark:bg-gray-800 dark:border-gray-200 sm:p-8">
            <h1 className="mb-1 text-xl font-bold dark:bg-gray-800 leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Forgot your password?
            </h1>
            <p className="font-light text-gray-500 dark:bg-gray-800 dark:text-gray-400">
              Don't fret! Just type in your email and we will send you a code to
              reset your password!
            </p>
            <form
              className="mt-4 dark:bg-gray-800 space-y-4 lg:mt-5 md:space-y-5"
              onSubmit={formSubmit}
            >
              <div className="dark:bg-gray-800">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm dark:bg-gray-800 font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-gray-600 focus:border-gray-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  required
                  value={email}
                  onChange={({ target: { value } }) => setEmail(value)}
                />
                {error && <span className="text-danger">{error}</span>}
              </div>
              <button
                type="submit"
                className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                disabled={disable || loader}
              >
                {loader ? "Please wait..." : "Reset password"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default ResetPassword;
