const mongoose = require("mongoose");

//Define Purchase Type Schema
const purchaseTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Purchase Type Name!"],
  },
  description: {
    type: String,
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
const purchaseSchema = new mongoose.Schema(
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
const Purchase = mongoose.model("Purchase", purchaseSchema);

module.exports = Purchase;
