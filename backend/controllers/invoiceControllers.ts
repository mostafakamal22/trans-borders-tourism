import { Request, Response } from "express";
import Invoice from "../models/invoiceModel";

//@desc   >>>> Get All Invoices
//@route  >>>> GET /api/invoices
//@Access >>>> public(For Admins)
const getInvoices = async (_req: Request, res: Response) => {
  //Get All Invoices Data & Send it Back.
  const invoices = await Invoice.find();
  res.status(200).json(invoices);
};

//@desc   >>>> Create Invoice
//@route  >>>> POST /api/invoice/
//@Access >>>> public(For Admins)
const createInvoice = async (req: Request, res: Response) => {
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

//@desc   >>>> Delete one Invoice
//@route  >>>> DELETE /api/invoice/:id
//@Access >>>> public(For Admins)
const deleteInvoice = async (req: Request, res: Response) => {
  //Get Invoice Wanted For Deleting & Send Deleted Invoice id Back.
  const deletedInvoice = await Invoice.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedInvoice?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedInvoice?.id });
  }
};

export { getInvoices, createInvoice, deleteInvoice };
