"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var ticketSchema = new mongoose_1.Schema({
    customer_name: {
        type: String,
        required: [true, "Please Type Customer Name!"],
    },
    supplier: {
        type: String,
    },
    employee: {
        type: String,
    },
    type: {
        type: String,
    },
    cost: {
        type: Number,
        default: 0,
        min: [0, "Ticket Cost Can Not Be Less Than 0"],
    },
    sales: {
        type: Number,
        default: 0,
        min: [0, "Ticket Sales Can Not Be Less Than 0"],
    },
    profit: {
        type: Number,
        default: 0,
        min: [0, "Ticket Profit Can Not Be Less Than 0"],
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
ticketSchema.plugin(mongoose_paginate_v2_1.default);
//Define Ticket Model
var Ticket = (0, mongoose_1.model)("Ticket", ticketSchema, "tickets");
exports.default = Ticket;
