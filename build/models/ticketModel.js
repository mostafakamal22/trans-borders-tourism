"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
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
//Define Ticket Model
var Ticket = (0, mongoose_1.model)("Ticket", ticketSchema);
exports.default = Ticket;
