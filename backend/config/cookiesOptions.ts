import { CookieOptions } from "express";

//Define Cookies Options

// *** Dev Options *** //

//For Sending Cookies
const cookiesDevOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

//For Clearing Cookies
const cookiesDevClearOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
};

// *** Production Options *** //

//For Sending Cookies
const cookiesProOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

//For Clearing Cookies
const cookiesProClearOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "strict",
  secure: true,
};

export {
  cookiesDevOptions,
  cookiesDevClearOptions,
  cookiesProOptions,
  cookiesProClearOptions,
};
