import { useState, useEffect } from "react";

const useLocalStorage = (key: string, initialValue: string) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      if (error.response.status === 400) {
        console.log(
          "Not able to fetch localstorage data to use in dark mode, API request failed."
        );
      } else {
        console.log("Wrong call to the api.");
      }
      return initialValue;
    }
  });

  // useEffect to update local storage when the state changes
  useEffect(() => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        typeof storedValue === "function"
          ? storedValue(storedValue)
          : storedValue;
      // Save state
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      if (error.response.status === 400) {
        console.log(
          "Not able to set localstorage data to current theme (dark or light), API request failed."
        );
      } else {
        console.log("Wrong call to the api.");
      }
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;
