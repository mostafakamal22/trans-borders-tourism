import PaymentVoucher from "../models/paymentVoucherModel";
import { Request, Response } from "express";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All PaymentVouchers That Match Query Object.
//@Route  >>>> POST /api/paymentVouchers/query
//@Access >>>> Private(Admins Only)
const getPaymentVouchers = async (req: Request, res: Response) => {
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

        //Filter By PaymentVoucher Customer Name.
        customer_name: new RegExp(`${customerName}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: {
      createdAt: "desc",
    },
    ...option,
  };

  //Get All PaymentVouchers Data That Match Query & Send it Back.
  const paymentVouchers = await PaymentVoucher.paginate(queries, options);

  res.status(200).json(paymentVouchers);
};

//@Desc   >>>> GET ONE PaymentVoucher
//@Route  >>>> GET /api/paymentVouchers/:id
//@Access >>>> Private(Admins Only)
const getOnePaymentVoucher = async (req: Request, res: Response) => {
  const paymentVoucher = await PaymentVoucher.findById(req.params?.id);

  //Check if PaymentVoucher is not exist.
  if (!paymentVoucher) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Send PaymentVoucher.
    res.status(200).json(paymentVoucher);
  }
};

//@Desc   >>>> Create PaymentVoucher
//@Route  >>>> POST /api/paymentVouchers/
//@Access >>>> private(For Admins)
const createPaymentVoucher = async (req: Request, res: Response) => {
  //Create New PaymentVoucher With Request Data & Send Created PaymentVoucher Back.

  const paymentVoucher = await PaymentVoucher.create({
    customer_name: req.body?.customer_name,
    bank: req.body?.bank,
    reference_number: req.body?.reference_number,
    being: req.body?.being,
    amount: req.body?.amount,
    payment_date: req.body?.payment_date,
  });
  res.status(201).json(paymentVoucher);
};

//@Desc   >>>> UPDATE PaymentVoucher
//@Route  >>>> PUT /api/paymentVouchers/:id
//@Access >>>> Private(for Admins)
const updatePaymentVoucher = async (req: Request, res: Response) => {
  //Get PaymentVoucher Wanted For Updating.
  const paymentVoucher = await PaymentVoucher.findById(req.params.id);

  //Check if PaymentVoucher is not exist.
  if (!paymentVoucher) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update PaymentVoucher With New Values.
    paymentVoucher.customer_name = req.body?.customer_name;
    paymentVoucher.bank = req.body?.bank;
    paymentVoucher.reference_number = req.body?.reference_number;
    paymentVoucher.being = req.body?.being;
    paymentVoucher.amount = req.body?.amount;
    paymentVoucher.payment_date = req.body?.payment_date;

    //Get Updated PaymentVoucher info & Send it Back.
    const updatedPaymentVoucher = await paymentVoucher.save();
    res.status(200).json(updatedPaymentVoucher);
  }
};

//@Desc   >>>> Delete one PaymentVoucher
//@Route  >>>> DELETE /api/paymentVouchers/:id
//@Access >>>> private(For Admins)
const deletePaymentVoucher = async (req: Request, res: Response) => {
  //Get PaymentVoucher Wanted For Deleting.
  const deletedPaymentVoucher = await PaymentVoucher.findByIdAndDelete(
    req.params.id
  );

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPaymentVoucher?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted PaymentVoucher id Back
    res.status(200).json({ id: deletedPaymentVoucher.id });
  }
};

//@Desc   >>>> Get PaymentVouchers Statistics.
//@Route  >>>> GET /api/paymentVouchers/statistics
//@Access >>>> Private(Admins Only)
// const getPaymentVouchersStatistics = async (_req: Request, res: Response) => {
//   // Try to get statistics from cache
//   const cachedStatistics = cache.get("paymentVouchers-statistics");

//   if (cachedStatistics) {
//     // If statistics are cached, return them
//     res.status(200).json(cachedStatistics);
//   } else {
//     // If not cached, fetch paymentVouchers data from the database
//     const paymentVouchers = await PaymentVoucher.find({});

//     // Perform calculations on paymentVouchers data
//     const statistics = paymentVouchersChartsCalculations(paymentVouchers);

//     // Cache the statistics with an expiration time (e.g., one day)
//     cache.set("paymentVouchers-statistics", statistics, 86400); // 86400 seconds = 1 day

//     // Send the response with the calculated statistics
//     res.status(200).json(statistics);
//   }
// };

export {
  getPaymentVouchers,
  getOnePaymentVoucher,
  deletePaymentVoucher,
  createPaymentVoucher,
  updatePaymentVoucher,
  //   getPaymentVouchersStatistics,
};
