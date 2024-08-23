import ReceiptVoucher from "../models/receiptVoucherModel";
import { Request, Response } from "express";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All ReceiptVouchers That Match Query Object.
//@Route  >>>> POST /api/receiptVouchers/query
//@Access >>>> Private(Admins Only)
const getReceiptVouchers = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const customerName = query?.customerName ? query.customerName : "";

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

        //Filter By ReceiptVoucher Customer Name.
        customer_name: new RegExp(`${customerName}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All ReceiptVouchers Data That Match Query & Send it Back.
  const receiptVouchers = await ReceiptVoucher.paginate(queries, options);
  res.status(200).json(receiptVouchers);
};

//@Desc   >>>> GET ONE ReceiptVoucher
//@Route  >>>> GET /api/receiptVouchers/:id
//@Access >>>> Private(Admins Only)
const getOneReceiptVoucher = async (req: Request, res: Response) => {
  const receiptVoucher = await ReceiptVoucher.findById(req.params?.id);

  //Check if ReceiptVoucher is not exist.
  if (!receiptVoucher) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Send ReceiptVoucher.
    res.status(200).json(receiptVoucher);
  }
};

//@Desc   >>>> Create ReceiptVoucher
//@Route  >>>> POST /api/receiptVouchers/
//@Access >>>> private(For Admins)
const createReceiptVoucher = async (req: Request, res: Response) => {
  //Create New ReceiptVoucher With Request Data & Send Created ReceiptVoucher Back.
  const receiptVoucher = await ReceiptVoucher.create({
    customer_name: req.body?.name,
    bank: req.body?.bank,
    no: req.body?.no,
    being: req.body?.being,
    amount: req.body?.amount,
    payment_date: req.body?.paymentDate,
  });
  res.status(201).json(receiptVoucher);
};

//@Desc   >>>> UPDATE ReceiptVoucher
//@Route  >>>> PUT /api/receiptVouchers/:id
//@Access >>>> Private(for Admins)
const updateReceiptVoucher = async (req: Request, res: Response) => {
  //Get ReceiptVoucher Wanted For Updating.
  const receiptVoucher = await ReceiptVoucher.findById(req.params.id);

  //Check if ReceiptVoucher is not exist.
  if (!receiptVoucher) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update ReceiptVoucher With New Values.
    receiptVoucher.customer_name = req.body?.name;
    receiptVoucher.bank = req.body?.bank;
    receiptVoucher.no = req.body?.no;
    receiptVoucher.being = req.body?.being;
    receiptVoucher.amount = req.body?.amount;
    receiptVoucher.payment_date = req.body?.paymentDate;

    //Get Updated ReceiptVoucher info & Send it Back.
    const updatedReceiptVoucher = await receiptVoucher.save();
    res.status(200).json(updatedReceiptVoucher);
  }
};

//@Desc   >>>> Delete one ReceiptVoucher
//@Route  >>>> DELETE /api/receiptVouchers/:id
//@Access >>>> private(For Admins)
const deleteReceiptVoucher = async (req: Request, res: Response) => {
  //Get ReceiptVoucher Wanted For Deleting.
  const deletedReceiptVoucher = await ReceiptVoucher.findByIdAndDelete(
    req.params.id
  );

  //Check If the Document is Already Deleted Or Not.
  if (!deletedReceiptVoucher?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted ReceiptVoucher id Back
    res.status(200).json({ id: deletedReceiptVoucher.id });
  }
};

//@Desc   >>>> Get ReceiptVouchers Statistics.
//@Route  >>>> GET /api/receiptVouchers/statistics
//@Access >>>> Private(Admins Only)
// const getReceiptVouchersStatistics = async (_req: Request, res: Response) => {
//   // Try to get statistics from cache
//   const cachedStatistics = cache.get("receiptVouchers-statistics");

//   if (cachedStatistics) {
//     // If statistics are cached, return them
//     res.status(200).json(cachedStatistics);
//   } else {
//     // If not cached, fetch receiptVouchers data from the database
//     const receiptVouchers = await ReceiptVoucher.find({});

//     // Perform calculations on receiptVouchers data
//     const statistics = receiptVouchersChartsCalculations(receiptVouchers);

//     // Cache the statistics with an expiration time (e.g., one day)
//     cache.set("receiptVouchers-statistics", statistics, 86400); // 86400 seconds = 1 day

//     // Send the response with the calculated statistics
//     res.status(200).json(statistics);
//   }
// };

export {
  getReceiptVouchers,
  getOneReceiptVoucher,
  deleteReceiptVoucher,
  createReceiptVoucher,
  updateReceiptVoucher,
  //   getReceiptVouchersStatistics,
};
