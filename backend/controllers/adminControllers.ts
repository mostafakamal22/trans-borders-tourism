import Admin from "../models/adminModel";
import bcrypt from "bcryptjs";
import { generateAdminsToken } from "../helpers/generateAdminsToken";
import { Request, Response } from "express";
import {
  cookiesDevClearOptions,
  cookiesDevOptions,
  cookiesProClearOptions,
  cookiesProOptions,
} from "../config/cookiesOptions";
import jwt from "jsonwebtoken";
import { RefreshJwtPayload } from "../middlewares/adminMiddlewares/authAdminProtect";

export interface ErrnoException extends Error {
  path?: string;
}

//@Desc   >>>> Get Admins Info
//@Route  >>>> GET /api/admins/:id
//@Access >>>> Private(Admin)
const getOneAdmin = async (req: Request, res: Response) => {
  //Get Admin With The id We Get From request Params.
  const admin = await Admin.findById(req.params?.id);

  if (admin) {
    res.status(200).json({
      name: admin.admin_name,
      email: admin.email,
    });
  }
};

//@Desc   >>>> Admins Login
//@Route  >>>> GET /api/admins/login
//@Access >>>> Private(Admins)
const adminLogin = async (req: Request, res: Response) => {
  const cookies = req.cookies;

  //Get Admin info needed For Login.
  const { email, password } = req.body;

  //Check If the password is Not Presenetd in the body Object.
  if (!password) {
    throw new Error("Please provide the password!");
  }

  //Get Admin By the Email.
  const admin = await Admin.findOne({ email }).exec();

  //Check The Admin With That Email is Actualy Existed.
  if (!admin) {
    throw new Error("Wrong Email");
  }

  //Check For password
  const isCorrectPassword = await bcrypt.compare(password, admin.password);

  //If the password is Correct
  if (isCorrectPassword) {
    //Generate Access And Refresh Tokens
    const { id, role } = admin;
    const { accessToken, refreshToken: newRefreshToken } = generateAdminsToken(
      id,
      role
    );

    let newRefreshTokenArray = !cookies?.jwt
      ? admin.refreshToken
      : admin.refreshToken.filter((rt: string) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      /* 
            Scenario added here: 
                1) Admin logs in but never uses RT and does not logout 
                2) RT is stolen
                3) If 1 & 2, reuse detection is needed to clear all RTs when Admin logs in
            */
      const refreshToken = cookies.jwt;
      const foundToken = await Admin.findOne({ refreshToken }).exec();

      // Detected refresh token reuse!
      if (!foundToken) {
        // clear out ALL previous refresh tokens
        newRefreshTokenArray = [];
      }

      res.clearCookie(
        "jwt",
        process.env.NODE_ENV === "production"
          ? cookiesProClearOptions
          : cookiesDevClearOptions
      );
    }

    // Saving refreshToken with current Admin
    admin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    await admin.save();

    // Creates Secure Cookie with refresh token
    res.cookie(
      "jwt",
      newRefreshToken,
      process.env.NODE_ENV === "production"
        ? cookiesProOptions
        : cookiesDevOptions
    );

    //Send Admin's Access Token.
    res.status(200).json({ accessToken });
  } else {
    //Else The password is Wrong Password.
    throw new Error("Wrong Password");
  }
};

