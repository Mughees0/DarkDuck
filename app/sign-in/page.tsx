"use client";

import Loader from "../../components/Loader";
import SignIn from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthRedirect from "@/components/AuthRedirect";

function Signin() {
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
        <SignIn />
      </>
    ) : (
      <Loader />
    );
  } else {
    return <AuthRedirect />;
  }
}

export default Signin;
