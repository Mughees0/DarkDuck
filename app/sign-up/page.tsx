"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { GiConsoleController, GiDuck } from "react-icons/gi";

import React from "react";
import useColorMode from "../../hooks/useColorMode";
import { BsFillMoonFill, BsFillSunFill } from "react-icons/bs";
import { GoHome } from "react-icons/go";
import axios from "axios";
import {
  HTMLElementEvent,
  restCountriesApi,
  UserInputData,
  UserInputErrors,
} from "@/types";
import type { NextPage } from "next";
import { signIn, getProviders } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

import email from "next-auth/providers/email";
import Link from "next/link";
import { StringDecoder } from "string_decoder";

const SignUp = () => {
  const [loading, setLoading] = useState(false);
  const [colorMode, setColorMode] = useColorMode();
  const pathname = usePathname();
  const router = useRouter();
  const [totalLanguagesSuggestions, setTotalLanguagesSuggestions] = useState(
    []
  );
  const [languageSuggestion, setLanguageSuggestion] = useState("");
  const [user, setUser] = useState<UserInputData>();

  const [error, setError] = useState<UserInputErrors>();

  const [countries, setCountries] = useState<restCountriesApi>();

  async function restCountries() {
    try {
      const req = await axios.get(
        "https://restcountries.com/v3.1/independent?status=true&fields=languages,name,idd"
      );
      const res = await req.data;
      setCountries(res);
    } catch (err: any) {
      throw new Error(err);
    }
  }

  useEffect(() => {
    restCountries();
  }, []);

  // apiResult hold the result of api coming from redux

  //   const apiResult = useSelector((state) => state.auth);
  //   const countryList = useSelector((state) => {
  //     // console.log('sate list usestate',state)
  //     if (state?.auth?.countrylistandlanguages) {
  //       var array = Object.values(state.auth.countrylistandlanguages.data);

  //       array = array.sort((a, b) =>
  //         a.name > b.name ? 1 : b.name > a.name ? -1 : 0
  //       );
  //       return array;
  //     }
  //   }, shallowEqual);
  //   console.log('countryList',countryList)
  //   const total_languages = useSelector((state) => {
  //     // console.log('sate list usestate',state)
  //     if (state?.auth?.countrylistandlanguages) {
  //       var array = Object.values(state?.auth?.countrylistandlanguages.languages);
  //       return array;
  //     }
  //   }, shallowEqual);

  // console.log('total_languages',total_languages)
  /**
   *
   * handleChangeInput() handleChangeInput function used for changing the input values
   */
  //   const handleChangeInput = ({ name, value, checked }) => {
  //     // console.log('name',name)
  //     // console.log('value',Validation.number(value))
  //     if (name == "termsCondition" && checked) {
  //       setUser({ ...user, [name]: true });
  //     } else if (name == "termsCondition" && !checked) {
  //       setUser({ ...user, [name]: false });
  //     } else if (name == "age" && !Validation.ageNum(value)) {
  //       setUser({ ...user, age: "" });
  //     } else if (name == "cityCode" && !Validation.isValidCityCode(value)) {
  //       setUser({ ...user, cityCode: "" });
  //     } else {
  //       setUser({ ...user, [name]: value });
  //     }
  //     setError({ ...error, [name]: "" });
  //   };

  /**
   *
   * isValid() isValid function used for validating the input values
   */

  const token = localStorage.getItem("token");
  useEffect(() => {
    // if (apiResult.errorUserRegister) {
    //   toastError(apiResult.errorUserRegister);
    // }
    if (token) {
      //   navigate("/");
    }
  }, [token]);

  const isValid = () => {
    let isValid = true;
    if (error != undefined && user != undefined) {
      if (!user?.username) {
        error.username = "Name is required";
        isValid = false;
      }

      //   if (!Validation.AphabeticalsValidation(user.username)) {
      //     error.username = "Only Characters are allowed";
      //     isValid = false;
      //   }

      if (!user.email) {
        error.email = "Email is required";
        isValid = false;
      }

      //   if (user.email && !Validation.EmailValidation(user.email)) {
      //     error.email = "Please Enter valid Email";
      //     isValid = false;
      //   }

      if (!user.password) {
        error.password = "Password is required";
        isValid = false;
      }

      //   if (user.password && !Validation.passwordValidation(user.password)) {
      //     error.password = "Please provide password of minimum length 8";
      //     isValid = false;
      //   }

      if (!user.phone) {
        error.phone = "Phone is required";
        isValid = false;
      }

      //   if (user.phone && !Validation.numericPhone(user.phone)) {
      //     error.phone = "Please provide 10 digit number";
      //     isValid = false;
      //   }

      if (!user.age) {
        error.age = "Age is required";
        isValid = false;
      }

      if (!user.countryCode) {
        error.countryCode = "Country code is required";
        isValid = false;
      }

      //   if (user.countryCode && !Validation.countryCode(user.countryCode)) {
      //     error.countryCode = "Should be '+' and 3 numbers";
      //     isValid = false;
      //   }

      //   if (user.age && !Validation.ageNum(user.age)) {
      //     error.age = "Only numbers are allowed and should be less than 100";
      //     isValid = false;
      //   }

      if (!user.country) {
        error.country = "Country is required";
        isValid = false;
      }

      if (!user.languages) {
        error.languages = "Language is required";
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

      //   if (user.cityCode && !Validation.isValidCityCode(user.cityCode)) {
      //     error.cityCode = "Only character and space are allowed";
      //     isValid = false;
      //   }
    }
    setError({ ...error });
    return isValid;
  };

  /**
   *
   * onSubmit() onSubmit function used for submiting the input values
   * userRegister() : this will hit the user-register api
   */

  //   const onSubmit = async (e) => {
  //     e.preventDefault();
  //     // console.log('user',user)
  //     if (isValid()) {
  //       // return false
  //       setLoading(true);
  //       await dispatch(userRegister(user));
  //       setLoading(false);
  //       navigate(0);
  //     }
  //   };

  const handleCountry = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // var arr = countries.filter((c) => c.name.common == e.target.value);

    setUser({
      ...user!,
      country: e.target.value!,
      // countryCode: "+" + arr[0].phone,
    });
    setError({ ...error, country: "" });
    // }
  };

  const handleLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // var arr = countries.filter((c) => c.name.common == e.target.value);

    setUser({
      ...user!,
      languages: [...user.languages, e.target.value]!,
    });

    setError({ ...error, languages: "" });
  };

  const handleTerms = () => {
    // var arr = countries.filter((c) => c.name.common == e.target.value);

    setUser({
      ...user!,
      termsCondition: user?.termsCondition!,
    });

    setError({ ...error, termsCondition: false });
  };

  const handleCountryCode = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // var arr = countries.filter((c) => c.name.common == e.target.value);

    setUser({
      ...user!,
      countryCode: e.target.value!,
    });
    setError({ ...error, countryCode: "" });
  };
  //   const escapeRegexCharacters = (str: string) => {
  //     return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  //   };

  //   const onSuggestionsFetchRequested = async ({ value }) => {
  //     // await this.props.listCountries();

  //     var all_languages = [];

  //     all_languages = total_languages;

  //     const escapedValue = escapeRegexCharacters(value.trim());

  //     var array = Object.values(all_languages);
  //     array.push({ name: "Khmer", native: "Cambodia" });
  //     if (escapedValue === "") {
  //       all_languages = [];
  //     }
  //     const regex = new RegExp("^" + escapedValue, "i");
  //     setTotalLanguagesSuggestions(array.filter((c, i) => regex.test(c.name)));

  //     // this.setState({
  //     //     total_languages_suggestions: array.filter((c, i) => regex.test(c.name))
  //     // });
  //   };

  //   const getSuggestionValue = (suggestion) => {
  //     // let fields = user;
  //     // let errors = this.state.errors;
  //     // errors['language'] = ''
  //     error.language = "";
  //     setError({ ...error });
  //     // this.setState({ errors })
  //     if (suggestion.name < 1) return "";

  //     if (suggestion.name.trim().length < 1) return "";
  //     // let languageFound = fields['language'].find(t => t.toLowerCase() === suggestion.name.toLowerCase())
  //     let languageFound =
  //       user.language.toLowerCase() === suggestion.name.toLowerCase();
  //     if (languageFound) {
  //       error.language = `Can't add duplicate language`;
  //       setError({ ...error });
  //       // this.setState({ errors })
  //       return "";
  //     }

  //     user.language = suggestion.name;
  //     error.language = "";
  //     setUser({ ...user });
  //     setError({ ...error });

  //     // this.setState({fields, errors, disable: false});

  //     return "";
  //   };

  //   const renderSuggestion = (suggestion, { query }) => {
  //     return <div className="text-white ">{suggestion.name}</div>;
  //   };
  //   const onHandleProjectChange = (event, { newValue, method }) => {
  //     // let fields = this.state.fields
  //     // fields['language_suggestion'] = newValue
  //     setLanguageSuggestion(newValue);
  //     // this.setState({ fields })
  //   };

  //   const inputProps = {
  //     className:
  //       "bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500",
  //     placeholder: `Add Language`,
  //     value: languageSuggestion,
  //     onChange: onHandleProjectChange,
  //   };

  const onSuggestionsClearRequested = () => {
    // this.setState({
    //     total_languages_suggestions: []
    // });
    setTotalLanguagesSuggestions([]);
  };

  const redirectToHome = () => {
    if (pathname === "/sign-up" || pathname === "/sign-in") {
      // TODO: redirect to a success register page
      router.push("/");
    }
  };

  const registerUser = async () => {
    const res = await axios
      .post(
        "/api/v1/users",
        {
          username: user?.username,
          email: user?.email,
          password: user?.password,
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
        console.log(error);
      });
    console.log(res);
  };

  const loginUser = async () => {
    const res: any = await signIn("credentials", {
      redirect: false,
      email: user?.email,
      password: user?.password,
      callbackUrl: `${window.location.origin}`,
    });

    res.error ? console.log(res.error) : redirectToHome();
  };

  const formSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log('user',user)
    // if (isValid()) {
    registerUser();
    // }
  };

  return (
    <>
      <section>
        <div className="flex justify-end">
          {/* <!-- Home --> */}
          <Link
            href="/home"
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
              <BsFillMoonFill className="text-black" />
            ) : (
              <BsFillSunFill />
            )}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto  md:h-full lg:py-0 ">
          <div className="w-full bg-white rounded-lg shadow my-5 dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8 border border-white outline-none rounded-md ">
              <div className="flex justify-center">
                <GiDuck className=" text-[50px] dark:text-white" />
              </div>
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create your account
              </h1>
              <form className="space-y-4 md:space-y-6  " onSubmit={formSubmit}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required
                    value={user?.email || ""}
                    onChange={(e) =>
                      setUser({ ...user!, email: e.target.value! })
                    }
                  />
                  {error?.email && (
                    <span className="text-red-400">{error?.email}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter Name"
                    value={user?.username || ""}
                    onChange={(e) =>
                      setUser({ ...user!, username: e.target.value! })
                    }
                  />
                  {error?.username && (
                    <span className="text-red-400">{error.username}</span>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username (Optional)
                  </label>
                  <input
                    type="text"
                    name="alias"
                    id="alias"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Enter username"
                    value={user?.alias || ""}
                    onChange={(e) =>
                      setUser({ ...user!, alias: e.target.value! })
                    }
                  />
                </div>

                <div>
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
                    onChange={(e) =>
                      setUser({ ...user!, password: e.target.value! })
                    }
                  />
                  {error?.password && (
                    <span className="text-red-400">{error.password}</span>
                  )}
                </div>

                <div>
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
                    {countries?.map((country) => {
                      return (
                        <option
                          key={country.name.official}
                          value={country.name.common}
                        >
                          {country.name.common}
                        </option>
                      );
                    })}
                  </select>
                  <span className="text-red-400">
                    {error?.country ? "Country is required" : ""}
                  </span>
                </div>

                <div>
                  <label
                    htmlFor="language"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Language
                  </label>
                  <select
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    id="language"
                    value={user?.languages}
                    onChange={handleLanguage}
                    aria-label="Default select example"
                  >
                    <option>Select Language</option>
                    {countries?.map(
                      (country) =>
                        country.languages &&
                        Object.entries(country.languages).map(
                          ([key, value]: [key: string, value: string]) => {
                            return (
                              <option key={country.name.official} value={value}>
                                {value}
                              </option>
                            );
                          }
                        )
                    )}
                  </select>
                  <span className="text-red-400">
                    {error?.languages ? "Language is required" : ""}
                  </span>
                </div>

                <div className="flex justify-between gap-2">
                  {" "}
                  <div className=" w-28">
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
                      placeholder="Country Code"
                      name="countryCode"
                      value={user?.countryCode}
                      onChange={handleCountryCode}
                      aria-label="Default select example"
                    >
                      <option>Code</option>
                      {countries?.map((country) => {
                        return (
                          <option
                            key={country.name.official}
                            value={country.idd.root + country?.idd?.suffixes}
                          >
                            {country.idd.root + country?.idd?.suffixes}
                          </option>
                        );
                      })}
                    </select>
                    {error?.countryCode && (
                      <span className="text-red-400">{error.countryCode}</span>
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
                      onChange={(e) =>
                        setUser({ ...user!, phone: e.target.value! })
                      }
                    />
                    {error?.phone && (
                      <span className="text-red-400">{error.phone}</span>
                    )}
                  </div>
                </div>
                <div>
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
                    onChange={(e) =>
                      setUser({ ...user!, age: e.target.value! })
                    }
                  />
                  {error?.age && (
                    <span className="text-red-400">{error.age}</span>
                  )}
                </div>
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
                <div>
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
                </div>
                <div>
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
                </div>
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
                <div>
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
                </div>
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
                <div>
                  <label
                    htmlFor="cityCode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    City
                  </label>
                  <input
                    type="text"
                    id="cityCode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    name="cityCode"
                    value={user?.city}
                    onChange={(e) =>
                      setUser({ ...user!, city: e.target.value! })
                    }
                    placeholder="City"
                  />

                  <span className="text-red-400">
                    {error?.city ? "City is required" : ""}
                  </span>
                </div>
                <div>
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
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300  rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required
                      onClick={handleTerms}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="font-light text-gray-500 dark:text-gray-300"
                      //   checked={user.termsCondition}
                      onChange={handleTerms}
                    >
                      I accept the{" "}
                      <a
                        className="font-medium dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                        href="/DarkDuck Terms of Service and User Agreement (1).pdf"
                      >
                        Terms and Conditions
                      </a>{" "}
                      &{" "}
                      <a
                        className="font-medium dark:text-gray-300 text-gray-600 hover:text-black dark:hover:text-white"
                        href="/DarkduckPrivacy.pdf"
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
};

export default SignUp;
