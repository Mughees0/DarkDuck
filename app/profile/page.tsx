"use client";
import Footer from "@/components/Footer";
import Header from "@/components/header";
import Loader from "@/components/Loader";
import UnAuthRedirect from "../../components/UnAuthRedirect";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [updatePosts, setUpdatePosts] = useState(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (status === "authenticated") {
    return isLoaded ? (
      <>
        <Header updatePosts={updatePosts} setUpdatePosts={setUpdatePosts} />
        <UserProfile updatePosts={updatePosts} />
      </>
    ) : (
      <Loader />
    );
  } else if (status === "loading") {
    return <Loader />;
  } else {
    return <UnAuthRedirect />;
  }
}

export default Profile;
