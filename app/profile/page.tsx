"use client";
import Footer from "@/components/Footer";
import Header from "@/components/header";
import { Loader } from "@/components/Loader";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function Profile() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (session) {
    return isLoaded ? (
      <>
        <Header />
        <UserProfile />
        <Footer />
      </>
    ) : (
      <Loader />
    );
  } else {
    router.push("/");
  }
}

export default Profile;
