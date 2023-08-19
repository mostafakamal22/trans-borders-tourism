"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var mongoose_plugin_autoinc_1 = require("mongoose-plugin-autoinc");
//Define customer info Schema
var customerSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "Customer Name is required"],
    },
});
//Define product Schema
var productSchema = new mongoose_1.Schema({
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
        type: mongoose_1.Schema.Types.Mixed,
    },
});
//Define Bill Schema
var billSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//Default Options For Paginated Data
mongoose_paginate_v2_1.default.paginate.options = {
    lean: true,
    leanWithId: true,
};
//Paginate with plugin.
billSchema.plugin(mongoose_paginate_v2_1.default);
//Auto Increament Bill Number Plugin
billSchema.plugin(mongoose_plugin_autoinc_1.autoIncrement, {
    model: "Bill",
    field: "ID",
    startAt: 570,
    incrementBy: 1,
});
//Define Bill Model
var Bill = (0, mongoose_1.model)("Bill", billSchema, "bills");
exports.default = Bill;
