"use strict";
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
exports.updateVisa = exports.createVisa = exports.deleteVisa = exports.getVisas = void 0;
var visaModel_js_1 = __importDefault(require("../models/visaModel.js"));
//@desc   >>>> Get All Visas
//@route  >>>> GET /api/visas
//@Access >>>> public(For Admins)
var getVisas = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var visas;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visaModel_js_1.default.find()];
            case 1:
                visas = _a.sent();
                res.status(200).json(visas);
                return [2 /*return*/];
        }
    });
}); };
exports.getVisas = getVisas;
//@desc   >>>> Create Visa
//@route  >>>> POST /api/visas/
//@Access >>>> public(For Admins)
var createVisa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var visa;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, visaModel_js_1.default.create({
                    customer_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
                    passport_id: (_b = req.body) === null || _b === void 0 ? void 0 : _b.passportId,
                    provider: (_c = req.body) === null || _c === void 0 ? void 0 : _c.provider,
                    sponsor: (_d = req.body) === null || _d === void 0 ? void 0 : _d.sponsor,
                    type: (_e = req.body) === null || _e === void 0 ? void 0 : _e.type,
                    employee: (_f = req.body) === null || _f === void 0 ? void 0 : _f.employee,
                    net_fare: (_g = req.body) === null || _g === void 0 ? void 0 : _g.netFare,
                    sales: (_h = req.body) === null || _h === void 0 ? void 0 : _h.sales,
                    profit: (_j = req.body) === null || _j === void 0 ? void 0 : _j.profit,
                    payment_date: (_k = req.body) === null || _k === void 0 ? void 0 : _k.paymentDate,
                    paid_amount: (_l = req.body) === null || _l === void 0 ? void 0 : _l.paidAmount,
                    remaining_amount: (_m = req.body) === null || _m === void 0 ? void 0 : _m.remainingAmount,
                    payment_method: (_o = req.body) === null || _o === void 0 ? void 0 : _o.paymentMethod,
                })];
            case 1:
                visa = _p.sent();
                res.status(201).json(visa);
                return [2 /*return*/];
        }
    });
}); };
exports.createVisa = createVisa;
//@desc   >>>> UPDATE Visa
//@route  >>>> PUT /api/visas/:id
//@Access >>>> Public(for Admins)
var updateVisa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var visa, error, updatedVisa;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, visaModel_js_1.default.findById(req.params.id)];
            case 1:
                visa = _p.sent();
                if (!!visa) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Visa With New Values.
                visa.customer_name = (_a = req.body) === null || _a === void 0 ? void 0 : _a.name;
                visa.passport_id = (_b = req.body) === null || _b === void 0 ? void 0 : _b.passportId;
                visa.provider = (_c = req.body) === null || _c === void 0 ? void 0 : _c.provider;
                visa.type = (_d = req.body) === null || _d === void 0 ? void 0 : _d.type;
                visa.employee = (_e = req.body) === null || _e === void 0 ? void 0 : _e.employee;
                visa.sponsor = (_f = req.body) === null || _f === void 0 ? void 0 : _f.sponsor;
                visa.net_fare = (_g = req.body) === null || _g === void 0 ? void 0 : _g.netFare;
                visa.sales = (_h = req.body) === null || _h === void 0 ? void 0 : _h.sales;
                visa.profit = (_j = req.body) === null || _j === void 0 ? void 0 : _j.profit;
                visa.payment_date = (_k = req.body) === null || _k === void 0 ? void 0 : _k.paymentDate;
                visa.paid_amount = (_l = req.body) === null || _l === void 0 ? void 0 : _l.paidAmount;
                visa.remaining_amount = (_m = req.body) === null || _m === void 0 ? void 0 : _m.remainingAmount;
                visa.payment_method = (_o = req.body) === null || _o === void 0 ? void 0 : _o.paymentMethod;
                return [4 /*yield*/, visa.save()];
            case 3:
                updatedVisa = _p.sent();
                res.status(200).json(updatedVisa);
                _p.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateVisa = updateVisa;
//@desc   >>>> Delete one Visa
//@route  >>>> DELETE /api/Visaa/:id
//@Access >>>> public(For Admins)
var deleteVisa = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedVisa;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, visaModel_js_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                deletedVisa = _a.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedVisa === null || deletedVisa === void 0 ? void 0 : deletedVisa.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    res.status(200).json({ id: deletedVisa.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteVisa = deleteVisa;
