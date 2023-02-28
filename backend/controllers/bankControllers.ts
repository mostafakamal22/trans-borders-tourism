import { Request, Response } from "express";
import Bank from "../models/bankModel";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All Banks That Match Query Object.
//@Route  >>>> POST /api/banks/query
//@Access >>>> Private(Admins Only)
const getBanks = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const type = query?.type ? query.type : "";

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

        //Filter By Bank Type.
        type: new RegExp(`${type}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Banks Data That Match Query & Send it Back.
  const banks = await Bank.paginate(queries, options);
  res.status(200).json(banks);
};

//@Desc   >>>> Create Bank
//@Route  >>>> POST /api/banks/
//@Access >>>> Private(Admins Only)
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

//@Desc   >>>> UPDATE Bank
//@Route  >>>> PUT /api/banks/:id
//@Access >>>> Private(Admins Only)
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

//@Desc   >>>> Delete one Bank
//@Route  >>>> DELETE /api/bank/:id
//@Access >>>> Private(Admins Only)
const deleteBank = async (req: Request, res: Response) => {
  //Get Bank Wanted For Deleting.
  const deletedBank = await Bank.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedBank?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Bank id Back
    res.status(200).json({ id: deletedBank?.id });
  }
};

export { getBanks, deleteBank, createBank, updateBank };
