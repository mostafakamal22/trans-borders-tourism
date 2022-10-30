const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    suplier: {
      type: String,
    },
    booking: {
      type: String,
    },
    cost: {
      type: Number,
      default: 0,
      min: [0, "Ticket Cost Can Not Be Less Than 0"],
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, "Ticket Sales Can Not Be Less Than 0"],
    },
    profit: {
      type: Number,
      default: 0,
      min: [0, "Ticket Profit Can Not Be Less Than 0"],
    },
    payment_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Define Ticket Model
const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
