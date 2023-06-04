"use client";
import Footer from "@/components/Footer";
import Header from "@/components/header";
import { Loader } from "@/components/Loader";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

function Profile() {
  const { data: session, status } = useSession();
  // const router = useRouter();
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
        <Footer />
      </>
    ) : (
      <Loader />
    );
  } else {
    return (
      <main className="flex h-screen w-screen justify-center items-center">
        <div>Please Login First</div>
      </main>
    );
  }
}

export default Profile;
