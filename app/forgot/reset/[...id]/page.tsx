"use client";
import OtpInput from "@/components/OtpInput";
import { UserResponse } from "@/types";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function ResetPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserResponse>();
  const [otp, setOtp] = useState("");
  const [disable, setDisable] = useState(false);
  const onChange = (value: string) => setOtp(value);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [password, setPassword] = useState("");
  const { data: session, status } = useSession();

  const fetchUserData = async (id: string) => {
    try {
      const req = await axios.get(`/api/v1/users/user/${id}`);
      const res = await req.data;
      setUserData(res.data);
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

  const redirectToSignIn = () => {
    if (pathname === `/reset/${id}` || pathname === "/sign-in") {
      // TODO: redirect to a success register page
      router.push("/sign-in");
    }
  };

  const resetPassword = async () => {
    setLoading(true);
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
      if (req.status === 200) {
        setOtpVerified(true);
      }
      // redirectToSignIn();
    } catch (error) {
      if (error.response.status === 400) {
        setOtpVerified(false);
        setOtpError(true);
      }
    }
    setLoading(false);
  };

  const updatePassword = async () => {
    setLoading(true);
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
      if (error.response.status === 400) {
        setPasswordError(true);
      }
    }
    setLoading(false);
  };

  const handleReset = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // if (isValid()) {
    resetPassword();
    // }
  };
  const handleChangePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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

  if (status === "unauthenticated") {
    return (
      <>
        {otpVerified ? (
          <>
            <form
              className="h-screen w-screen gap-3 flex flex-col justify-center items-center"
              onSubmit={handleChangePassword}
            >
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block  p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 w-72"
                required
              />
              {/* {error.password && (
              <span className="text-danger">{error.password}</span>
            )} */}
              <input
                type="submit"
                className="w-30 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
                disabled={disable || loading}
                value={loading ? "Please wait..." : "Reset password"}
              />

              <span className={passwordError ? "text-red-500" : "hidden"}>
                Unable to reset password
              </span>
            </form>
          </>
        ) : (
          <form
            onSubmit={handleReset}
            className="flex gap-2 flex-col justify-center h-screen items-center w-screen "
          >
            <label>Please enter your reset code</label>
            <div className="flex justify-evenly w-80">
              <OtpInput value={otp} valueLength={6} onChange={onChange} />
            </div>
            <input
              type="submit"
              className="w-30 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              disabled={disable || loading}
              value={loading ? "Please wait..." : "Reset password"}
            />
            <span className={otpError ? "text-red-500" : "hidden"}>
              Wrong OTP, Try again
            </span>
          </form>
        )}
      </>
    );
  }
}

export default ResetPage;
