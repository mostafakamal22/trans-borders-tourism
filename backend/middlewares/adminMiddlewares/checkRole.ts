import { NextFunction, Request, Response } from "express";

//check admin role (Owner or admin).
//@UseCase:- when an admin make request, and only owners are allowed to make that request.
export const checkRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //check for invalid user token
  if (!req.admin.role) {
    return res.status(403).send("Not Authorized for users");
  }

  const { role } = req.admin;
  //owners only allowed to continue...
  if (role === "owner") return next();
  //admins are not allowed
  return res.status(401).send("Not Authorized owner only");
};
