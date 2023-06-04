"use client";
import { useEffect, useState } from "react";
import React from "react";
import useColorMode from "../hooks/useColorMode";

import { BsMoon } from "@react-icons/all-files/bs/BsMoon";
import { BiSun } from "@react-icons/all-files/bi/BiSun";
import { GoHome } from "@react-icons/all-files/go/GoHome";
import axios from "axios";
import { CountryApi, UserInputData, UserInputErrors } from "@/types";
import { signIn, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Validation from "@/utils/validator/validators";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [languages, setLanguages] = useState<string[]>();
  const [user, setUser] = useState<UserInputData>({
    email: "none",
    username: "none",
    alias: "none",
    password: "none",
    country: "none",
    language: "none",
    countryCode: "none",
    phone: "none",
    age: "none",
    occupation: "none",
    instruments: [],
    research: "none",
    software: "none",
    highEducation: "none",
    city: "none",
    zipCode: "none",
    address: "none",
    termsCondition: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  const [error, setError] = useState<UserInputErrors>();
  const [countries, setCountries] = useState<CountryApi>();
  const [dialCodes, setDialCodes] = useState([]);

  async function restCountries() {
    try {
      const req = await axios.get(
        "https://countriesnow.space/api/v0.1/countries/codes"
      );
      const res = await req.data;
      let dialCode = res?.data.map((country) => country.dial_code);
      dialCode = [...new Set(dialCode)];
      setCountries(res);
      setDialCodes(dialCode);
    } catch (err: any) {
      if (err.response.status === 400) {
        console.log(
          "Not able to fetch dial codes and country names, API request failed." +
            " The error message:> " +
            err.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  }

  async function restLanguages() {
    try {
      const req = await axios.get("/languages.json");
      const res = req.data;
      setLanguages(res);
    } catch (err: any) {
      if (err.response.status === 400) {
        console.log(
          "Not able to fetch languages from the public of our server." +
            " The error message:> " +
            err.message
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  }

  useEffect(() => {
    restCountries();
    restLanguages();
  }, []);

  const isValid = () => {
    let isValid = true;
    if (error != undefined && user != undefined) {
      if (!user?.username) {
        error.username = "Name is required";
        isValid = false;
      }

      if (!Validation.AphabeticalsValidation(user.username)) {
        error.username = "Only Characters are allowed";
        isValid = false;
      }

      if (!user.email) {
        error.email = "Email is required";
        isValid = false;
      }

      if (user.email && !Validation.EmailValidation(user.email)) {
        error.email = "Please enter valid Email";
        isValid = false;
      }

      if (!user.password) {
        error.password = "Password is required";
        isValid = false;
      }

      if (user.password && !Validation.passwordValidation(user.password)) {
        error.password = "Please provide password of minimum length 8";
        isValid = false;
      }

      if (!user.phone) {
        error.phone = "Phone Number is required";
        isValid = false;
      }

      if (user.phone && !Validation.numericPhone(user.phone)) {
        error.phone = "Please provide 9 digit number";
        isValid = false;
      }

      if (!user.age) {
        error.age = "Age is required";
        isValid = false;
      }

      if (!user.countryCode) {
        error.countryCode = "Country code is required";
        isValid = false;
      }

      if (user.countryCode && !Validation.countryCode(user.countryCode)) {
        error.countryCode = "Should be '+' and 3 numbers";
        isValid = false;
      }

      if (user.age && !Validation.ageNum(user.age)) {
        error.age = "Only numbers are allowed and should be less than 100";
        isValid = false;
      }

      if (!user.country) {
        error.country = "Country is required";
        isValid = false;
      }

      if (!user.language) {
        error.language = "Language is required";
        isValid = false;
      }

      if (!user.city) {
        error.city = "City is required";
        isValid = false;
      }

      if (!user.termsCondition) {
        error.termsCondition = "Please accept to continue";
        isValid = false;
      }

      if (user.city && !Validation.isValidCity(user.city)) {
        error.city = "Only character and space are allowed";
        isValid = false;
      }
    }
    setError({ ...error });
    return isValid;
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      email: e.target.value!,
    });
    setError({ ...error, email: "" });
    // }
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      username: e.target.value!,
    });
    setError({ ...error, username: "" });
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      password: e.target.value!,
    });
    setError({ ...error, password: "" });
  };

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user!,
      country: e.target.value!,
    });
    setError({ ...error, country: "" });
  };

  const handlePhoneNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      phone: e.target.value!,
    });
    setError({ ...error, phone: "" });
  };

  const handleLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user!,
      language: e.target.value!,
    });
    setError({ ...error, language: "" });
  };

  const handleAge = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      age: e.target.value!,
    });
    setError({ ...error, age: "" });
    // }
  };

  const handleCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({
      ...user!,
      city: e.target.value!,
    });
    setError({ ...error, city: "" });
    // }
  };

  const handleTerms = () => {
    setUser({
      ...user!,
      termsCondition: !user.termsCondition,
    });

    setError({ ...error, termsCondition: "" });
  };

  const handleCountryCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUser({
      ...user!,
      countryCode: e.target.value!,
    });
    setError({ ...error, countryCode: "" });
  };

  const redirectToHome = () => {
    if (pathname === "/sign-up" || pathname === "/sign-in") {
      // TODO: redirect to a success register page
      router.push("/");
    }
  };

  const registerUser = async () => {
    setLoading(true);
    const res = await axios
      .post(
        "/api/v1/users/register",
        {
          email: user?.email,
          username: user?.username,
          alias: user?.alias ? user.alias : "none",
          password: user?.password,
          country: user?.country,
          language: user?.language,
          countryCode: user?.countryCode,
          phone: user?.phone,
          age: user?.age,
          occupation: user?.occupation ? user.occupation : "none",
          instruments: user?.instruments ? user.instruments : "none",
          research: user?.research ? user.research : "none",
          software: user?.software ? user.software : "none",
          highEducation: user?.highEducation ? user.highEducation : "none",
          city: user?.city,
          zipCode: user?.zipCode ? user.zipCode : "none",
          address: user?.address ? user.address : "none",
          termsCondition: user?.termsCondition,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      )
      .then(async () => {
        await loginUser();
        redirectToHome();
      })
      .catch((error) => {
        if (error.response.status === 400) {
          console.log(
            "Not able to register user, API request failed." +
              " The error message:> " +
              error.message
          );
        } else {
          console.log("Wrong call to the api, wrong route maybe.");
        }
      });

    setLoading(false);
  };

  const loginUser = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: user?.email,
      password: user?.password,
      callbackUrl: `${window.location.origin}`,
    });

    res.error ? res.error : redirectToHome();
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid()) {
      registerUser();
    }
  };

  if (!session) {
    return (
      <>
        <section className="h-full">
          <div className="flex justify-end">
            {/* <!-- Home --> */}
            <Link
              href="/"
              type="button"
              className="py-4 bg-transparent text-gray-500 rounded-lg hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mr-1"
            >
              <GoHome className="h-6 w-6 bg-gray-200" />
            </Link>
            <button
              className=" text-white dark:text-white p-4"
              onClick={() =>
                setColorMode(colorMode === "light" ? "dark" : "light")
              }
            >
              {colorMode === "light" ? (
                <BsMoon className="text-black" />
              ) : (
                <BiSun />
              )}
            </button>
          </div>
          <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  md:h-full lg:py-0 ">
            <div className="w-full bg-white rounded-lg shadow my-5 dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
              <div className="p-6 space-y-4 md:space-y-6 sm:p-8 border border-white outline-none rounded-md ">
                <div className="flex justify-center">
                  <img
                    src={
                      colorMode === "light"
                        ? "/assets/logo.png"
                        : "/assets/solid-red-duck.png"
                    }
                    className="w-16 h-16 dark:text-white"
                  />
                </div>
                <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Create your account
                </h1>
                <form
                  className="space-y-4 md:space-y-6  "
                  onSubmit={formSubmit}
                >
                  <>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Email
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      value={user?.email}
                      onChange={handleEmail}
                    />
                    {error?.email && (
                      <span className="text-red-400">{error?.email}</span>
                    )}
                  </>

                  <>
                    <label
                      htmlFor="username"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Name"
                      value={user?.username || ""}
                      onChange={handleUsername}
                    />
                    {error?.username && (
                      <span className="text-red-400">{error?.username}</span>
                    )}
                  </>

                  <>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Alias (Optional)
                    </label>
                    <input
                      type="text"
                      name="alias"
                      id="alias"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter alias (nick name)"
                      value={user?.alias || ""}
                      onChange={(e) =>
                        setUser({ ...user!, alias: e.target.value! })
                      }
                    />
                  </>

                  <>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={user?.password || ""}
                      onChange={handlePassword}
                    />
                    {error?.password && (
                      <span className="text-red-400">{error.password}</span>
                    )}
                  </>

                  <>
                    <label
                      htmlFor="country"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Select Country
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="country"
                      value={user?.country}
                      onChange={handleCountry}
                      aria-label="Default select example"
                    >
                      <option>Select Country</option>
                      {countries?.data.map((country) => {
                        return (
                          <option key={country.name} value={country.name}>
                            {country.name}
                          </option>
                        );
                      })}
                    </select>
                    <span className="text-red-400">
                      {error?.country ? "Country is required" : ""}
                    </span>
                  </>

                  <>
                    <label
                      htmlFor="language"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Language
                    </label>
                    <select
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="language"
                      value={user?.language}
                      onChange={handleLanguage}
                      aria-label="Default select example"
                    >
                      <option>Select Language</option>
                      {languages?.map((language) => (
                        <option key={language} value={language}>
                          {language}
                        </option>
                      ))}
                    </select>
                    <span className="text-red-400">
                      {error?.language ? "Language is required" : ""}
                    </span>
                  </>

                  <div className="flex justify-between gap-2">
                    {" "}
                    <div className=" w-32">
                      <label
                        htmlFor="countryCode"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Country Code
                      </label>
                      {/* <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={user?.countryCode || ""}
                      onChange={({ target }) => handleChangeInput(target)}
                    /> */}
                      <select
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="countryCode"
                        placeholder="Select Code"
                        name="countryCode"
                        value={user?.countryCode}
                        onChange={handleCountryCode}
                        aria-label="Default select example"
                      >
                        <option>Select Code</option>
                        {dialCodes?.sort().map((dial_code) => {
                          return (
                            <option key={dial_code} value={dial_code}>
                              {dial_code}
                            </option>
                          );
                        })}
                      </select>
                      {error?.countryCode && (
                        <span className="text-red-400">
                          {error.countryCode}
                        </span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <label
                        htmlFor="phone"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Phone Number
                      </label>
                      <input
                        type="text"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        id="phone"
                        placeholder="Enter Phone"
                        name="phone"
                        value={user?.phone || ""}
                        onChange={handlePhoneNumber}
                      />
                      {error?.phone && (
                        <span className="text-red-400">{error.phone}</span>
                      )}
                    </div>
                  </div>
                  <>
                    <label
                      htmlFor="age"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Age
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="age"
                      placeholder="Enter Age"
                      name="age"
                      value={user?.age || ""}
                      onChange={handleAge}
                    />
                    {error?.age && (
                      <span className="text-red-400">{error.age}</span>
                    )}
                  </>
                  <div>
                    <label
                      htmlFor="occupation"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Occupation (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="occupation"
                      placeholder="Enter Occupation"
                      name="occupation"
                      value={user?.occupation || ""}
                      onChange={(e) =>
                        setUser({ ...user!, occupation: e.target.value! })
                      }
                    />
                  </div>
                  <>
                    <label
                      htmlFor="instruments"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Instruments Used (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="instruments"
                      placeholder="Enter Instruments Used"
                      name="instruments"
                      value={user?.instruments || ""}
                      onChange={(e) =>
                        setUser({
                          ...user!,
                          instruments: [...user.instruments, e.target.value]!,
                        })
                      }
                    />
                  </>
                  <>
                    <label
                      htmlFor="research"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Research Projects (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="projects"
                      placeholder="Enter Research Projects"
                      name="research"
                      value={user?.research || ""}
                      onChange={(e) =>
                        setUser({ ...user!, research: e.target.value! })
                      }
                    />
                  </>
                  <div>
                    <label
                      htmlFor="software"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Software Used (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="software"
                      placeholder="Enter Software Used"
                      name="software"
                      value={user?.software || ""}
                      onChange={(e) =>
                        setUser({ ...user!, software: e.target.value! })
                      }
                    />
                  </div>
                  <>
                    <label
                      htmlFor="education"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Education (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="education"
                      placeholder="Enter Education"
                      name="highEducation"
                      value={user?.highEducation || ""}
                      onChange={(e) =>
                        setUser({ ...user!, highEducation: e.target.value! })
                      }
                    />
                  </>
                  <div>
                    <label
                      htmlFor="zipCode"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Zip Code (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="zipCode"
                      placeholder="Enter Zip Code"
                      name="zipCode"
                      value={user?.zipCode || ""}
                      onChange={(e) =>
                        setUser({ ...user!, zipCode: e.target.value! })
                      }
                    />
                  </div>
                  <>
                    <label
                      htmlFor="city"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="city"
                      value={user?.city}
                      onChange={handleCity}
                      placeholder="Enter City"
                    />

                    <span className="text-red-400">
                      {error?.city ? "City is required" : ""}
                    </span>
                  </>
                  <>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Address (Optional)
                    </label>
                    <input
                      type="text"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      id="address"
                      placeholder="Enter Address"
                      name="address"
                      value={user?.address || ""}
                      onChange={(e) =>
                        setUser({ ...user!, address: e.target.value! })
                      }
                    />
                  </>
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300  rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                        onChange={handleTerms}
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label
                        htmlFor="terms"
                        className="font-light text-gray-500 dark:text-gray-300"
                        //   checked={user.termsCondition}
                      >
                        I accept the{" "}
                        <a
                          download
                          className="font-medium dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                          href="/assets/DarkDuckTermsofService-and-UserAgreement.pdf"
                        >
                          Terms and Conditions
                        </a>{" "}
                        &{" "}
                        <a
                          download
                          className="font-medium dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                          href="/assets/DarkduckPrivacy.pdf"
                        >
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                  </div>
                  <span className="text-red-400">
                    {error?.termsCondition ? "Please accept to continue" : ""}
                  </span>
                  <input
                    type="submit"
                    className="w-full text-gray-200 dark:text-gray-700 bg-gray-600 hover:bg-black  focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-300 dark:hover:bg-white dark:focus:ring-primary-800"
                    disabled={loading}
                    value={loading ? "Please Wait..." : "Sign Up"}
                  />
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="font-medium  dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                    >
                      Login here
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
};

export default SignUp;