//@Desc   >>>> Create New Admins' (Access + Refresh) Tokens When Access Token Expires.
//@Route  >>>> Get /api/admins/refresh
//@Access >>>> Privete(Admins)
const adminRefreshToken = async (req: Request, res: Response) => {
  //Get Cookies From Req
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  // res.clearCookie(
  //   "jwt",
  //   process.env.NODE_ENV === "production"
  //     ? cookiesProClearOptions
  //     : cookiesDevClearOptions
  // );

  //Check Detected refresh token reuse!
  const admin = await Admin.findOne({ refreshToken }).exec();

  if (!admin) {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshJwtPayload;

    const hackedAdmin = await Admin.findById(decoded?.id);

    if (hackedAdmin) {
      hackedAdmin.refreshToken = [];
      await hackedAdmin.save();
      return res.sendStatus(403); //Forbidden
    }
  } else {
    // const newRefreshTokenArray = admin?.refreshToken.filter(
    //   (rt: string) => rt !== refreshToken
    // );

    // evaluate jwt
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as RefreshJwtPayload;

    if (!decoded) {
      // admin.refreshToken = [...newRefreshTokenArray];
      // await admin.save();
      return res.sendStatus(401);
    }

    if (admin.id !== decoded?.id) return res.sendStatus(403);

    // Refresh token was still valid
    const { role, id } = admin;
    const { accessToken } = generateAdminsToken(id, role);

    // Saving refreshToken with current Admin
    // admin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    // await admin.save();

    // Creates Secure Cookie with refresh token
    // res.cookie(
    //   "jwt",
    //   newRefreshToken,
    //   process.env.NODE_ENV === "production"
    //     ? cookiesProOptions
    //     : cookiesDevOptions
    // );

    res.json({ accessToken });
  }
};

//@Desc   >>>> Create admin
//@Route  >>>> POST /api/admins/
//@Access >>>> Privete(Owner Only)
const createAdmin = async (_req: Request, res: Response) => {
  //For Testing Purpose Only
  if (true) {
    return res.sendStatus(204);
  }
  // //First Hash The password from the request body.
  // const hashedPassword = await bcrypt.hash(req.body?.password, 10);

  // //Then Create Admin Doc With Request Data
  // const admin = await Admin.create({
  //   admin_name: req.body.name,
  //   email: req.body.email,
  //   password: hashedPassword,
  //   role: req.body.role,
  // });

  // //send Back Created Admin Data
  // res.status(201).json({
  //   id: admin.id,
  //   admin_name: admin.admin_name,
  //   email: admin.email,
  //   role: admin.role,
  // });
};

//@Desc   >>>> UPDATE Admin
//@Route  >>>> PUT /api/admins/:id
//@Access >>>> Private(All Admins for their accounts)
const updateAdmin = async (req: Request, res: Response) => {
  //First Hash The password from the request body.
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  //Get Admin Wanted For Updating
  const admin = await Admin.findById(req.params.id);

  //Check if Admin is not exist.
  if (!admin) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Admin with new values
    admin.email = req.body.email;
    admin.markModified("email");
    admin.password = hashedPassword;

    //Get Updated Admin info & send it back
    const updatedAdmin = await admin.save();
    res.status(200).json({
      name: updatedAdmin.admin_name,
      email: updatedAdmin.email,
    });
  }
};

//@Desc   >>>> Admins' Logout
//@Route  >>>> GET /api/admins/logout
//@Access >>>> Private(Admins)
const AdminLogout = async (req: Request, res: Response) => {
  //Get Refresh Token From Cookies => If Not exist .. Okay It's Already Logged out.
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); //No content

  const refreshToken = cookies.jwt;

  // Is refreshToken in db?
  const admin = await Admin.findOne({ refreshToken }).exec();

  if (!admin) {
    res.clearCookie(
      "jwt",
      process.env.NODE_ENV === "production"
        ? cookiesProClearOptions
        : cookiesDevClearOptions
    );
    return res.sendStatus(204);
  }

  // Delete refreshToken in db
  admin.refreshToken = admin.refreshToken.filter(
    (rt: string) => rt !== refreshToken
  );
  await admin.save();

  res.clearCookie(
    "jwt",
    process.env.NODE_ENV === "production"
      ? cookiesProClearOptions
      : cookiesDevClearOptions
  );
  res.sendStatus(204);
};

export {
  updateAdmin,
  createAdmin,
  getOneAdmin,
  adminLogin,
  adminRefreshToken,
  AdminLogout,
};
