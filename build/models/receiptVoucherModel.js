"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var mongoose_plugin_autoinc_1 = require("mongoose-plugin-autoinc");
var receiptVoucherSchema = new mongoose_1.Schema({
    customer_name: {
        type: String,
        required: [true, "Please Type Customer Name!"],
    },
    amount: {
        type: Number,
        default: 0,
        min: [0, "Receipt Voucher amount Can Not Be Less Than 0"],
    },
    reference_number: {
        type: String,
    },
    bank: {
        type: String,
    },
    being: {
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
receiptVoucherSchema.plugin(mongoose_paginate_v2_1.default);
//Auto Increament ReceiptVoucher Number Plugin
receiptVoucherSchema.plugin(mongoose_plugin_autoinc_1.autoIncrement, {
    model: "ReceiptVoucher",
    field: "ID",
    startAt: 1,
    incrementBy: 1,
});
//Define ReceiptVoucher Model
var ReceiptVoucher = (0, mongoose_1.model)("ReceiptVoucher", receiptVoucherSchema, "receiptVouchers");
exports.default = ReceiptVoucher;
