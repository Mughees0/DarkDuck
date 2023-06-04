"use client";
import Link from "next/link";

const unAuthRedirect = () => {
  return (
    <main className="flex h-screen w-screen justify-center flex-col gap-3  items-center dark:text-gray-50">
      <div>Please Login First</div>
      <div className="flex justify-between gap-3">
        <Link
          className=" border-2 rounded hover:bg-black hover:text-white dark:hover:bg-gray-50 dark:hover:text-gray-900 p-2"
          href="/sign-in"
        >
          Login
        </Link>
        <Link
          className=" border-2 rounded hover:bg-black hover:text-white dark:hover:bg-gray-50 dark:hover:text-gray-900 p-2"
          href="/sign-up"
        >
          Sign up
        </Link>
      </div>
    </main>
  );
};

export default unAuthRedirect;
