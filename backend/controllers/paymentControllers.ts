import { Request, Response } from "express";
import Payment from "../models/paymentsModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Payment
//@route  >>>> GET /api/payments
//@Access >>>> public(For Admins)
const getPayments = async (_req: Request, res: Response) => {
  //Get All Payments Data & Send it Back.
  const payments = await Payment.find();
  res.status(200).json(payments);
};

//@desc   >>>> Create Payment
//@route  >>>> POST /api/payments/
//@Access >>>> public(For Admins)
const createPayment = async (req: Request, res: Response) => {
  //Create New Payment With Request Data & Send Created Payment Back.
  const payment = await Payment.create({
    payment_types: req.body?.paymentTypes,
    total: req.body?.total,
    date: req.body?.paymentDate,
  });
  res.status(201).json(payment);
};

//@desc   >>>> UPDATE Payment
//@route  >>>> PUT /api/payments/:id
//@Access >>>> Public(for Admins)
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
//@route  >>>> DELETE /api/payments/:id
//@Access >>>> public(For Admins)
const deletePayment = async (req: Request, res: Response) => {
  //Get Payment Wanted For Deleting & Send Deleted Payment id Back.
  const deletedPayment = await Payment.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPayment?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedPayment.id });
  }
};

export { getPayments, deletePayment, createPayment, updatePayment };
