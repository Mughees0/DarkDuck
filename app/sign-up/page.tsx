"use client";

import { Loader } from "@/components/Loader";
import SignUp from "@/components/SignUp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Signup() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (!session) {
    return isLoaded ? (
      <>
        <SignUp />
      </>
    ) : (
      <Loader />
    );
  } else {
    router.push("/");
  }
}

export default Signup;
