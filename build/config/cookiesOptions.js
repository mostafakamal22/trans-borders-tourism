"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookiesProClearOptions = exports.cookiesProOptions = exports.cookiesDevClearOptions = exports.cookiesDevOptions = void 0;
//Define Cookies Options
// *** Dev Options *** //
//For Sending Cookies
var cookiesDevOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
};
exports.cookiesDevOptions = cookiesDevOptions;
//For Clearing Cookies
var cookiesDevClearOptions = {
    httpOnly: true,
    sameSite: "none",
    secure: true,
};
exports.cookiesDevClearOptions = cookiesDevClearOptions;
// *** Production Options *** //
//For Sending Cookies
var cookiesProOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
};
exports.cookiesProOptions = cookiesProOptions;
//For Clearing Cookies
var cookiesProClearOptions = {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
};
exports.cookiesProClearOptions = cookiesProClearOptions;
