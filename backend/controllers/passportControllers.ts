import { Request, Response } from "express";
import Passport from "../models/passportModel";
import { ErrnoException } from "./adminControllers";
import { passportsChartsCalculations } from "../calculations/passports";

//@Desc   >>>> Get All Passports That Match Query Object.
//@Route  >>>> POST /api/passports/query
//@Access >>>> Private(Admins Only)
const getPassports = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  //Prepare Queries for Mongoose Query.
  const queries = query
    ? {
        //Filter By Year, Month And Day.
        $expr: {
          $setEquals: [
            [
              query?.year && {
                $year: "$payment_date",
              },
              query?.month && {
                $month: "$payment_date",
              },
              query?.day && {
                $dayOfMonth: "$payment_date",
              },
            ],

            [
              query?.year && query?.year,
              query?.month && query?.month,
              query?.day && query?.day,
            ],
          ],
        },
        //Filter By Customer Nationality.
        customer_nationality: new RegExp(`${query?.nationality}`, "gi"),

        //Filter By Passport State.
        state: new RegExp(`${query?.state.join("|")}`),

        //Filter By Passport Service.
        service: new RegExp(`${query?.service.join("|")}`),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Passports Data That Match Query & Send it Back.
  const passports = await Passport.paginate(queries, options);
  res.status(200).json(passports);
};

//@Desc   >>>> GET ONE Passport
//@Route  >>>> GET /api/passports/:id
//@Access >>>> Private(Admins Only)
const getOnePassport = async (req: Request, res: Response) => {
  const passport = await Passport.findById(req.params?.id);

  //Check if Passport is not exist.
  if (!passport) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Send Passport.
    res.status(200).json(passport);
  }
};

//@Desc   >>>> Create Passport
//@Route  >>>> POST /api/passports
//@Access >>>> Private(Admins Only)
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

//@Desc   >>>> UPDATE Passport
//@Route  >>>> PUT /api/passports/:id
//@Access >>>> Private(Admins Only)
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

//@Desc   >>>> Delete one Passport
//@Route  >>>> DELETE /api/passports/:id
//@Access >>>> Private(Admins Only)
const deletePassport = async (req: Request, res: Response) => {
  //Get Passport Wanted For Deleting.
  const deletedPassport = await Passport.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPassport?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Passport id Back.
    res.status(200).json({ id: deletedPassport.id });
  }
};

//@Desc   >>>> Get Passports Statistcis.
//@Route  >>>> GET /api/passports/statistics
//@Access >>>> Private(Admins Only)
const getPassportsStatistics = async (_req: Request, res: Response) => {
  //Get All Passports Data.
  const passports = await Passport.find({});

  const statistics = passportsChartsCalculations(passports);

  res.status(200).json(statistics);
};

export {
  getPassports,
  getOnePassport,
  createPassport,
  updatePassport,
  deletePassport,
  getPassportsStatistics,
};
