"use client";
import OtpInput from "@/components/OtpInput";
import { UserResponse } from "@/types";
import axios from "axios";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ResetPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserResponse>();
  const [otp, setOtp] = useState("");
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const onChange = (value: string) => setOtp(value);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useState(false);
  const [password, setPassword] = useState("");

  const fetchUserData = async (id: string) => {
    try {
      const req = await axios.get(`/api/v1/user/${id}`);
      const res = await req.data;
      await setUserData(res.data);
      await console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  const redirectToSignIn = () => {
    if (pathname === `/reset/${id}` || pathname === "/sign-in") {
      // TODO: redirect to a success register page
      router.push("/sign-in");
    }
  };

  const resetPassword = async () => {
    try {
      const req = await axios.post(
        `/api/v1/otp-verify`,
        {
          otp: Number(otp),
          _id: id,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const res = await req.data;
      console.log(res);
      if (res) {
        setOtpVerified(true);
        // redirectToSignIn();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updatePassword = async () => {
    try {
      const req = await axios.put(
        `/api/v1/reset`,
        {
          newPassword: password,
          _id: id,
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const res = await req.data;
      if (res) {
        router.push("/sign-in");
      }
      redirectToSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log('user',user)
    // if (isValid()) {
    resetPassword();
    // }
  };
  const handleChangePassword = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // console.log('user',user)
    // if (isValid()) {
    updatePassword();
    // }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchUserData(id);
  }, [id]);

  return (
    <>
      {otpVerified ? (
        <>
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
              value={password || ""}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              required
            />
            {/* {error.password && (
              <span className="text-danger">{error.password}</span>
            )} */}
            <button
              onClick={handleChangePassword}
              className="w-30 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              disabled={disable || loader}
            >
              {loader ? "Please wait..." : "Reset password"}
            </button>
          </div>
        </>
      ) : (
        <div className="flex gap-2 flex-col justify-center h-screen items-center w-screen ">
          <h1>Please enter your reset code</h1>
          <div className="flex justify-evenly w-80">
            <OtpInput value={otp} valueLength={6} onChange={onChange} />
          </div>
          <button
            onClick={handleReset}
            className="w-30 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
            disabled={disable || loader}
          >
            {loader ? "Please wait..." : "Reset password"}
          </button>
        </div>
      )}
    </>
  );
}

export default ResetPage;
