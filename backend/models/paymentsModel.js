const mongoose = require("mongoose");

//Define Payment Type Schema
const paymentTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Payment Type Name!"],
  },
  total: {
    type: Number,
    required: [true, "Please Payment Type Total!"],
    min: [0, "Payment Type Total Can NOT Be Less Than 0"],
  },
});

//Define Payment Schema
const paymentSchema = new mongoose.Schema(
  {
    payment_types: {
      type: [paymentTypeSchema],
      required: [true, "Please Provide Payment Types Details!"],
    },
    date: {
      type: Date,
      required: [true, "Please Provide Payment Date!"],
    },
    total: {
      type: Number,
      required: [true, "Please Provide Payment Total!"],
      min: [0, "Payment Total Can NOT Be Less Than 0"],
    },
  },
  {
    timestamps: true,
  }
);

//Define Payment Model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
