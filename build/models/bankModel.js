"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
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
//Default Options For Paginated Data
mongoose_paginate_v2_1.default.paginate.options = {
    lean: true,
    leanWithId: true,
};
//Paginate with plugin.
bankSchema.plugin(mongoose_paginate_v2_1.default);
//Define Bank Model
var Bank = (0, mongoose_1.model)("Bank", bankSchema, "banks");
exports.default = Bank;
