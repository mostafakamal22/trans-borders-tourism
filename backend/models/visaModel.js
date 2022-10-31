const mongoose = require("mongoose");

const visaSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    passport_id: {
      type: String || Number,
      required: [true, "Please Type Customer Passport Id!"],
    },
    provider: {
      type: String,
    },
    type: {
      type: String,
    },
    state: {
      type: String,
    },
    net_fare: {
      type: Number,
      default: 0,
      min: [0, "Visa net fare Can Not Be less than 0"],
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, "Visa Sales Can Not Be less than 0"],
    },
    profit: {
      type: Number,
      default: 0,
      min: [0, "Visa Profit Can Not Be less than 0"],
    },
    payment_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Define Visa Model
const Visa = mongoose.model("Visa", visaSchema);

module.exports = Visa;
