import { Schema, model, Date } from "mongoose";

interface IPaymentType {
  name: string;
  total: number;
  description?: string;
  method?: string;
}

export interface IPayment {
  payment_types: IPaymentType[];
  date: Date;
  total: number;
}

//Define Payment Type Schema
const paymentTypeSchema = new Schema<IPaymentType>({
  name: {
    type: String,
    required: [true, "Please Payment Type Name!"],
  },
  description: {
    type: String,
  },
  method: {
    type: String,
  },
  total: {
    type: Number,
    required: [true, "Please Payment Type Total!"],
    min: [0, "Payment Type Total Can NOT Be Less Than 0"],
  },
});

//Define Payment Schema
const paymentSchema = new Schema<IPayment>(
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
const Payment = model<IPayment>("Payment", paymentSchema);

export default Payment;
