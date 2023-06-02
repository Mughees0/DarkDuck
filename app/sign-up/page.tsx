"use client";

import SignUp from "@/components/SignUp";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Signup() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) {
    return (
      <>
        <SignUp />
      </>
    );
  } else {
    router.push("/dashboard");
  }
}

export default Signup;
