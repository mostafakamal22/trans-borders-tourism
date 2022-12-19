"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
//Define Payment Type Schema
var paymentTypeSchema = new mongoose_1.Schema({
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
    total: {
        type: Number,
        required: [true, "Please Payment Type Total!"],
        min: [0, "Payment Type Total Can NOT Be Less Than 0"],
    },
});
//Define Payment Schema
var paymentSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//Define Payment Model
var Payment = (0, mongoose_1.model)("Payment", paymentSchema);
exports.default = Payment;
