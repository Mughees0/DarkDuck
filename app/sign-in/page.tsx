"use client";

import { Loader } from "../../components/Loader";
import SignIn from "@/components/SignIn";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Signin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (status === "unauthenticated") {
    return isLoaded ? (
      <>
        <SignIn />
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

export default Signin;
