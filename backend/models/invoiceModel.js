const mongoose = require("mongoose");

//Define customer Schema
const customerSchema = new mongoose.Schema({
  ID: {
    type: Number,
    required: [true, "Please Provide Customer ID"],
  },
  name: {
    type: String,
    required: [true, "Please Provide Customer Name"],
  },
  number: {
    type: Number,
    required: [true, "Please Provide Customer Mobile Number!"],
  },
});

//Define product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide Product Name!"],
  },
  price: {
    type: Number,
    required: [true, "Please Provide Product Price!"],
    min: [0, "Price Can NOT Be Less Than 0"],
  },
  quantity: {
    type: Number,
    required: [true, "Please Provide Product Quantity!"],
    min: [0, "Quantity Can NOT Be Less Than 0"],
  },
});

//Define Invoice Schema
const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: customerSchema,
      required: [true, "Please Provide Customer Details!"],
    },
    details: {
      type: [productSchema],
      required: [true, "Please Provide Ivoice Details!"],
    },
    ID: {
      type: String,
      required: [true, "Please Provide Invoice ID!"],
    },
    date: {
      type: Date,
      required: [true, "Please Provide Invoice Date!"],
    },
    due_date: {
      type: Date,
      required: [true, "Please Provide Invoice Due Date!"],
    },
    subtotal: {
      type: Number,
      required: [true, "Please Provide Invoice SubTotal!"],
      min: [0, "Subtotal Can NOT Be Less Than 0"],
    },
    total: {
      type: Number,
      required: [true, "Please Provide Invoice Total!"],
      min: [0, "Total Can NOT Be Less Than 0"],
    },
    taxable: {
      type: Number,
      min: [0, "Taxable Can NOT Be Less Than 0"],
    },
    tax_rate: {
      type: Number,
      min: [0, "Tax Rate Can NOT Be Less Than 0"],
    },
    tax_due: {
      type: Number,
      min: [0, "Tax Due Can NOT Be Less Than 0"],
    },
    other: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

//Define Invoice Model
const Invoice = mongoose.model("Invoice", invoiceSchema);

module.exports = Invoice;
