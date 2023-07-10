"use client";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/header";
import HomePage from "@/components/HomePage";
import Loader from "../components/Loader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Upload from "@/components/Upload";

export default function Home() {
  const { data: session, status } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [updatePosts, setUpdatePosts] = useState(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (status === "authenticated") {
    return isLoaded ? (
      <main>
        <Header updatePosts={updatePosts} setUpdatePosts={setUpdatePosts} />
        <Dashboard updatePosts={updatePosts} setUpdatePosts={setUpdatePosts} />
        <Footer />
      </main>
    ) : (
      <Loader />
    );
  } else if (status === "loading") {
    return <Loader />;
  } else {
    return isLoaded ? (
      <main>
        <HomePage />
      </main>
    ) : (
      <Loader />
    );
  }
}
