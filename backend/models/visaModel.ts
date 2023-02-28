import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IVisa {
  customer_name: string;
  passport_id: string | number;
  net_fare: number;
  sales: number;
  profit: number;
  paid_amount: number;
  remaining_amount: number;
  provider?: string;
  sponsor?: string;
  type?: string;
  employee?: string;
  payment_method?: string;
  payment_date?: Date;
}

const visaSchema = new Schema<IVisa>(
  {
    customer_name: {
      type: String,
      required: [true, "Please Type Customer Name!"],
    },
    passport_id: {
      type: String || Number,
      required: [true, "Please Type Customer Passport Id!"],
    },
    provider: {
      type: String,
    },
    sponsor: {
      type: String,
    },
    type: {
      type: String,
    },
    employee: {
      type: String,
    },
    net_fare: {
      type: Number,
      default: 0,
      min: [0, "Visa net fare Can Not Be less than 0"],
    },
    sales: {
      type: Number,
      default: 0,
      min: [0, "Visa Sales Can Not Be less than 0"],
    },
    profit: {
      type: Number,
      default: 0,
      min: [0, "Visa Profit Can Not Be less than 0"],
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

//Default Options For Paginated Data
paginate.paginate.options = {
  lean: true,
  leanWithId: true,
};

//Paginate with plugin.
visaSchema.plugin(paginate);

//Declare a mongoose document based on a Typescript interface representing Visa schema.
export interface IVisaDocument
  extends Document,
    IVisa,
    SchemaTimestampsConfig {}

//Define Visa Model
const Visa = model<IVisaDocument, PaginateModel<IVisaDocument>>(
  "Visa",
  visaSchema,
  "visas"
);

export default Visa;
