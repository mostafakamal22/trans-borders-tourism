const Invoice = require("../models/invoiceModel");

//@desc   >>>> Get All Invoices
//@route  >>>> GET /api/invoices
//@Access >>>> public(For Admins)
const getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find();
    res.status(200).json(invoices);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Get one invoice
//@route  >>>> GET /api/invoices/:id
//@Access >>>> public(For Admins)
const getOneInvoice = async (req, res) => {
  let invoice;
  try {
    invoice = await Invoice.findById(req.params.id);
    res.status(200).json(invoice);
  } catch (error) {
    if (!invoice) return res.status(404).send("Invoice Not Found!");
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Invoice
//@route  >>>> POST /api/invoice/
//@Access >>>> public(For Admins)
const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.create({
      customer: req.body.customer,
      details: req.body.details,
      date: req.body.date,
      due_date: req.body.dueDate,
      subtotal: req.body.subtotal,
      total: req.body.total,
      tax_due: req.body?.taxDue | "",
      tax_rate: req.body?.taxRate | "",
      taxable: req.body?.taxable | "",
      other: req.body?.other | "",
    });
    res.status(201).json(invoice);
  } catch (error) {
    if (
      error.message.match(/(date|due date|details|customer|subtotal|total)/gi)
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getInvoices,
  getOneInvoice,
  createInvoice,
};
