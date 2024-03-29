"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var visaSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//Default Options For Paginated Data
mongoose_paginate_v2_1.default.paginate.options = {
    lean: true,
    leanWithId: true,
};
//Paginate with plugin.
visaSchema.plugin(mongoose_paginate_v2_1.default);
//Define Visa Model
var Visa = (0, mongoose_1.model)("Visa", visaSchema, "visas");
exports.default = Visa;
