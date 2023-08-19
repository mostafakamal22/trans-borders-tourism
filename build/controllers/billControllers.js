"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBill = exports.deleteBill = exports.createBill = exports.getBills = void 0;
var billModel_1 = __importDefault(require("../models/billModel"));
var passportModel_1 = __importDefault(require("../models/passportModel"));
var ticketModel_1 = __importDefault(require("../models/ticketModel"));
//@Desc   >>>> Get All Bills That Match Query Object.
//@Route  >>>> POST /api/bills/query
//@Access >>>> Private(Admins Only)
var getBills = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, option, queries, options, bills;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, query = _a.query, option = _a.option;
                queries = query
                    ? {
                        //Filter By Customer Name.
                        "customer.name": new RegExp("".concat(query === null || query === void 0 ? void 0 : query.name), "gi"),
                    }
                    : {};
                options = __assign({ pagination: query ? true : false, sort: { createdAt: "desc" } }, option);
                return [4 /*yield*/, billModel_1.default.paginate(queries, options)];
            case 1:
                bills = _b.sent();
                res.status(200).json(bills);
                return [2 /*return*/];
        }
    });
}); };
exports.getBills = getBills;
//@Desc   >>>> Create Bill
//@Route  >>>> POST /api/bills
//@Access >>>> Private(Admins Only)
var createBill = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bill, details, _loop_1, index, updatedBill;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32, _33, _34, _35;
    return __generator(this, function (_36) {
        switch (_36.label) {
            case 0: return [4 /*yield*/, billModel_1.default.create({
                    customer: (_a = req.body) === null || _a === void 0 ? void 0 : _a.customer,
                    details: (_b = req.body) === null || _b === void 0 ? void 0 : _b.details,
                    date: (_c = req.body) === null || _c === void 0 ? void 0 : _c.date,
                    subtotal: (_d = req.body) === null || _d === void 0 ? void 0 : _d.subtotal,
                    total: (_e = req.body) === null || _e === void 0 ? void 0 : _e.total,
                    tax_due: (_f = req.body) === null || _f === void 0 ? void 0 : _f.taxDue,
                    tax_rate: (_g = req.body) === null || _g === void 0 ? void 0 : _g.taxRate,
                    taxable: (_h = req.body) === null || _h === void 0 ? void 0 : _h.taxable,
                    paid_amount: (_j = req.body) === null || _j === void 0 ? void 0 : _j.paidAmount,
                    remaining_amount: (_k = req.body) === null || _k === void 0 ? void 0 : _k.remainingAmount,
                    payment_method: (_l = req.body) === null || _l === void 0 ? void 0 : _l.paymentMethod,
                    other: (_m = req.body) === null || _m === void 0 ? void 0 : _m.other,
                })];
            case 1:
                bill = _36.sent();
                details = req.body.details;
                if (!details)
                    throw new Error("Bill Details is required");
                _loop_1 = function (index) {
                    var passport_1, ticket_1;
                    return __generator(this, function (_37) {
                        switch (_37.label) {
                            case 0:
                                if (!(((_o = details[index]) === null || _o === void 0 ? void 0 : _o.type) === "Passport")) return [3 /*break*/, 2];
                                return [4 /*yield*/, passportModel_1.default.create({
                                        customer_name: (_q = (_p = details[index]) === null || _p === void 0 ? void 0 : _p.data) === null || _q === void 0 ? void 0 : _q.name,
                                        customer_nationality: (_s = (_r = details[index]) === null || _r === void 0 ? void 0 : _r.data) === null || _s === void 0 ? void 0 : _s.nationality,
                                        passport_id: (_u = (_t = details[index]) === null || _t === void 0 ? void 0 : _t.data) === null || _u === void 0 ? void 0 : _u.passportId,
                                        state: (_w = (_v = details[index]) === null || _v === void 0 ? void 0 : _v.data) === null || _w === void 0 ? void 0 : _w.state,
                                        service: (_y = (_x = details[index]) === null || _x === void 0 ? void 0 : _x.data) === null || _y === void 0 ? void 0 : _y.service,
                                        service_price: (_0 = (_z = details[index]) === null || _z === void 0 ? void 0 : _z.data) === null || _0 === void 0 ? void 0 : _0.servicePrice,
                                        taxable: (_2 = (_1 = details[index]) === null || _1 === void 0 ? void 0 : _1.data) === null || _2 === void 0 ? void 0 : _2.taxable,
                                        tax_rate: (_4 = (_3 = details[index]) === null || _3 === void 0 ? void 0 : _3.data) === null || _4 === void 0 ? void 0 : _4.taxRate,
                                        total: (_6 = (_5 = details[index]) === null || _5 === void 0 ? void 0 : _5.data) === null || _6 === void 0 ? void 0 : _6.total,
                                        sales: (_8 = (_7 = details[index]) === null || _7 === void 0 ? void 0 : _7.data) === null || _8 === void 0 ? void 0 : _8.sales,
                                        profit: (_10 = (_9 = details[index]) === null || _9 === void 0 ? void 0 : _9.data) === null || _10 === void 0 ? void 0 : _10.profit,
                                        payment_date: (_12 = (_11 = details[index]) === null || _11 === void 0 ? void 0 : _11.data) === null || _12 === void 0 ? void 0 : _12.paymentDate,
                                    })];
                            case 1:
                                passport_1 = _37.sent();
                                bill.details.map(function (item, i) {
                                    if (index === i) {
                                        item.data = __assign({}, item.data);
                                        item.passport_ref = passport_1.id;
                                    }
                                    else
                                        return item;
                                });
                                return [3 /*break*/, 4];
                            case 2:
                                if (!(((_13 = details[index]) === null || _13 === void 0 ? void 0 : _13.type) === "Ticket")) return [3 /*break*/, 4];
                                return [4 /*yield*/, ticketModel_1.default.create({
                                        customer_name: (_15 = (_14 = details[index]) === null || _14 === void 0 ? void 0 : _14.data) === null || _15 === void 0 ? void 0 : _15.name,
                                        employee: (_17 = (_16 = details[index]) === null || _16 === void 0 ? void 0 : _16.data) === null || _17 === void 0 ? void 0 : _17.employee,
                                        supplier: (_19 = (_18 = details[index]) === null || _18 === void 0 ? void 0 : _18.data) === null || _19 === void 0 ? void 0 : _19.supplier,
                                        type: (_21 = (_20 = details[index]) === null || _20 === void 0 ? void 0 : _20.data) === null || _21 === void 0 ? void 0 : _21.type,
                                        cost: (_23 = (_22 = details[index]) === null || _22 === void 0 ? void 0 : _22.data) === null || _23 === void 0 ? void 0 : _23.cost,
                                        sales: (_25 = (_24 = details[index]) === null || _24 === void 0 ? void 0 : _24.data) === null || _25 === void 0 ? void 0 : _25.sales,
                                        profit: (_27 = (_26 = details[index]) === null || _26 === void 0 ? void 0 : _26.data) === null || _27 === void 0 ? void 0 : _27.profit,
                                        payment_date: (_29 = (_28 = details[index]) === null || _28 === void 0 ? void 0 : _28.data) === null || _29 === void 0 ? void 0 : _29.paymentDate,
                                        paid_amount: (_31 = (_30 = details[index]) === null || _30 === void 0 ? void 0 : _30.data) === null || _31 === void 0 ? void 0 : _31.paidAmount,
                                        remaining_amount: (_33 = (_32 = details[index]) === null || _32 === void 0 ? void 0 : _32.data) === null || _33 === void 0 ? void 0 : _33.remainingAmount,
                                        payment_method: (_35 = (_34 = details[index]) === null || _34 === void 0 ? void 0 : _34.data) === null || _35 === void 0 ? void 0 : _35.paymentMethod,
                                    })];
                            case 3:
                                ticket_1 = _37.sent();
                                bill.details.map(function (item, i) {
                                    if (index === i) {
                                        item.data = __assign({}, item.data);
                                        item.ticket_ref = ticket_1.id;
                                    }
                                    else
                                        return item;
                                });
                                _37.label = 4;
                            case 4: return [2 /*return*/];
                        }
                    });
                };
                index = 0;
                _36.label = 2;
            case 2:
                if (!(index < details.length)) return [3 /*break*/, 5];
                return [5 /*yield**/, _loop_1(index)];
            case 3:
                _36.sent();
                _36.label = 4;
            case 4:
                index++;
                return [3 /*break*/, 2];
            case 5: return [4 /*yield*/, bill.save()];
            case 6:
                updatedBill = _36.sent();
                res.status(201).json(updatedBill);
                return [2 /*return*/];
        }
    });
}); };
exports.createBill = createBill;
//@Desc   >>>> UPDATE Bill
//@Route  >>>> PUT /api/bills/:id
//@Access >>>> Private(Admins Only)
var updateBill = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bill, error, updatedBill, details, index, passport, ticket;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26;
    return __generator(this, function (_27) {
        switch (_27.label) {
            case 0: return [4 /*yield*/, billModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                bill = _27.sent();
                if (!!bill) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Bill With New Values.
                (bill.customer = (_b = req.body) === null || _b === void 0 ? void 0 : _b.customer),
                    (bill.details = (_c = req.body) === null || _c === void 0 ? void 0 : _c.details),
                    (bill.date = (_d = req.body) === null || _d === void 0 ? void 0 : _d.date),
                    (bill.subtotal = (_e = req.body) === null || _e === void 0 ? void 0 : _e.subtotal),
                    (bill.total = (_f = req.body) === null || _f === void 0 ? void 0 : _f.total),
                    (bill.tax_due = (_g = req.body) === null || _g === void 0 ? void 0 : _g.taxDue),
                    (bill.tax_rate = (_h = req.body) === null || _h === void 0 ? void 0 : _h.taxRate),
                    (bill.taxable = (_j = req.body) === null || _j === void 0 ? void 0 : _j.taxable),
                    (bill.paid_amount = (_k = req.body) === null || _k === void 0 ? void 0 : _k.paidAmount),
                    (bill.remaining_amount = (_l = req.body) === null || _l === void 0 ? void 0 : _l.remainingAmount),
                    (bill.payment_method = (_m = req.body) === null || _m === void 0 ? void 0 : _m.paymentMethod),
                    (bill.other = (_o = req.body) === null || _o === void 0 ? void 0 : _o.other);
                return [4 /*yield*/, bill.save()];
            case 3:
                updatedBill = _27.sent();
                details = req.body.details;
                if (!details)
                    throw new Error("Bill Details is required");
                index = 0;
                _27.label = 4;
            case 4:
                if (!(index < details.length)) return [3 /*break*/, 14];
                if (!(((_p = details[index]) === null || _p === void 0 ? void 0 : _p.type) === "Passport")) return [3 /*break*/, 9];
                return [4 /*yield*/, passportModel_1.default.findById((_q = details[index]) === null || _q === void 0 ? void 0 : _q.passport_ref)];
            case 5:
                passport = _27.sent();
                if (!!passport) return [3 /*break*/, 6];
                // const error: ErrnoException = new Error();
                // error.name = "CastError";
                // error.path = "_id";
                // throw error;
                console.log("Passport Not found");
                return [3 /*break*/, 8];
            case 6:
                //Update Passport With New Values.
                passport.customer_name = (_r = details[index]) === null || _r === void 0 ? void 0 : _r.data.name;
                passport.customer_nationality = (_s = details[index]) === null || _s === void 0 ? void 0 : _s.data.nationality;
                passport.passport_id = (_t = details[index]) === null || _t === void 0 ? void 0 : _t.data.passportId;
                passport.state = (_u = details[index]) === null || _u === void 0 ? void 0 : _u.data.state;
                passport.service = (_v = details[index]) === null || _v === void 0 ? void 0 : _v.data.service;
                passport.payment_date = (_w = details[index]) === null || _w === void 0 ? void 0 : _w.data.paymentDate;
                passport.taxable = (_x = details[index]) === null || _x === void 0 ? void 0 : _x.data.taxable;
                passport.tax_rate = (_y = details[index]) === null || _y === void 0 ? void 0 : _y.data.taxRate;
                passport.service_price = (_z = details[index]) === null || _z === void 0 ? void 0 : _z.data.servicePrice;
                passport.total = (_0 = details[index]) === null || _0 === void 0 ? void 0 : _0.data.total;
                passport.sales = (_1 = details[index]) === null || _1 === void 0 ? void 0 : _1.data.sales;
                passport.profit = (_2 = details[index]) === null || _2 === void 0 ? void 0 : _2.data.profit;
                return [4 /*yield*/, passport.save()];
            case 7:
                _27.sent();
                _27.label = 8;
            case 8: return [3 /*break*/, 13];
            case 9:
                if (!(((_3 = details[index]) === null || _3 === void 0 ? void 0 : _3.type) === "Ticket")) return [3 /*break*/, 13];
                return [4 /*yield*/, ticketModel_1.default.findById((_4 = details[index]) === null || _4 === void 0 ? void 0 : _4.ticket_ref)];
            case 10:
                ticket = _27.sent();
                if (!!ticket) return [3 /*break*/, 11];
                // const error: ErrnoException = new Error();
                // error.name = "CastError";
                // error.path = "_id";
                // throw error;
                console.log("Ticket Not found");
                return [3 /*break*/, 13];
            case 11:
                //Update Ticket With New Values.
                ticket.customer_name = (_6 = (_5 = details[index]) === null || _5 === void 0 ? void 0 : _5.data) === null || _6 === void 0 ? void 0 : _6.name;
                ticket.supplier = (_8 = (_7 = details[index]) === null || _7 === void 0 ? void 0 : _7.data) === null || _8 === void 0 ? void 0 : _8.supplier;
                ticket.employee = (_10 = (_9 = details[index]) === null || _9 === void 0 ? void 0 : _9.data) === null || _10 === void 0 ? void 0 : _10.employee;
                ticket.type = (_12 = (_11 = details[index]) === null || _11 === void 0 ? void 0 : _11.data) === null || _12 === void 0 ? void 0 : _12.type;
                ticket.cost = (_14 = (_13 = details[index]) === null || _13 === void 0 ? void 0 : _13.data) === null || _14 === void 0 ? void 0 : _14.cost;
                ticket.sales = (_16 = (_15 = details[index]) === null || _15 === void 0 ? void 0 : _15.data) === null || _16 === void 0 ? void 0 : _16.sales;
                ticket.profit = (_18 = (_17 = details[index]) === null || _17 === void 0 ? void 0 : _17.data) === null || _18 === void 0 ? void 0 : _18.profit;
                ticket.payment_date = (_20 = (_19 = details[index]) === null || _19 === void 0 ? void 0 : _19.data) === null || _20 === void 0 ? void 0 : _20.paymentDate;
                ticket.paid_amount = (_22 = (_21 = details[index]) === null || _21 === void 0 ? void 0 : _21.data) === null || _22 === void 0 ? void 0 : _22.paidAmount;
                ticket.remaining_amount = (_24 = (_23 = details[index]) === null || _23 === void 0 ? void 0 : _23.data) === null || _24 === void 0 ? void 0 : _24.remainingAmount;
                ticket.payment_method = (_26 = (_25 = details[index]) === null || _25 === void 0 ? void 0 : _25.data) === null || _26 === void 0 ? void 0 : _26.paymentMethod;
                return [4 /*yield*/, ticket.save()];
            case 12:
                _27.sent();
                _27.label = 13;
            case 13:
                index++;
                return [3 /*break*/, 4];
            case 14:
                res.status(200).json(updatedBill);
                _27.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); };
exports.updateBill = updateBill;
//@Desc   >>>> Delete one Bill
//@Route  >>>> DELETE /api/bills/:id
//@Access >>>> Private(Admins Only)
var deleteBill = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bill, error, details, index, deletedPassport, deletedTicket, deletedBill;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, billModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                bill = _g.sent();
                if (!!bill) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                details = bill.details;
                if (!details)
                    throw new Error("Bill Details is required");
                index = 0;
                _g.label = 3;
            case 3:
                if (!(index < details.length)) return [3 /*break*/, 8];
                if (!(((_b = details[index]) === null || _b === void 0 ? void 0 : _b.type) === "Passport")) return [3 /*break*/, 5];
                return [4 /*yield*/, passportModel_1.default.findByIdAndDelete((_c = details[index]) === null || _c === void 0 ? void 0 : _c.passport_ref)];
            case 4:
                deletedPassport = _g.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedPassport === null || deletedPassport === void 0 ? void 0 : deletedPassport.id)) {
                    console.log("This Passport Has Been Already Deleted!");
                }
                return [3 /*break*/, 7];
            case 5:
                if (!(((_d = details[index]) === null || _d === void 0 ? void 0 : _d.type) === "Ticket")) return [3 /*break*/, 7];
                return [4 /*yield*/, ticketModel_1.default.findByIdAndDelete((_e = details[index]) === null || _e === void 0 ? void 0 : _e.ticket_ref)];
            case 6:
                deletedTicket = _g.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedTicket === null || deletedTicket === void 0 ? void 0 : deletedTicket.id)) {
                    console.log("This Ticket Has Been Already Deleted!");
                }
                _g.label = 7;
            case 7:
                index++;
                return [3 /*break*/, 3];
            case 8: return [4 /*yield*/, billModel_1.default.findByIdAndDelete((_f = req.params) === null || _f === void 0 ? void 0 : _f.id)];
            case 9:
                deletedBill = _g.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedBill === null || deletedBill === void 0 ? void 0 : deletedBill.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    //Send Deleted Bill id Back.
                    res.status(200).json({ id: deletedBill === null || deletedBill === void 0 ? void 0 : deletedBill.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteBill = deleteBill;
