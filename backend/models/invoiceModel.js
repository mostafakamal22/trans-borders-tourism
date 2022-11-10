const mongoose = require("mongoose");

//Define customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  number: {
    type: Number || String,
  },
});

//Define product Schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price Can NOT Be Less Than 0"],
  },
  quantity: {
    type: Number,
    default: 0,
    min: [0, "Quantity Can NOT Be Less Than 0"],
  },
});

//Define Invoice Schema
const invoiceSchema = new mongoose.Schema(
  {
    customer: {
      type: customerSchema,
    },
    details: {
      type: [productSchema],
    },
    ID: {
      type: String,
    },
    date: {
      type: Date,
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal Can NOT Be Less Than 0"],
    },
    total: {
      type: Number,
      default: 0,
      min: [0, "Total Can NOT Be Less Than 0"],
    },
    taxable: {
      type: Number,
      default: 0,
      min: [0, "Taxable Can NOT Be Less Than 0"],
    },
    tax_rate: {
      type: Number,
      default: 0,
      min: [0, "Tax Rate Can NOT Be Less Than 0"],
    },
    tax_due: {
      type: Number,
      default: 0,
      min: [0, "Tax Due Can NOT Be Less Than 0"],
    },
    paid_amount: {
      type: Number,
      default: 0,
      min: [0, "Paid Amount Can NOT Be Less Than 0"],
    },
    remaining_amount: {
      type: Number,
      default: 0,
      min: [0, "Remaining Amount Can NOT Be Less Than 0"],
    },
    payment_method: {
      type: String,
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
