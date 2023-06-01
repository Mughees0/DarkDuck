export type UserInputData = {
  username: string;
  alias?: string;
  email: string;
  password: string;
  countryCode?: string;
  phone?: string;
  age?: string;
  country?: string;
  languages?: string[];
  occupation?: string;
  instruments?: string[];
  research?: string;
  software?: string;
  highEducation?: string;
  zipCode?: string;
  address?: string;
  city?: string;
  termsCondition: boolean;
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
  languages?: string;
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
export type UserResponse = {
  emailUser: {
    languages: [];
    instruments: [];
    _id: string;
    email: string;
    hashedPassword: string;
    __v: 0;
    emailVerified: string;
    otp: number;
  };
};
