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
exports.updatePaymentVoucher = exports.createPaymentVoucher = exports.deletePaymentVoucher = exports.getOnePaymentVoucher = exports.getPaymentVouchers = void 0;
var paymentVoucherModel_1 = __importDefault(require("../models/paymentVoucherModel"));
//@Desc   >>>> Get All PaymentVouchers That Match Query Object.
//@Route  >>>> POST /api/paymentVouchers/query
//@Access >>>> Private(Admins Only)
var getPaymentVouchers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, option, customerName, queries, options, paymentVouchers;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, query = _a.query, option = _a.option;
                customerName = (query === null || query === void 0 ? void 0 : query.customerName) ? query.customerName : "";
                queries = query
                    ? {
                        //Filter By Year, Month And Day.
                        $expr: {
                            $setEquals: [
                                [
                                    (query === null || query === void 0 ? void 0 : query.year) && {
                                        $year: "$payment_date",
                                    },
                                    (query === null || query === void 0 ? void 0 : query.month) && {
                                        $month: "$payment_date",
                                    },
                                    (query === null || query === void 0 ? void 0 : query.day) && {
                                        $dayOfMonth: "$payment_date",
                                    },
                                ],
                                [
                                    (query === null || query === void 0 ? void 0 : query.year) && (query === null || query === void 0 ? void 0 : query.year),
                                    (query === null || query === void 0 ? void 0 : query.month) && (query === null || query === void 0 ? void 0 : query.month),
                                    (query === null || query === void 0 ? void 0 : query.day) && (query === null || query === void 0 ? void 0 : query.day),
                                ],
                            ],
                        },
                        //Filter By PaymentVoucher Customer Name.
                        customer_name: new RegExp("".concat(customerName), "gi"),
                    }
                    : {};
                options = __assign({ pagination: query ? true : false, sort: {
                        createdAt: "desc",
                    } }, option);
                return [4 /*yield*/, paymentVoucherModel_1.default.paginate(queries, options)];
            case 1:
                paymentVouchers = _b.sent();
                res.status(200).json(paymentVouchers);
                return [2 /*return*/];
        }
    });
}); };
exports.getPaymentVouchers = getPaymentVouchers;
//@Desc   >>>> GET ONE PaymentVoucher
//@Route  >>>> GET /api/paymentVouchers/:id
//@Access >>>> Private(Admins Only)
var getOnePaymentVoucher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentVoucher, error;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, paymentVoucherModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                paymentVoucher = _b.sent();
                //Check if PaymentVoucher is not exist.
                if (!paymentVoucher) {
                    error = new Error();
                    error.name = "CastError";
                    error.path = "_id";
                    throw error;
                }
                else {
                    //Send PaymentVoucher.
                    res.status(200).json(paymentVoucher);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOnePaymentVoucher = getOnePaymentVoucher;
//@Desc   >>>> Create PaymentVoucher
//@Route  >>>> POST /api/paymentVouchers/
//@Access >>>> private(For Admins)
var createPaymentVoucher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentVoucher;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, paymentVoucherModel_1.default.create({
                    customer_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.customer_name,
                    bank: (_b = req.body) === null || _b === void 0 ? void 0 : _b.bank,
                    reference_number: (_c = req.body) === null || _c === void 0 ? void 0 : _c.reference_number,
                    being: (_d = req.body) === null || _d === void 0 ? void 0 : _d.being,
                    amount: (_e = req.body) === null || _e === void 0 ? void 0 : _e.amount,
                    payment_date: (_f = req.body) === null || _f === void 0 ? void 0 : _f.payment_date,
                })];
            case 1:
                paymentVoucher = _g.sent();
                res.status(201).json(paymentVoucher);
                return [2 /*return*/];
        }
    });
}); };
exports.createPaymentVoucher = createPaymentVoucher;
//@Desc   >>>> UPDATE PaymentVoucher
//@Route  >>>> PUT /api/paymentVouchers/:id
//@Access >>>> Private(for Admins)
var updatePaymentVoucher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var paymentVoucher, error, updatedPaymentVoucher;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, paymentVoucherModel_1.default.findById(req.params.id)];
            case 1:
                paymentVoucher = _g.sent();
                if (!!paymentVoucher) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update PaymentVoucher With New Values.
                paymentVoucher.customer_name = (_a = req.body) === null || _a === void 0 ? void 0 : _a.customer_name;
                paymentVoucher.bank = (_b = req.body) === null || _b === void 0 ? void 0 : _b.bank;
                paymentVoucher.reference_number = (_c = req.body) === null || _c === void 0 ? void 0 : _c.reference_number;
                paymentVoucher.being = (_d = req.body) === null || _d === void 0 ? void 0 : _d.being;
                paymentVoucher.amount = (_e = req.body) === null || _e === void 0 ? void 0 : _e.amount;
                paymentVoucher.payment_date = (_f = req.body) === null || _f === void 0 ? void 0 : _f.payment_date;
                return [4 /*yield*/, paymentVoucher.save()];
            case 3:
                updatedPaymentVoucher = _g.sent();
                res.status(200).json(updatedPaymentVoucher);
                _g.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePaymentVoucher = updatePaymentVoucher;
//@Desc   >>>> Delete one PaymentVoucher
//@Route  >>>> DELETE /api/paymentVouchers/:id
//@Access >>>> private(For Admins)
var deletePaymentVoucher = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedPaymentVoucher;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, paymentVoucherModel_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                deletedPaymentVoucher = _a.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedPaymentVoucher === null || deletedPaymentVoucher === void 0 ? void 0 : deletedPaymentVoucher.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    //Send Deleted PaymentVoucher id Back
                    res.status(200).json({ id: deletedPaymentVoucher.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deletePaymentVoucher = deletePaymentVoucher;
