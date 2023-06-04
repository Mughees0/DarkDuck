"use client";

import { Loader } from "@/components/Loader";
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

  if (status === "unauthenticated") {
    return isLoaded ? (
      <>
        <SignUp />
      </>
    ) : (
      <Loader />
    );
  } else {
    return (
      <main className="flex h-screen w-screen justify-center items-center">
        <div>Please SignOut First</div>
      </main>
    );
  }
}

export default Signup;
