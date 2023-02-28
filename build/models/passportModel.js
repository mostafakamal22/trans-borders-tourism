"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var passportSchema = new mongoose_1.Schema({
    customer_name: {
        type: String,
        required: [true, "Please Type Customer Name!"],
    },
    customer_nationality: {
        type: String,
        default: "-",
    },
    passport_id: {
        type: String || Number,
        required: [true, "Please Type Passport Id!"],
    },
    state: {
        type: String,
        required: [true, "Please Type State"],
    },
    service: {
        type: String,
        required: [true, "Please Type Service"],
    },
    service_price: {
        type: Number,
        default: 0,
    },
    tax_rate: {
        type: Number,
        default: 0,
    },
    taxable: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        default: 0,
    },
    sales: {
        type: Number,
        default: 0,
    },
    profit: {
        type: Number,
        default: 0,
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
passportSchema.plugin(mongoose_paginate_v2_1.default);
//Define Passport Model
var Passport = (0, mongoose_1.model)("Passport", passportSchema, "passports");
exports.default = Passport;
