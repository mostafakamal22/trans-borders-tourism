"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
//Define Purchase Type Schema
var purchaseTypeSchema = new mongoose_1.Schema({
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
var purchaseSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//Define Purchase Model
var Purchase = (0, mongoose_1.model)("Purchase", purchaseSchema);
exports.default = Purchase;
