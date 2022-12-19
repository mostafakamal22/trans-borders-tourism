import { Schema, model, Date } from "mongoose";

interface IPurchaseType {
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

//Define Purchase Model
const Purchase = model<IPurchase>("Purchase", purchaseSchema);

export default Purchase;
