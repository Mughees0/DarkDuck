"use client";
import Link from "next/link";

const AuthRedirect = () => {
  return (
    <main className="flex h-screen w-screen justify-center flex-col gap-3  items-center dark:text-gray-50">
      <div>You're already logged in!</div>
      <div className="flex justify-between gap-3">
        <Link
          className=" border-2 rounded  hover:bg-black hover:text-white dark:hover:bg-gray-50 dark:hover:text-gray-900 p-2"
          href="/"
        >
          Home
        </Link>
      </div>
    </main>
  );
};

export default AuthRedirect;
