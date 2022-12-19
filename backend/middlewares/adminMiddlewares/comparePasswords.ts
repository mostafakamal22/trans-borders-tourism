import { NextFunction, Request, Response } from "express";

//check password === repeated password
//@useCase:- when admin updating his info
export const comparePassword = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { password, repeatedPassword } = req.body;

  if (password !== repeatedPassword) {
    throw new Error("Password and Repeated Password Do NOT match");
  } else {
    next();
  }
};
