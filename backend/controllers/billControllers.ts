import { Request, Response } from "express";
import Bill from "../models/billModel";
import { ErrnoException } from "./adminControllers";
import Passport from "../models/passportModel";
import Ticket from "../models/ticketModel";

//@Desc   >>>> Get All Bills That Match Query Object.
//@Route  >>>> POST /api/bills/query
//@Access >>>> Private(Admins Only)
const getBills = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  //Prepare Queries for Mongoose Query.
  const queries = query
    ? {
        //Filter By Customer Name.
        "customer.name": new RegExp(`${query?.name}`, "gi"),
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
        sales: details[index]?.data?.sales,
        profit: details[index]?.data?.profit,
        payment_date: details[index]?.data?.paymentDate,
        paid_amount: details[index]?.data?.paidAmount,
        remaining_amount: details[index]?.data?.remainingAmount,
        payment_method: details[index]?.data?.paymentMethod,
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

//@Desc   >>>> UPDATE Bill
//@Route  >>>> PUT /api/bills/:id
//@Access >>>> Private(Admins Only)
const updateBill = async (req: Request, res: Response) => {
  //Get Bill Wanted For Updating.
  const bill = await Bill.findById(req.params?.id);

  //Check if Bill is not exist.
  if (!bill) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Bill With New Values.
    (bill.customer = req.body?.customer),
      (bill.details = req.body?.details),
      (bill.date = req.body?.date),
      (bill.subtotal = req.body?.subtotal),
      (bill.total = req.body?.total),
      (bill.tax_due = req.body?.taxDue),
      (bill.tax_rate = req.body?.taxRate),
      (bill.taxable = req.body?.taxable),
      (bill.paid_amount = req.body?.paidAmount),
      (bill.remaining_amount = req.body?.remainingAmount),
      (bill.payment_method = req.body?.paymentMethod),
      (bill.other = req.body?.other);

    //Get Updated Bill info & Send it Back.
    const updatedBill = await bill.save();

    const { details } = req.body;
    if (!details || !details?.data) throw new Error("Bill Details is required");
    //Update Other Records
    for (let index = 0; index < details.length; index++) {
      //1-Check for passport type
      if (details[index]?.type === "Passport") {
        //update passport record
        //Get Passport Wanted For Updating.
        const passport = await Passport.findById(details[index]?.passport_ref);

        //Check if Passport is not exist.
        if (!passport) {
          // const error: ErrnoException = new Error();
          // error.name = "CastError";
          // error.path = "_id";
          // throw error;
          console.log("Passport Not found");
        } else {
          //Update Passport With New Values.
          passport.customer_name = details?.data.name;
          passport.customer_nationality = details?.data.nationality;
          passport.passport_id = details?.data.passportId;
          passport.state = details?.data.state;
          passport.service = details?.data.service;
          passport.payment_date = details?.data.paymentDate;
          passport.taxable = details?.data.taxable;
          passport.tax_rate = details?.data.taxRate;
          passport.service_price = details?.data.servicePrice;
          passport.total = details?.data.total;
          passport.sales = details?.data.sales;
          passport.profit = details?.data.profit;

          await passport.save();
        }
      } else if (details[index]?.type === "Ticket") {
        //Get Ticket Wanted For Updating.
        const ticket = await Ticket.findById(details[index]?.ticket_ref);

        //Check if Ticket is not exist.
        if (!ticket) {
          // const error: ErrnoException = new Error();
          // error.name = "CastError";
          // error.path = "_id";
          // throw error;
          console.log("Ticket Not found");
        } else {
          //Update Ticket With New Values.
          ticket.customer_name = details?.data?.name;
          ticket.supplier = details?.data?.supplier;
          ticket.employee = details?.data?.employee;
          ticket.type = details?.data?.type;
          ticket.cost = details?.data?.cost;
          ticket.sales = details?.data?.sales;
          ticket.profit = details?.data?.profit;
          ticket.payment_date = details?.data?.paymentDate;
          ticket.paid_amount = details?.data?.paidAmount;
          ticket.remaining_amount = details?.data?.remainingAmount;
          ticket.payment_method = details?.data?.paymentMethod;

          await ticket.save();
        }
      }

      res.status(200).json(updatedBill);
    }
  }
};

//@Desc   >>>> Delete one Bill
//@Route  >>>> DELETE /api/bills/:id
//@Access >>>> Private(Admins Only)
const deleteBill = async (req: Request, res: Response) => {
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

export { getBills, createBill, deleteBill, updateBill };
