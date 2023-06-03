export const validateEmail = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};
export const validatePassword = (email: string): boolean => {
  const regEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return regEx.test(email);
};

// import * as moment from 'moment';

export const Email = new RegExp(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
export const Dateformat = new RegExp(
  /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i
);
export const Alphanumeric = new RegExp(/^[A-Za-z\d\s]+$/);
export const Aphabeticals = new RegExp(/^[a-zA-Z ]*$/);

export const EmailValidation = (email) => Email.test(email);
export const DateFormatValidation = (date) => Dateformat.exec(date);
export const AlphanumeicValidation = (text) => Alphanumeric.test(text);
export const AphabeticalsValidation = (text) => Aphabeticals.test(text);
export const capitalizeFirstLetterEachWord = (str) => {
  str = str.split(" ");
  for (var i = 0, x = str.length; i < x; i++) {
    str[i] = str[i][0].toUpperCase() + str[i].substr(1);
  }
  return str.join(" ");
};

export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const number = (value) => {
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(parseFloat(value));
};

export const empty = (value) => {
  const val = value ? value.toString().trim() : value;
  return !val;
};

export const boolean = (value) => {
  if (typeof value === "boolean") {
    return true;
  }
  if (value === true || value === false || value === "true") {
    return true;
  }
  return false;
};

export const min2 = (value) => {
  return !empty(value) && value.length >= 2;
};

export const minOf = (value, min) => {
  return !empty(value) && value.length >= min;
};

export const maxOf = (value, max) => {
  return !empty(value) && value.length <= max;
};

export const name = (value) => {
  const reName = /^[a-zA-Z0-9-_]+$/;
  return value.length >= 2 && value.length <= 30 && reName.test(value);
};
export const nameval = (value) => {
  const reName = /^[A-Za-z.-]+(\s*[A-Za-z.-]+)*$/;
  return value.length >= 2 && value.length <= 30 && reName.test(value);
};

export const email = (value) => {
  const re =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
};

export const numericPhone = (value) => {
  const reNum = /^[0-9]*$/;
  return !empty(value) && value.length === 9 && reNum.test(value);
};

export const phone = (value) => {
  // export const rePhone = /\+(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)\d{1,14}$/;
  const rePhone = /^(\+\d{1,3}[- ]?)?\d{11}$/;
  return !empty(value) && rePhone.test(value);
};

export const password = (value) => {
  // export const re = /^[a-zA-Z0-9!@#$%^&]+$/;
  const re = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#!@$^&*_-]).{8,}$/;
  return !empty(value) && value.length >= 8 && re.test(value);
};

export const countryCode = (value) => {
  // export const re = /^[a-zA-Z0-9!@#$%^&]+$/;
  const re = /^(\+?\d{1,3}|\d{1,4})$/;
  return !empty(value) && re.test(value);
};

export const passwordValidation = (value) => {
  return !empty(value) && value.length >= 8;
};

//   export const date = (value) => {
//     return moment(value).isValid();
//   };

export const url = (str) => {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  if (regexp.test(str)) {
    return true;
  }

  return false;
};

export const ageNum = (value) => {
  return !empty(value) && value <= 99;
};

export const isValidUSZip = (sZip) => {
  const reNum = /^[0-9]*$/;
  return !empty(sZip) && sZip.length === 5 && reNum.test(sZip);
  // return /^\d{5}(-\d{4})?$/.test(sZip);
};

export const isValidCity = (sZip) => {
  const reNum = /^[a-zA-Z ]*$/;
  return !empty(sZip) && reNum.test(sZip);
  // return /^\d{5}(-\d{4})?$/.test(sZip);
};

const Validation = {
  EmailValidation,
  DateFormatValidation,
  AlphanumeicValidation,
  AphabeticalsValidation,
  passwordValidation,
  capitalizeFirstLetterEachWord,
  capitalizeFirstLetter,
  empty,
  boolean,
  min2,
  minOf,
  name,
  number,
  numericPhone,
  email,
  phone,
  // date,
  countryCode,
  password,
  url,
  ageNum,
  maxOf,
  nameval,
  isValidUSZip,
  isValidCity,
};

export default Validation;
