import { Schema, model, Date } from "mongoose";

export interface ITicket {
  customer_name: string;
  cost: number;
  sales: number;
  profit: number;
  paid_amount: number;
  remaining_amount: number;
  supplier?: string;
  employee?: string;
  type?: string;
  payment_method?: string;
  payment_date?: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    supplier: {
      type: String,
    },
    employee: {
      type: String,
    },
    type: {
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
    payment_date: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//Define Ticket Model
const Ticket = model<ITicket>("Ticket", ticketSchema);

export default Ticket;
