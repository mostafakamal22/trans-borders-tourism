import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import Admin from "../../models/adminModel";

interface JwtPayload {
  id: string;
}

//Check Admins Authentication
export const authAdminProtect = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (
    req?.headers?.authorization &&
    req?.headers?.authorization.trim().startsWith("Bearer")
  ) {
    //Get Token from header
    const token = req.headers.authorization.split(" ")[1];

    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    //Get Admin from Token
    const admin = await Admin.findById(decoded?.id);

    //IF There is no Admin With that token Id => Invalid Token
    if (!admin) {
      throw new Error("Not Authorized with invalid token");
    }

    //Everything is OK, Pass Admin Object to next middleware
    req.admin = admin;
    next();
  } else {
    //IF No Token Provided With The Request
    throw new Error("Not Authorized without token");
  }
};
