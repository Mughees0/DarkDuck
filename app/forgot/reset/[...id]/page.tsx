"use client";
import OtpInput from "@/components/OtpInput";
import { UserResponse } from "@/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

function ResetPage() {
  const { id } = useParams();
  const [userData, setUserData] = useState<UserResponse>();
  const [otp, setOtp] = useState("");
  const [disable, setDisable] = useState(false);
  const [loader, setLoader] = useState(false);
  const onChange = (value: string) => setOtp(value);

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

  const resetPassword = async () => {
    try {
      const req = await axios.post(
        `/api/v1/reset`,
        {
          otp: otp,
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
      redirectToReset(res?.emailUser?._id);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!id) {
      return;
    }
    fetchUserData(id);
  }, [id]);

  return (
    <div className="flex gap-2 flex-col justify-center h-screen items-center w-screen ">
      <h1>Please enter your reset code</h1>
      <div className="flex justify-evenly w-80">
        <OtpInput value={otp} valueLength={6} onChange={onChange} />
      </div>
      <button
        type="submit"
        className="w-30 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        disabled={disable || loader}
      >
        {loader ? "Please wait..." : "Reset password"}
      </button>
    </div>
  );
}

export default ResetPage;
