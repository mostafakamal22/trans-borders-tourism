import Bill from "../models/billModel";
import Passport from "../models/passportModel";
import Ticket from "../models/ticketModel";
import cache from "../lib/node-cache";
import { ErrnoException } from "./adminControllers";
import { billsChartsCalculations } from "../calculations/bills";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

//@Desc   >>>> Get All Bills That Match Query Object.
//@Route  >>>> POST /api/bills/query
//@Access >>>> Private(Admins Only)
const getBills = async (req: Request, res: Response) => {
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
        //Filter By Customer Name.
        "customer.name": new RegExp(`${query?.name}`, "gi"),

        //Filter By Detail type.
        "details.type": new RegExp(`${query?.type}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { createdAt: "desc" },
    ...option,
  };

  //Get All Bills Data That Match Query & Send it Back.
  const bills = await Bill.paginate(queries, options);

  res.status(200).json(bills);
};

//@Desc   >>>> GET ONE Bill
//@Route  >>>> GET /api/bills/:id
//@Access >>>> Private(Admins Only)
const getOneBill = async (req: Request, res: Response) => {
  const id = req.params?.id;

  let bill;

  // Validate if the id is a valid ObjectId before calling findById
  if (isValidObjectId(id)) {
    bill = await Bill.findById(id);
  }

  // If not found by _id or id is not a valid ObjectId, try finding by ID property
  if (!bill) {
    bill = await Bill.findOne({ ID: id });
  }

  // Check if bill is still not found
  if (!bill) {
    const error: ErrnoException = new Error("Bill not found");
    error.name = "NotFoundError";
    error.path = "id";
    throw error;
  }

  // Send bill
  res.status(200).json(bill);
};

//@Desc   >>>> Create Bill
//@Route  >>>> POST /api/bills
//@Access >>>> Private(Admins Only)
const createBill = async (req: Request, res: Response) => {
  //Create New Bill With Request Data & Send Created Bill Back.
  const bill = await Bill.create({
    customer: req.body?.customer,
    details: req.body?.details,
    date: req.body?.date,
    subtotal: req.body?.subtotal,
    total: req.body?.total,
    tax_due: req.body?.taxDue,
    tax_rate: req.body?.taxRate,
    taxable: req.body?.taxable,
    paid_amount: req.body?.paidAmount,
    remaining_amount: req.body?.remainingAmount,
    payment_method: req.body?.paymentMethod,
    other: req.body?.other,
  });

  const { details } = req.body;
  if (!details) throw new Error("Bill Details is required");

  //Create other service records
  for (let index = 0; index < details.length; index++) {
    //1-Check for passport type
    if (details[index]?.type === "Passport") {
      //create passport record
      //Create New Passport With Request Data & Send Created Passport Back.
      const passport = await Passport.create({
        customer_name: details[index]?.data?.name,
        customer_nationality: details[index]?.data?.nationality,
        passport_id: details[index]?.data?.passportId,
        state: details[index]?.data?.state,
        service: details[index]?.data?.service,
        service_price: details[index]?.data?.servicePrice,
        taxable: details[index]?.data?.taxable,
        tax_rate: details[index]?.data?.taxRate,
        total: details[index]?.data?.total,
        sales: details[index]?.data?.sales,
        profit: details[index]?.data?.profit,
        payment_date: details[index]?.data?.paymentDate,
        payment_method: req.body?.paymentMethod,
        bill_id: bill.ID,
      });

      bill.details.map((item, i) => {
        if (index === i) {
          item.data = { ...item.data };
          item.passport_ref = passport.id;
        } else return item;
      });
    } else if (details[index]?.type === "Ticket") {
      //create ticket record
      //Create New Ticket With Request Data & Send Created Ticket Back.
      const ticket = await Ticket.create({
        customer_name: details[index]?.data?.name,
        employee: details[index]?.data?.employee,
        supplier: details[index]?.data?.supplier,
        type: details[index]?.data?.type,
        cost: details[index]?.data?.cost,
        total: details[index]?.data?.total,
        taxable: details[index]?.data?.taxable,
        sales: details[index]?.data?.sales,
        profit: details[index]?.data?.profit,
        payment_date: details[index]?.data?.paymentDate,
        paid_amount: details[index]?.data?.paidAmount,
        remaining_amount: details[index]?.data?.remainingAmount,
        payment_method: details[index]?.data?.paymentMethod,
        bill_id: bill.ID,
      });

      bill.details.map((item, i) => {
        if (index === i) {
          item.data = { ...item.data };
          item.ticket_ref = ticket.id;
        } else return item;
      });
    }
  }

  const updatedBill = await bill.save();

  res.status(201).json(updatedBill);
};

//@Desc   >>>> Helper function to compare old and new details
//@Access >>>> Private
const compareDetails = (oldDetails: any[], newDetails: any[]) => {
  const toDelete: any[] = [];
  const toUpdate: any[] = [];
  const toCreate: any[] = [];

  // Group old details by type
  const oldByType = new Map();
  oldDetails.forEach((detail) => {
    const type = detail.type;
    if (!oldByType.has(type)) {
      oldByType.set(type, []);
    }
    oldByType.get(type).push(detail);
  });

  // Group new details by type
  const newByType = new Map();
  newDetails.forEach((detail) => {
    const type = detail.type;
    if (!newByType.has(type)) {
      newByType.set(type, []);
    }
    newByType.get(type).push(detail);
  });

  // Track which old items have been matched
  const matchedOldIndices = new Set();

  // Match items by reference (if provided) first
  newDetails.forEach((newDetail, newIndex) => {
    const ref = newDetail.passport_ref || newDetail.ticket_ref;
    const type = newDetail.type;

    if (ref) {
      // If ref is provided, find matching old detail by ref
      const oldDetailsOfType = oldByType.get(type) || [];
      const matchingOldIndex = oldDetailsOfType.findIndex((d: any) => {
        const oldRef = d.passport_ref || d.ticket_ref;
        return oldRef === ref;
      });

      if (matchingOldIndex !== -1) {
        // Match found - UPDATE
        const oldIndex = oldDetailsOfType.findIndex((d: any) => {
          const oldRef = d.passport_ref || d.ticket_ref;
          return oldRef === ref;
        });
        const oldDetailKey = `${type}-${oldIndex}`;
        toUpdate.push({
          old: oldDetailsOfType[matchingOldIndex],
          new: newDetail,
        });
        matchedOldIndices.add(oldDetailKey);
      } else {
        // No match found, treat as CREATE
        toCreate.push(newDetail);
      }
    }
  });

  // Match remaining items by position (for items without refs)
  newByType.forEach((newDetailsOfType, type) => {
    const oldDetailsOfType = oldByType.get(type) || [];
    let oldMatchIndex = 0;

    newDetailsOfType.forEach((newDetail: any, newIndex: number) => {
      const ref = newDetail.passport_ref || newDetail.ticket_ref;

      // Skip if already matched by ref
      if (ref) {
        return;
      }

      // Skip old items that were already matched
      while (
        oldMatchIndex < oldDetailsOfType.length &&
        matchedOldIndices.has(`${type}-${oldMatchIndex}`)
      ) {
        oldMatchIndex++;
      }

      if (oldMatchIndex < oldDetailsOfType.length) {
        // Match by position - UPDATE
        const oldDetail = oldDetailsOfType[oldMatchIndex];
        toUpdate.push({ old: oldDetail, new: newDetail });
        matchedOldIndices.add(`${type}-${oldMatchIndex}`);
        oldMatchIndex++;
      } else {
        // No old item at this position - CREATE
        toCreate.push(newDetail);
      }
    });
  });

  // Find unmatched old items - DELETE
  oldByType.forEach((oldDetailsOfType, type) => {
    oldDetailsOfType.forEach((oldDetail: any, index: number) => {
      if (!matchedOldIndices.has(`${type}-${index}`)) {
        toDelete.push(oldDetail);
      }
    });
  });

  return { toDelete, toUpdate, toCreate };
};

//@Desc   >>>> UPDATE Bill
//@Route  >>>> PUT /api/bills/:id
//@Access >>>> Private(Admins Only)
const updateBill = async (req: Request, res: Response) => {
  // Get bill to be updated
  const bill = await Bill.findById(req.params?.id);

  // Check if bill exists
  if (!bill) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  }

  const oldDetails = bill.details;
  const newDetails = req.body?.details;

  if (!newDetails) throw new Error("Bill Details is required");

  // Compare old and new details to determine operations
  const operations = compareDetails(oldDetails, newDetails);

  // 1. Delete items that are in old but not in new
  for (const detail of operations.toDelete) {
    if (detail.type === "Passport") {
      await Passport.findByIdAndDelete(detail.passport_ref);
    } else if (detail.type === "Ticket") {
      await Ticket.findByIdAndDelete(detail.ticket_ref);
    }
  }

  // 2. Update items that exist in both old and new
  for (const operation of operations.toUpdate) {
    const { old: oldDetail, new: newDetail } = operation;

    if (newDetail.type === "Passport") {
      const passport = await Passport.findById(oldDetail.passport_ref);
      if (passport) {
        passport.customer_name = newDetail.data?.name;
        passport.customer_nationality = newDetail.data?.nationality;
        passport.passport_id = newDetail.data?.passportId;
        passport.state = newDetail.data?.state;
        passport.service = newDetail.data?.service;
        passport.payment_date = newDetail.data?.paymentDate;
        passport.taxable = newDetail.data?.taxable;
        passport.tax_rate = newDetail.data?.taxRate;
        passport.service_price = newDetail.data?.servicePrice;
        passport.total = newDetail.data?.total;
        passport.sales = newDetail.data?.sales;
        passport.profit = newDetail.data?.profit;
        passport.payment_method = newDetail.data?.paymentMethod;

        await passport.save();
      }
    } else if (newDetail.type === "Ticket") {
      const ticket = await Ticket.findById(oldDetail.ticket_ref);
      if (ticket) {
        ticket.customer_name = newDetail.data?.name;
        ticket.supplier = newDetail.data?.supplier;
        ticket.employee = newDetail.data?.employee;
        ticket.type = newDetail.data?.type;
        ticket.cost = newDetail.data?.cost;
        ticket.total = newDetail.data?.total;
        ticket.taxable = newDetail.data?.taxable;
        ticket.sales = newDetail.data?.sales;
        ticket.profit = newDetail.data?.profit;
        ticket.payment_date = newDetail.data?.paymentDate;
        ticket.paid_amount = newDetail.data?.paidAmount;
        ticket.remaining_amount = newDetail.data?.remainingAmount;
        ticket.payment_method = newDetail.data?.paymentMethod;

        await ticket.save();
      }
    }
  }

  // 3. Create new items
  for (const detail of operations.toCreate) {
    if (detail.type === "Passport") {
      const passport = await Passport.create({
        customer_name: detail.data?.name,
        customer_nationality: detail.data?.nationality,
        passport_id: detail.data?.passportId,
        state: detail.data?.state,
        service: detail.data?.service,
        service_price: detail.data?.servicePrice,
        taxable: detail.data?.taxable,
        tax_rate: detail.data?.taxRate,
        total: detail.data?.total,
        sales: detail.data?.sales,
        profit: detail.data?.profit,
        payment_date: detail.data?.paymentDate,
        payment_method: detail.data?.paymentMethod,
        bill_id: bill.ID,
      });

      detail.passport_ref = passport.id;
    } else if (detail.type === "Ticket") {
      const ticket = await Ticket.create({
        customer_name: detail.data?.name,
        employee: detail.data?.employee,
        supplier: detail.data?.supplier,
        type: detail.data?.type,
        cost: detail.data?.cost,
        total: detail.data?.total,
        taxable: detail.data?.taxable,
        sales: detail.data?.sales,
        profit: detail.data?.profit,
        payment_date: detail.data?.paymentDate,
        paid_amount: detail.data?.paidAmount,
        remaining_amount: detail.data?.remainingAmount,
        payment_method: detail.data?.paymentMethod,
        bill_id: bill.ID,
      });

      detail.ticket_ref = ticket.id;
    }
  }

  // Update bill with new values
  bill.customer = req.body?.customer;
  bill.details = newDetails;
  bill.date = req.body?.date;
  bill.subtotal = req.body?.subtotal;
  bill.total = req.body?.total;
  bill.tax_due = req.body?.taxDue;
  bill.tax_rate = req.body?.taxRate;
  bill.taxable = req.body?.taxable;
  bill.paid_amount = req.body?.paidAmount;
  bill.remaining_amount = req.body?.remainingAmount;
  bill.payment_method = req.body?.payment_method;
  bill.other = req.body?.other;

  const updatedBill = await bill.save();

  res.status(200).json(updatedBill);
};

//@Desc   >>>> UPDATE Bill
//@Route  >>>> PUT /api/bills/:id
//@Access >>>> Private(Admins Only)
// const updateBill = async (req: Request, res: Response) => {
//   //Get Bill Wanted For Updating.
//   const bill = await Bill.findById(req.params?.id);

//   //Check if Bill is not exist.
//   if (!bill) {
//     const error: ErrnoException = new Error();
//     error.name = "CastError";
//     error.path = "_id";
//     throw error;
//   } else {
//     //Update Bill With New Values.
//     (bill.customer = req.body?.customer),
//       (bill.details = req.body?.details),
//       (bill.date = req.body?.date),
//       (bill.subtotal = req.body?.subtotal),
//       (bill.total = req.body?.total),
//       (bill.tax_due = req.body?.taxDue),
//       (bill.tax_rate = req.body?.taxRate),
//       (bill.taxable = req.body?.taxable),
//       (bill.paid_amount = req.body?.paidAmount),
//       (bill.remaining_amount = req.body?.remainingAmount),
//       (bill.payment_method = req.body?.payment_method),
//       (bill.other = req.body?.other);

//     //Get Updated Bill info & Send it Back.
//     const updatedBill = await bill.save();

//     const { details } = req.body;
//     if (!details) throw new Error("Bill Details is required");

//     //Update Other Records
//     for (let index = 0; index < details.length; index++) {
//       //1-Check for passport type
//       if (details[index]?.type === "Passport") {
//         //update passport record
//         //Get Passport Wanted For Updating.
//         const passport = await Passport.findById(details[index]?.passport_ref);

//         //Check if Passport is not exist.
//         if (!passport) {
//           // const error: ErrnoException = new Error();
//           // error.name = "CastError";
//           // error.path = "_id";
//           // throw error;
//           console.log("Passport Not found");
//         } else {
//           //Update Passport With New Values.
//           passport.customer_name = details[index]?.data.name;
//           passport.customer_nationality = details[index]?.data.nationality;
//           passport.passport_id = details[index]?.data.passportId;
//           passport.state = details[index]?.data.state;
//           passport.service = details[index]?.data.service;
//           passport.payment_date = details[index]?.data.paymentDate;
//           passport.taxable = details[index]?.data.taxable;
//           passport.tax_rate = details[index]?.data.taxRate;
//           passport.service_price = details[index]?.data.servicePrice;
//           passport.total = details[index]?.data.total;
//           passport.sales = details[index]?.data.sales;
//           passport.profit = details[index]?.data.profit;
//           passport.payment_method = req.body?.payment_method;

//           await passport.save();
//         }
//       } else if (details[index]?.type === "Ticket") {
//         //Get Ticket Wanted For Updating.
//         const ticket = await Ticket.findById(details[index]?.ticket_ref);

//         //Check if Ticket is not exist.
//         if (!ticket) {
//           // const error: ErrnoException = new Error();
//           // error.name = "CastError";
//           // error.path = "_id";
//           // throw error;
//           console.log("Ticket Not found");
//         } else {
//           //Update Ticket With New Values.
//           ticket.customer_name = details[index]?.data?.name;
//           ticket.supplier = details[index]?.data?.supplier;
//           ticket.employee = details[index]?.data?.employee;
//           ticket.type = details[index]?.data?.type;
//           ticket.cost = details[index]?.data?.cost;
//           ticket.total = details[index]?.data?.total;
//           ticket.taxable = details[index]?.data?.taxable;
//           ticket.sales = details[index]?.data?.sales;
//           ticket.profit = details[index]?.data?.profit;
//           ticket.payment_date = details[index]?.data?.paymentDate;
//           ticket.paid_amount = details[index]?.data?.paidAmount;
//           ticket.remaining_amount = details[index]?.data?.remainingAmount;
//           ticket.payment_method = req.body?.payment_method;

//           await ticket.save();
//         }
//       }
//     }

//     res.status(200).json(updatedBill);
//   }
// };

//@Desc   >>>> Delete one Bill
//@Route  >>>> DELETE /api/bills/:id
//@Access >>>> Private(Admins Only)
const deleteBill = async (req: Request, res: Response) => {
  //Get Bill Wanted For Updating.
  const bill = await Bill.findById(req.params?.id);

  //Check if Bill is not exist.
  if (!bill) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    const { details } = bill;
    if (!details) throw new Error("Bill Details is required");

    //Delete Other Records
    for (let index = 0; index < details.length; index++) {
      //1-Check for passport type
      if (details[index]?.type === "Passport") {
        //Delete passport record
        //Get Passport Wanted For Deleting.
        const deletedPassport = await Passport.findByIdAndDelete(
          details[index]?.passport_ref,
        );

        //Check If the Document is Already Deleted Or Not.
        if (!deletedPassport?.id) {
          console.log("This Passport Has Been Already Deleted!");
        }
      } else if (details[index]?.type === "Ticket") {
        //Delete Ticket record
        //Get Ticket Wanted For Deleting.
        const deletedTicket = await Ticket.findByIdAndDelete(
          details[index]?.ticket_ref,
        );

        //Check If the Document is Already Deleted Or Not.
        if (!deletedTicket?.id) {
          console.log("This Ticket Has Been Already Deleted!");
        }
      }
    }
  }

  //Get Bill Wanted For Deleting.
  const deletedBill = await Bill.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedBill?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Bill id Back.
    res.status(200).json({ id: deletedBill?.id });
  }
};

//@Desc   >>>> Get Bills Statistcis.
//@Route  >>>> GET /api/bills/statistics
//@Access >>>> Private(Admins Only)
// const getBillsStatistics = async (_req: Request, res: Response) => {
//   //Get All Bills Data.
//   const bills = await Bill.find({});

//   const statistics = billsChartsCalculations(bills);

//   res.status(200).json(statistics);
// };

//@Desc   >>>> Get Bills Statistics.
//@Route  >>>> GET /api/bills/statistics
//@Access >>>> Private(Admins Only)
const getBillsStatistics = async (_req: Request, res: Response) => {
  // Try to get statistics from cache
  const cachedStatistics = cache.get("bills-statistics");

  if (cachedStatistics) {
    // If statistics are cached, return them
    res.status(200).json(cachedStatistics);
  } else {
    // If not cached, fetch bills data from the database
    const bills = await Bill.find({});

    // Perform calculations on bills data
    const statistics = billsChartsCalculations(bills);

    // Cache the statistics with an expiration time (e.g., one day)
    cache.set("bills-statistics", statistics, 86400); // 86400 seconds = 1 day

    // Send the response with the calculated statistics
    res.status(200).json(statistics);
  }
};

export {
  getBills,
  getOneBill,
  createBill,
  deleteBill,
  updateBill,
  getBillsStatistics,
};
