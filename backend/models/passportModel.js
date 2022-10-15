const mongoose = require("mongoose");

const passportSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    customer_nationality: {
      type: String,
      required: [true, "Please Type Customer Nationality!"],
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
    total: {
      type: Number,
      required: [true, "Please Type Service Total"],
    },
    payment_date: {
      type: Date,
      required: [true, "Please Type Service Payment Date"],
    },
  },
  {
    timestamps: true,
  }
);

//Define Passport Model
const Passport = mongoose.model("Passport", passportSchema);

module.exports = Passport;
