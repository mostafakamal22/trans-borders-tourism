import Admin from "../models/adminModel";
import bcrypt from "bcryptjs";
import { generateAdminsToken } from "../helpers/generateAdminsToken";
import { Request, Response } from "express";

export interface ErrnoException extends Error {
  path?: string;
}

//@desc   >>>> Get one admin
//@route  >>>> GET /api/admin/:id
//@Access >>>> Public(admins)
const getOneAdmin = async (req: Request, res: Response) => {
  //Get Admin With The id We Get From request Params.
  const admin = await Admin.findById(req.params?.id);

  if (admin) {
    res.status(200).json({
      id: admin.id,
      name: admin.admin_name,
      email: admin.email,
      role: admin.role,
      token: generateAdminsToken(admin.id, admin.email, admin.role),
    });
  }
};

//@desc   >>>> admin login
//@route  >>>> GET /api/admins/login
//@Access >>>> Public(admins)
const adminLogin = async (req: Request, res: Response) => {
  //Get Admin info needed For Login.
  const { email, password } = req.body;

  //Check If the password is Not Presenetd in the body Object.
  if (!password) {
    throw new Error("Please provide the password!");
  }

  //Get Admin By the Email.
  const admin = await Admin.findOne({ email });

  //Check The Admin With That Email is Actualy Existed.
  if (!admin) {
    throw new Error("Wrong Email");
  }

  //Check For password
  const isCorrectPassword = await bcrypt.compare(password, admin.password);
  //If the password is Correct => Send Admin Infos Back.
  if (isCorrectPassword) {
    res.status(200).json({
      id: admin.id,
      name: admin.admin_name,
      email: admin.email,
      role: admin.role,
      token: generateAdminsToken(admin.id, admin.email, admin.role),
    });
  } else {
    //Else The password is Wrong Password.
    throw new Error("Wrong Password");
  }
};

//@desc   >>>> Create admin
//@route  >>>> POST /api/admins/
//@Access >>>> privete(Owner Only)
const createAdmin = async (req: Request, res: Response) => {
  //First Hash The password from the request body.
  const hashedPassword = await bcrypt.hash(req.body?.password, 10);

  //Then Create Admin Doc With Request Data
  const admin = await Admin.create({
    admin_name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
  });

  //send Back Created Admin Data
  res.status(201).json({
    id: admin.id,
    admin_name: admin.admin_name,
    email: admin.email,
    role: admin.role,
  });
};

//@desc   >>>> UPDATE Admin
//@route  >>>> PUT /api/admins/:id
//@Access >>>> private(all Admin for their accounts)
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
      id: updatedAdmin.id,
      name: updatedAdmin.admin_name,
      email: updatedAdmin.email,
      role: updatedAdmin.role,
      token: generateAdminsToken(admin.id, admin.email, admin.role),
    });
  }
};

export { updateAdmin, createAdmin, getOneAdmin, adminLogin };
