"use client";
import Header from "@/components/header";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <>
        <Header />
        <UserProfile />
      </>
    );
  } else {
    router.push("/");
  }
}

export default Profile;
