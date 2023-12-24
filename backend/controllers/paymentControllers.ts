import { Request, Response } from "express";
import Payment from "../models/paymentModel";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All Payments That Match Query Object.
//@Route  >>>> POST /api/payments/query
//@Access >>>> Private(Admins Only)
const getPayments = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const method = query?.method ? query.method : "";
  const type = query?.type ? query.type : "";

  //Prepare Queries for Mongoose Query.
  const queries = query
    ? {
        //Filter By Year, Month And Day.
        $expr: {
          $setEquals: [
            [
              query?.year && {
                $year: "$date",
              },
              query?.month && {
                $month: "$date",
              },
              query?.day && {
                $dayOfMonth: "$date",
              },
            ],

            [
              query?.year && query?.year,
              query?.month && query?.month,
              query?.day && query?.day,
            ],
          ],
        },

        //Filter By Payment Type.
        "payment_types.name": new RegExp(`${type}`, "gi"),

        // //Filter By Payment Method.
        "payment_types.method": new RegExp(`${method}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Payments Data That Match Query & Send it Back.
  const payments = await Payment.paginate(queries, options);
  res.status(200).json(payments);
};

//@Desc   >>>> GET ONE Payment
//@Route  >>>> GET /api/payments/:id
//@Access >>>> Private(Admins Only)
const getOnePayment = async (req: Request, res: Response) => {
  const payment = await Payment.findById(req.params?.id);

  //Check if Payment is not exist.
  if (!payment) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Send Payment.
    res.status(200).json(payment);
  }
};

//@Desc   >>>> Create Payment
//@Route  >>>> POST /api/payments
//@Access >>>> Private(Admins Only)
const createPayment = async (req: Request, res: Response) => {
  //Create New Payment With Request Data & Send Created Payment Back.
  const payment = await Payment.create({
    payment_types: req.body?.paymentTypes,
    total: req.body?.total,
    date: req.body?.paymentDate,
  });
  res.status(201).json(payment);
};

//@Desc   >>>> UPDATE Payment
//@Route  >>>> PUT /api/payments/:id
//@Access >>>> Private(Admins Only)
const updatePayment = async (req: Request, res: Response) => {
  //Get Payment Wanted For Updating.
  const payment = await Payment.findById(req.params?.id);

  //Check if Payment is not exist.
  if (!payment) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Payment With New Values.
    payment.total = req.body?.total;
    payment.payment_types = req.body?.paymentTypes;
    payment.date = req.body?.paymentDate;

    //Get Updated Payment info & Send it Back.
    const updatedPayment = await payment.save();
    res.status(200).json(updatedPayment);
  }
};

//@desc   >>>> Delete one Payment
//@Route  >>>> DELETE /api/payments/:id
//@Access >>>> public(For Admins)
const deletePayment = async (req: Request, res: Response) => {
  //Get Payment Wanted For Deleting.
  const deletedPayment = await Payment.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPayment?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Payment id Back
    res.status(200).json({ id: deletedPayment.id });
  }
};

export {
  getPayments,
  getOnePayment,
  deletePayment,
  createPayment,
  updatePayment,
};
