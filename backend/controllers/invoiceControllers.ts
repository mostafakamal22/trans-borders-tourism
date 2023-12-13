import { Request, Response } from "express";
import Invoice from "../models/invoiceModel";
import { ErrnoException } from "./adminControllers";
import { invoicesChartsCalculations } from "../calculations/invoices";

//@Desc   >>>> Get All Invoices That Match Query Object.
//@Route  >>>> POST /api/invoices/query
//@Access >>>> Private(Admins Only)
const getInvoices = async (req: Request, res: Response) => {
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

  //Get All Invoices Data That Match Query & Send it Back.
  const invoices = await Invoice.paginate(queries, options);
  res.status(200).json(invoices);
};

//@Desc   >>>> Create Invoice
//@Route  >>>> POST /api/invoices
//@Access >>>> Private(Admins Only)
const createInvoice = async (req: Request, res: Response) => {
  //Check If the invoice exist on the DB.
  const existInvoice = await Invoice.paginate({
    "customer.name": req.body?.customer?.name,
    date: req.body?.date,
  });

  if (existInvoice.totalDocs === 1) {
    const invoiceID = existInvoice.docs[0].id;

    //Get Invoice Wanted For Updating.
    const invoiceToUpdate = await Invoice.findById(invoiceID);

    //Check if Invoice is not exist.
    if (!invoiceToUpdate) {
      const error: ErrnoException = new Error();
      error.name = "CastError";
      error.path = "_id";
      throw error;
    } else {
      //Update Invoice With New Values.
      invoiceToUpdate.customer = req.body?.customer;
      invoiceToUpdate.details = req.body?.details;
      invoiceToUpdate.date = req.body?.date;
      invoiceToUpdate.subtotal = req.body?.subtotal;
      invoiceToUpdate.total = req.body?.total;
      invoiceToUpdate.ID = req.body?.ID;
      invoiceToUpdate.tax_due = req.body?.taxDue;
      invoiceToUpdate.tax_rate = req.body?.taxRate;
      invoiceToUpdate.taxable = req.body?.taxable;
      invoiceToUpdate.paid_amount = req.body?.paidAmount;
      invoiceToUpdate.remaining_amount = req.body?.remainingAmount;
      invoiceToUpdate.payment_method = req.body?.paymentMethod;
      invoiceToUpdate.other = req.body?.other;

      //Get Updated Invoice info & Send it Back.
      const updatedInvoice = await invoiceToUpdate.save();

      return res.status(200).json(updatedInvoice);
    }
  }

  //Create New Invoice With Request Data & Send Created Invoice Back.
  const invoice = await Invoice.create({
    customer: req.body?.customer,
    details: req.body?.details,
    date: req.body?.date,
    subtotal: req.body?.subtotal,
    total: req.body?.total,
    ID: req.body?.ID,
    tax_due: req.body?.taxDue,
    tax_rate: req.body?.taxRate,
    taxable: req.body?.taxable,
    paid_amount: req.body?.paidAmount,
    remaining_amount: req.body?.remainingAmount,
    payment_method: req.body?.paymentMethod,
    other: req.body?.other,
  });
  res.status(201).json(invoice);
};

//@Desc   >>>> Delete one Invoice
//@Route  >>>> DELETE /api/invoices/:id
//@Access >>>> Private(Admins Only)
const deleteInvoice = async (req: Request, res: Response) => {
  //Get Invoice Wanted For Deleting.
  const deletedInvoice = await Invoice.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedInvoice?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Invoice id Back.
    res.status(200).json({ id: deletedInvoice?.id });
  }
};

//@Desc   >>>> Get Invoices Statistcis.
//@Route  >>>> GET /api/invoices/statistics
//@Access >>>> Private(Admins Only)
const getInvoicesStatistics = async (_req: Request, res: Response) => {
  //Get All Invoices Data.
  const invoices = await Invoice.find({});

  const statistics = invoicesChartsCalculations(invoices);

  res.status(200).json(statistics);
};

export { getInvoices, createInvoice, deleteInvoice, getInvoicesStatistics };
