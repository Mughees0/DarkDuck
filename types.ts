export type UserInputData = {
  username: string;
  alias?: string;
  email: string;
  password: string;
  countryCode?: string;
  phone?: string;
  age?: string;
  country?: string;
  language?: string;
  occupation?: string;
  instruments?: string;
  research?: string;
  software?: string;
  highEducation?: string;
  zipCode?: string;
  address?: string;
  city?: string;
  createdAt?: Date | number;
  updatedAt?: Date | number;
  termsCondition: boolean;
};

export type StorageRes = {
  success: string;
};

export type UserInputErrors = {
  username?: string;
  alias?: string;
  email?: string;
  password?: string;
  countryCode?: string;
  phone?: string;
  age?: string;
  country?: string;
  language?: string;
  occupation?: string;
  instruments?: string;
  research?: string;
  software?: string;
  highEducation?: string;
  zipCode?: string;
  address?: string;
  city?: string;
  termsCondition?: string | boolean;
};

export type HTMLElementEvent<T extends HTMLElement> = Event & {
  target?: T;
};

export type restCountriesApi = [
  {
    name: {
      common: string;
      official: string;
    };
    idd: {
      root: string;
      suffixes: string[];
    };
    languages: {};
  }
];

export type CountryData = {
  name: string;
  code: string;
  dial_code: string;
};

export type CountryApi = {
  error: boolean;
  msg: string;
  data: CountryData[];
};

export type UserResponse = {
  emailUser: {
    language: string;
    instruments: [];
    _id: string;
    email: string;
    hashedPassword: string;
    __v: 0;
    emailVerified: string;
    otp: number;
  };
};
export type PostsResponse = [
  {
    comments: string[];
    _id: string;
    userId: UserDataResponse;
    audio: string;
    recordModeSwingId: string;
    audience: string;
    data: string[];
    text: string;
    updatedAt: string;
    createdAt: string;
    __v: string;
    likes: string[];
  }
];
export type UserDataResponse = {
  username: string;
  alias?: string;
  email: string;
  password: string;
  countryCode?: string;
  phone?: string;
  age?: string;
  country?: string;
  language?: string;
  occupation?: string;
  instruments?: string[];
  research?: string;
  software?: string;
  highEducation?: string;
  zipCode?: string;
  address?: string;
  city?: string;
  termsCondition: boolean;
  profilePicture?: string;
  bannerPicture?: string;
  createdAt?: string;
};
