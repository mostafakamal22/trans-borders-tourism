const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    customer_number: {
      type: Number,
      required: [true, "Please Type Customer Mobile Number!"],
    },
    version: {
      type: String,
      required: [true, "Please Type Visa Version!"],
    },
    passport_id: {
      type: String || Number,
      required: [true, "Please Type Customer Passport Id!"],
    },
    provider: {
      type: String,
      required: [true, "Please Type Visa Provider"],
    },
    type: {
      type: String,
      required: [true, "Please Type Visa Type"],
    },
    state: {
      type: String,
      required: [true, "Please Type Visa Type"],
    },
    net_fare: {
      type: Number,
      required: [true, "Please Type Visa Net Fare"],
    },
    sales: {
      type: Number,
      required: [true, "Please Type Visa Sales"],
    },
    profit: {
      type: Number,
      required: [true, "Please Type Visa Profit"],
    },
    payment_date: {
      type: Date,
      required: [true, "Please Type Visa Payment Date"],
    },
  },
  {
    timestamps: true,
  }
);

//Define Visa Model
const Visa = mongoose.model("Visa", visaSchema);

module.exports = Visa;
