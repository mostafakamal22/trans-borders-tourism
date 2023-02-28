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
exports.deleteInvoice = exports.createInvoice = exports.getInvoices = void 0;
var invoiceModel_1 = __importDefault(require("../models/invoiceModel"));
//@Desc   >>>> Get All Invoices That Match Query Object.
//@Route  >>>> POST /api/invoices/query
//@Access >>>> Private(Admins Only)
var getInvoices = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, option, queries, options, invoices;
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
                return [4 /*yield*/, invoiceModel_1.default.paginate(queries, options)];
            case 1:
                invoices = _b.sent();
                res.status(200).json(invoices);
                return [2 /*return*/];
        }
    });
}); };
exports.getInvoices = getInvoices;
//@Desc   >>>> Create Invoice
//@Route  >>>> POST /api/invoices
//@Access >>>> Private(Admins Only)
var createInvoice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var invoice;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, invoiceModel_1.default.create({
                    customer: (_a = req.body) === null || _a === void 0 ? void 0 : _a.customer,
                    details: (_b = req.body) === null || _b === void 0 ? void 0 : _b.details,
                    date: (_c = req.body) === null || _c === void 0 ? void 0 : _c.date,
                    subtotal: (_d = req.body) === null || _d === void 0 ? void 0 : _d.subtotal,
                    total: (_e = req.body) === null || _e === void 0 ? void 0 : _e.total,
                    ID: (_f = req.body) === null || _f === void 0 ? void 0 : _f.ID,
                    tax_due: (_g = req.body) === null || _g === void 0 ? void 0 : _g.taxDue,
                    tax_rate: (_h = req.body) === null || _h === void 0 ? void 0 : _h.taxRate,
                    taxable: (_j = req.body) === null || _j === void 0 ? void 0 : _j.taxable,
                    paid_amount: (_k = req.body) === null || _k === void 0 ? void 0 : _k.paidAmount,
                    remaining_amount: (_l = req.body) === null || _l === void 0 ? void 0 : _l.remainingAmount,
                    payment_method: (_m = req.body) === null || _m === void 0 ? void 0 : _m.paymentMethod,
                    other: (_o = req.body) === null || _o === void 0 ? void 0 : _o.other,
                })];
            case 1:
                invoice = _p.sent();
                res.status(201).json(invoice);
                return [2 /*return*/];
        }
    });
}); };
exports.createInvoice = createInvoice;
//@Desc   >>>> Delete one Invoice
//@Route  >>>> DELETE /api/invoices/:id
//@Access >>>> Private(Admins Only)
var deleteInvoice = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedInvoice;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, invoiceModel_1.default.findByIdAndDelete((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                deletedInvoice = _b.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedInvoice === null || deletedInvoice === void 0 ? void 0 : deletedInvoice.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    //Send Deleted Invoice id Back.
                    res.status(200).json({ id: deletedInvoice === null || deletedInvoice === void 0 ? void 0 : deletedInvoice.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteInvoice = deleteInvoice;
