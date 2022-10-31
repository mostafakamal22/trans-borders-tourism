const mongoose = require("mongoose");

const passportSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    customer_nationality: {
      type: String,
      default: "-",
    },
    passport_id: {
      type: String || Number,
      required: [true, "Please Type Passport Id!"],
    },
    state: {
      type: String,
      required: [true, "Please Type State"],
    },
    service: {
      type: String,
      required: [true, "Please Type Service"],
    },
    service_price: {
      type: Number,
      default: 0,
    },
    tax_rate: {
      type: Number,
      default: 0,
    },
    taxable: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    sales: {
      type: Number,
      default: 0,
    },
    profit: {
      type: Number,
      default: 0,
    },
    payment_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Define Passport Model
const Passport = mongoose.model("Passport", passportSchema);

module.exports = Passport;
