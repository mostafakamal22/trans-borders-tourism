import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IPaymentType {
  name: string;
  cost: number;
  tax: number;
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
  cost: {
    type: Number,
    required: [true, "Please Payment Type Cost!"],
    min: [0, "Payment Type Cost Can NOT Be Less Than 0"],
  },
  tax: {
    type: Number,
    required: [true, "Please Payment Type Tax!"],
    min: [0, "Payment Type Tax Can NOT Be Less Than 0"],
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

//Default Options For Paginated Data
paginate.paginate.options = {
  lean: true,
  leanWithId: true,
};

//Paginate with plugin.
paymentSchema.plugin(paginate);

//Declare a mongoose document based on a Typescript interface representing Payment schema.
export interface IPaymentDocument
  extends Document,
    IPayment,
    SchemaTimestampsConfig {}

//Define Payment Model
const Payment = model<IPaymentDocument, PaginateModel<IPaymentDocument>>(
  "Payment",
  paymentSchema,
  "payments"
);

export default Payment;
