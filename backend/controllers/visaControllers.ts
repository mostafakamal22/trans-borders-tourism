import { Request, Response } from "express";
import Visa from "../models/visaModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Visas
//@route  >>>> GET /api/visas
//@Access >>>> public(For Admins)
const getVisas = async (_req: Request, res: Response) => {
  //Get All Visas Data & Send it Back.
  const visas = await Visa.find();
  res.status(200).json(visas);
};

//@desc   >>>> Create Visa
//@route  >>>> POST /api/visas/
//@Access >>>> public(For Admins)
const createVisa = async (req: Request, res: Response) => {
  //Create New Visa With Request Data & Send Created Visa Back.
  const visa = await Visa.create({
    customer_name: req.body?.name,
    passport_id: req.body?.passportId,
    provider: req.body?.provider,
    sponsor: req.body?.sponsor,
    type: req.body?.type,
    employee: req.body?.employee,
    net_fare: req.body?.netFare,
    sales: req.body?.sales,
    profit: req.body?.profit,
    payment_date: req.body?.paymentDate,
    paid_amount: req.body?.paidAmount,
    remaining_amount: req.body?.remainingAmount,
    payment_method: req.body?.paymentMethod,
  });
  res.status(201).json(visa);
};

//@desc   >>>> UPDATE Visa
//@route  >>>> PUT /api/visas/:id
//@Access >>>> Public(for Admins)
const updateVisa = async (req: Request, res: Response) => {
  //Get Visa Wanted For Updating.
  const visa = await Visa.findById(req.params.id);

  //Check if Visa is not exist.
  if (!visa) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Visa With New Values.
    visa.customer_name = req.body?.name;
    visa.passport_id = req.body?.passportId;
    visa.provider = req.body?.provider;
    visa.type = req.body?.type;
    visa.employee = req.body?.employee;
    visa.sponsor = req.body?.sponsor;
    visa.net_fare = req.body?.netFare;
    visa.sales = req.body?.sales;
    visa.profit = req.body?.profit;
    visa.payment_date = req.body?.paymentDate;
    visa.paid_amount = req.body?.paidAmount;
    visa.remaining_amount = req.body?.remainingAmount;
    visa.payment_method = req.body?.paymentMethod;

    //Get Updated Visa info & Send it Back.
    const updatedVisa = await visa.save();
    res.status(200).json(updatedVisa);
  }
};

//@desc   >>>> Delete one Visa
//@route  >>>> DELETE /api/Visaa/:id
//@Access >>>> public(For Admins)
const deleteVisa = async (req: Request, res: Response) => {
  //Get Visa Wanted For Deleting & Send Deleted Visa id Back.
  const deletedVisa = await Visa.findByIdAndDelete(req.params.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedVisa?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedVisa.id });
  }
};

export { getVisas, deleteVisa, createVisa, updateVisa };
