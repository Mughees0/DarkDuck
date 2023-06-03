"use client";

import { Loader } from "@/components/loader";
import SignIn from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Signin() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (!session) {
    return isLoaded ? (
      <>
        <SignIn />
      </>
    ) : (
      <Loader />
    );
  } else {
    router.push("/");
  }
}

export default Signin;
