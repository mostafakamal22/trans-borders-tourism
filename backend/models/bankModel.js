const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    account_id: {
      type: String || Number,
      required: [true, "Please Type Customer Account Id!"],
    },
    type: {
      type: String,
    },
    process_no: {
      type: Number,
    },
    total: {
      type: Number,
      required: [true, "Please Type Process Total!"],
      min: [0, "Process Total Can NOT be Less Than 0"],
    },
    payment_date: {
      type: Date,
      required: [true, "Please Type Process Payment Date!"],
    },
  },
  {
    timestamps: true,
  }
);

//Define Bank Model
const Bank = mongoose.model("Bank", bankSchema);

module.exports = Bank;
