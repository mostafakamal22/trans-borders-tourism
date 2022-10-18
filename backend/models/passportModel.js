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
    total: {
      type: Number,
      default: 0,
    },
    payment_date: {
      type: Date,
      default: "1970-10-10T19:46:38.721Z",
    },
  },
  {
    timestamps: true,
  }
);

//Define Passport Model
const Passport = mongoose.model("Passport", passportSchema);

module.exports = Passport;
