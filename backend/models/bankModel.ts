import { Schema, model, Date } from "mongoose";

export interface IBank {
  customer_name: string;
  account_id: string | Number;
  total: number;
  payment_date: Date;
  type?: String;
  process_no?: number;
}

const bankSchema = new Schema<IBank>(
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
const Bank = model<IBank>("Bank", bankSchema);

export default Bank;
