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
  },
  quantity: {
    type: Number,
    required: [true, "Please Provide Product Quantity!"],
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
    },
    total: {
      type: Number,
      required: [true, "Please Provide Invoice Total!"],
    },
    taxable: {
      type: Number,
    },
    tax_rate: {
      type: Number,
    },
    tax_due: {
      type: Number,
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
