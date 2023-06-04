"use client";

import AuthRedirect from "@/components/AuthRedirect";
import Loader from "@/components/Loader";
import SignUp from "@/components/SignUp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Signup() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (status === "loading") {
    return <Loader />;
  } else if (status === "unauthenticated") {
    return isLoaded ? (
      <>
        <Signup />
      </>
    ) : (
      <Loader />
    );
  } else {
    return <AuthRedirect />;
  }
}

export default Signup;
