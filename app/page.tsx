"use client";
import AudioRecorder from "@/components/AudioRecorder";
import Dashboard from "@/components/Dashboard";
import Header from "@/components/header";
import HomePage from "@/components/HomePage";
import UserProfile from "@/components/UserProfile";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  if (session) {
    return (
      <main>
        <>
          <Header />
          <Dashboard />
        </>
      </main>
    );
  } else {
    return (
      <main>
        <HomePage />
      </main>
    );
  }
}
