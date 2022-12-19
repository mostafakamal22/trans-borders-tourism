import { Request, Response } from "express";
import Bank from "../models/bankModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Bank
//@route  >>>> GET /api/banks
//@Access >>>> public(For Admins)
const getBanks = async (_req: Request, res: Response) => {
  //Get All Banks Data and Send it Back.
  const banks = await Bank.find();
  res.status(200).json(banks);
};

//@desc   >>>> Create Bank
//@route  >>>> POST /api/banks/
//@Access >>>> public(For Admins)
const createBank = async (req: Request, res: Response) => {
  //create Bank Doc With Request Data
  const bank = await Bank.create({
    customer_name: req.body?.name,
    account_id: req.body?.accountId,
    process_no: req.body?.processNo,
    total: req.body?.total,
    type: req.body?.type,
    payment_date: req.body?.paymentDate,
  });
  res.status(201).json(bank);
};

//@desc   >>>> UPDATE Bank
//@route  >>>> PUT /api/banks/:id
//@Access >>>> Public(for Admins)
const updateBank = async (req: Request, res: Response) => {
  //Get Bank Wanted For Updating.
  const bank = await Bank.findById(req.params?.id);

  //Check if Bank is not exist.
  if (!bank) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Bank with new values
    bank.customer_name = req.body?.name;
    bank.account_id = req.body?.accountId;
    bank.process_no = req.body?.processNo;
    bank.total = req.body?.total;
    bank.type = req.body?.type;
    bank.payment_date = req.body?.paymentDate;

    //Get Updated Bank info & Send it back.
    const updatedBank = await bank.save();
    res.status(200).json(updatedBank);
  }
};

//@desc   >>>> Delete one Bank
//@route  >>>> DELETE /api/bank/:id
//@Access >>>> public(For Admins)
const deleteBank = async (req: Request, res: Response) => {
  //Get Bank Wanted For Deleting & Send Deleted Bank id Back.
  const deletedBank = await Bank.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedBank?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedBank?.id });
  }
};

export { getBanks, deleteBank, createBank, updateBank };
