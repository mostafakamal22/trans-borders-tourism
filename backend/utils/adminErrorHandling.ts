import { ErrorRequestHandler } from "express";

const adminErrorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  //Wrong Email or Password
  if (err.message === "Wrong Email") {
    return res.status(400).send("Email Or Password Or Both Are NOT Correct!");
  }
  if (err.message === "Wrong Password") {
    return res.status(400).send("Email or Password Or Both Are NOT Correct!");
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

  //If Unknown Error => Pass it to main error handler
  next(err);
};

export default adminErrorHandler;
