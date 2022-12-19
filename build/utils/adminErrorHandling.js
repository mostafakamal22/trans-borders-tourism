"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (err, _req, res, next) {
    //Wrong Email or Password
    if (err.message === "Wrong Email" || err.message === "Wrong Password") {
        return res.status(400).send(err.message);
    }
    //Weak Passwords Validation
    if (err.message === "Please provide a strong password!") {
        return res.status(400).send(err.message);
    }
    //Wrong Password Compartions
    if (err.message === "Wrong old password") {
        return res.status(400).send(err.message);
    }
    //Password === repeatedPassword
    if (err.message === "Password and Repeated Password Do NOT match") {
        return res.status(400).send(err.message);
    }
    //Empty Password Requests For login
    if (err.message === "Please provide the password!") {
        return res.status(400).send(err.message);
    }
    //Admins Requests With (NO Tokens OR Invalid Tokens)
    if (err.message === "Not Authorized without token" ||
        err.message === "Not Authorized with invalid token") {
        return res.status(401).send(err.message);
    }
    //If Unknown Error => Pass it to main error handler
    next(err);
});
