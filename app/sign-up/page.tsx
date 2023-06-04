"use client";

import Loader from "@/components/Loader";
import SignUp from "@/components/SignUp";
import UnAuthRedirect from "@/components/UnAuthRedirect";
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
    return <UnAuthRedirect />;
  }
}

export default Signup;
