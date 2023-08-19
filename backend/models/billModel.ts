import {
  Schema,
  model,
  Document,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";
import { autoIncrement } from "mongoose-plugin-autoinc";

export interface IBillCustomer {
  name: string;
}

export interface IBillProduct {
  type: "Passport" | "Ticket" | "Other";
  desc?: string;
  price: number;
  quantity: number;
  passport_ref?: string;
  ticket_ref?: string;
  data?: any;
}

export interface IBill {
  customer: IBillCustomer;
  details: IBillProduct[];
  date: Date;
  subtotal?: number;
  taxable?: number;
  total?: number;
  tax_rate?: number;
  tax_due?: number;
  paid_amount?: number;
  remaining_amount?: number;
  payment_method?: string;
  other?: string;
}

//Define customer info Schema
const customerSchema = new Schema<IBillCustomer>({
  name: {
    type: String,
    required: [true, "Customer Name is required"],
  },
});

//Define product Schema
const productSchema = new Schema<IBillProduct>({
  type: {
    type: String,
    enum: {
      values: ["Passport", "Ticket", "Other"],
      message: "{VALUE} is not supported as bill type",
    },
  },
  desc: {
    type: String,
  },
  price: {
    type: Number,
    default: 1,
    min: [1, "Price Can NOT Be Less Than 1"],
  },
  quantity: {
    type: Number,
    default: 1,
    min: [1, "Quantity Can NOT Be Less Than 1"],
  },
  passport_ref: {
    type: String,
  },
  ticket_ref: {
    type: String,
  },
  data: {
    type: Schema.Types.Mixed,
  },
});

//Define Bill Schema
const billSchema = new Schema<IBill>(
  {
    customer: {
      type: customerSchema,
    },
    details: {
      type: [productSchema],
    },
    date: {
      type: Date,
      required: [true, "Bill Date is required"],
    },
    subtotal: {
      type: Number,
      default: 0,
      min: [0, "Subtotal Can NOT Be Less Than 0"],
    },
    total: {
      type: Number,
      default: 1,
      min: [1, "Total Can NOT Be Less Than 1"],
    },
    taxable: {
      type: Number,
      default: 0,
      min: [0, "Taxable Can NOT Be Less Than 0"],
    },
    tax_rate: {
      type: Number,
      default: 0,
      min: [0, "Tax Rate Can NOT Be Less Than 0"],
    },
    tax_due: {
      type: Number,
      default: 0,
      min: [0, "Tax Due Can NOT Be Less Than 0"],
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
    other: {
      type: String,
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
billSchema.plugin(paginate);

//Auto Increament Bill Number Plugin
billSchema.plugin(autoIncrement, {
  model: "Bill",
  field: "ID",
  startAt: 570,
  incrementBy: 1,
});

//Declare a mongoose document based on a Typescript interface representing Bill schema.
export interface IBillDocument extends Document, IBill, SchemaTimestampsConfig {
  ID: number;
}

//Define Bill Model
const Bill = model<IBillDocument, PaginateModel<IBillDocument>>(
  "Bill",
  billSchema,
  "bills"
);

export default Bill;
