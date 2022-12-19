"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var bankSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
//Define Bank Model
var Bank = (0, mongoose_1.model)("Bank", bankSchema);
exports.default = Bank;
