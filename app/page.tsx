"use client";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/header";
import HomePage from "@/components/HomePage";
import { Loader } from "../components/Loader";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";

export default function Home() {
  const { data: session } = useSession();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded((isLoaded) => true);
  }, []);

  if (session) {
    return isLoaded ? (
      <main>
        <Header />
        <Dashboard />
        <Footer />
      </main>
    ) : (
      <Loader />
    );
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
