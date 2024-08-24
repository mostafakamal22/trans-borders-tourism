import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";
import { autoIncrement } from "mongoose-plugin-autoinc";

export interface IReceiptVoucher {
  customer_name: string;
  amount: number;
  bank?: string;
  reference_number?: string;
  being?: string;
  payment_date: Date;
}

const receiptVoucherSchema = new Schema<IReceiptVoucher>(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    amount: {
      type: Number,
      default: 0,
      min: [0, "Receipt Voucher amount Can Not Be Less Than 0"],
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
receiptVoucherSchema.plugin(paginate);

//Auto Increament ReceiptVoucher Number Plugin
receiptVoucherSchema.plugin(autoIncrement, {
  model: "ReceiptVoucher",
  field: "ID",
  startAt: 1,
  incrementBy: 1,
});

//Declare a mongoose document based on a Typescript interface representing ReceiptVoucher schema.
export interface IReceiptVoucherDocument
  extends Document,
    IReceiptVoucher,
    SchemaTimestampsConfig {
  ID: number;
}

//Define ReceiptVoucher Model
const ReceiptVoucher = model<
  IReceiptVoucherDocument,
  PaginateModel<IReceiptVoucherDocument>
>("ReceiptVoucher", receiptVoucherSchema, "receiptVouchers");

export default ReceiptVoucher;
