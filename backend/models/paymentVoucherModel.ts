import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";
import { autoIncrement } from "mongoose-plugin-autoinc";

export interface IPaymentVoucher {
  customer_name: string;
  amount: number;
  bank?: string;
  reference_number?: string;
  being?: string;
  payment_date: Date;
}

const paymentVoucherSchema = new Schema<IPaymentVoucher>(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, "Payment Voucher amount Can Not Be Less Than 0"],
    },
    reference_number: {
      type: String,
    },
    bank: {
      type: String,
    },
    being: {
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

//Default Options For Paginated Data
paginate.paginate.options = {
  lean: true,
  leanWithId: true,
};

//Paginate with plugin.
paymentVoucherSchema.plugin(paginate);

//Auto Increament PaymentVoucher Number Plugin
paymentVoucherSchema.plugin(autoIncrement, {
  model: "PaymentVoucher",
  field: "ID",
  startAt: 1,
  incrementBy: 1,
});

//Declare a mongoose document based on a Typescript interface representing PaymentVoucher schema.
export interface IPaymentVoucherDocument
  extends Document,
    IPaymentVoucher,
    SchemaTimestampsConfig {
  ID: number;
}

//Define PaymentVoucher Model
const PaymentVoucher = model<
  IPaymentVoucherDocument,
  PaginateModel<IPaymentVoucherDocument>
>("PaymentVoucher", paymentVoucherSchema, "paymentVouchers");

export default PaymentVoucher;
