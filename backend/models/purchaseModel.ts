import {
  Schema,
  Document,
  model,
  PaginateModel,
  SchemaTimestampsConfig,
} from "mongoose";
import paginate from "mongoose-paginate-v2";

export interface IPurchaseType {
  name: string;
  cost: number;
  tax: number;
  total: number;
  description?: string;
  supplier?: string;
  reference_number?: string | number;
}

export interface IPurchase {
  purchase_types: IPurchaseType[];
  date: Date;
  total: number;
}

//Define Purchase Type Schema
const purchaseTypeSchema = new Schema<IPurchaseType>({
  name: {
    type: String,
    required: [true, "Please Purchase Type Name!"],
  },
  description: {
    type: String,
  },
  supplier: {
    type: String,
  },
  reference_number: {
    type: String || Number,
  },
  cost: {
    type: Number,
    required: [true, "Please Purchase Type Cost!"],
    min: [0, "Purchase Type Cost Can NOT Be Less Than 0"],
  },
  tax: {
    type: Number,
    required: [true, "Please Purchase Type Tax!"],
    min: [0, "Purchase Type Tax Can NOT Be Less Than 0"],
  },
  total: {
    type: Number,
    required: [true, "Please Purchase Type Total!"],
    min: [0, "Purchase Type Total Can NOT Be Less Than 0"],
  },
});

//Define Purchase Schema
const purchaseSchema = new Schema<IPurchase>(
  {
    purchase_types: {
      type: [purchaseTypeSchema],
      required: [true, "Please Provide Purchase Types Details!"],
    },
    date: {
      type: Date,
      required: [true, "Please Provide Purchase Date!"],
    },
    total: {
      type: Number,
      required: [true, "Please Provide Purchase Total!"],
      min: [0, "Purchase Total Can NOT Be Less Than 0"],
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
purchaseSchema.plugin(paginate);

//Declare a mongoose document based on a Typescript interface representing Purchase schema.
export interface IPurchaseDocument
  extends Document,
    IPurchase,
    SchemaTimestampsConfig {}

//Define Purchase Model
const Purchase = model<IPurchaseDocument, PaginateModel<IPurchaseDocument>>(
  "Purchase",
  purchaseSchema,
  "purchases"
);

export default Purchase;
