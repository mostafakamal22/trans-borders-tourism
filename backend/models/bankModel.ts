import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";

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

//Default Options For Paginated Data
paginate.paginate.options = {
  lean: true,
  leanWithId: true,
};

//Paginate with plugin.
bankSchema.plugin(paginate);

//Declare a mongoose document based on a Typescript interface representing Bank schema.
export interface IBankDocument
  extends Document,
    IBank,
    SchemaTimestampsConfig {}

//Define Bank Model
const Bank = model<IBankDocument, PaginateModel<IBankDocument>>(
  "Bank",
  bankSchema,
  "banks"
);

export default Bank;
