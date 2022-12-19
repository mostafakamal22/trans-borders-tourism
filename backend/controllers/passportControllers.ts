import { Request, Response } from "express";
import Passport from "../models/passportModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Passports
//@route  >>>> GET /api/passports
//@Access >>>> public(For Admins)
const getPassports = async (_req: Request, res: Response) => {
  //Get All Passports Data & Send it Back.
  const passports = await Passport.find();
  res.status(200).json(passports);
};

//@desc   >>>> Create Passport
//@route  >>>> POST /api/passports
//@Access >>>> public(For Admins)
const createPassport = async (req: Request, res: Response) => {
  //Create New Passport With Request Data & Send Created Passport Back.
  const passport = await Passport.create({
    customer_name: req.body?.name,
    customer_nationality: req.body?.nationality,
    passport_id: req.body?.passportId,
    state: req.body?.state,
    service: req.body?.service,
    service_price: req.body?.servicePrice,
    taxable: req.body?.taxable,
    tax_rate: req.body?.taxRate,
    total: req.body?.total,
    sales: req.body?.sales,
    profit: req.body?.profit,
    payment_date: req.body?.paymentDate,
  });
  res.status(201).json(passport);
};

//@desc   >>>> UPDATE Passport
//@route  >>>> PUT /api/passports/:id
//@Access >>>> Public(for Admins)
const updatePassport = async (req: Request, res: Response) => {
  //Get Passport Wanted For Updating.
  const passport = await Passport.findById(req.params?.id);

  //Check if Passport is not exist.
  if (!passport) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Passport With New Values.
    passport.customer_name = req.body?.name;
    passport.customer_nationality = req.body?.nationality;
    passport.passport_id = req.body?.passportId;
    passport.state = req.body?.state;
    passport.service = req.body?.service;
    passport.payment_date = req.body?.paymentDate;
    passport.taxable = req.body?.taxable;
    passport.tax_rate = req.body?.taxRate;
    passport.service_price = req.body?.servicePrice;
    passport.total = req.body?.total;
    passport.sales = req.body?.sales;
    passport.profit = req.body?.profit;

    //Get Updated Passport info & Send it Back.
    const updatedPassport = await passport.save();
    res.status(200).json(updatedPassport);
  }
};

//@desc   >>>> Delete one Passport
//@route  >>>> DELETE /api/passports/:id
//@Access >>>> public(For Admins)
const deletePassport = async (req: Request, res: Response) => {
  //Get Passport Wanted For Deleting & Send Deleted Passport id Back.
  const deletedPassport = await Passport.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPassport?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedPassport.id });
  }
};

export { updatePassport, createPassport, deletePassport, getPassports };
