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
exports.getPassports = exports.deletePassport = exports.createPassport = exports.updatePassport = void 0;
var passportModel_1 = __importDefault(require("../models/passportModel"));
//@desc   >>>> Get All Passports
//@route  >>>> GET /api/passports
//@Access >>>> public(For Admins)
var getPassports = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passports;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, passportModel_1.default.find()];
            case 1:
                passports = _a.sent();
                res.status(200).json(passports);
                return [2 /*return*/];
        }
    });
}); };
exports.getPassports = getPassports;
//@desc   >>>> Create Passport
//@route  >>>> POST /api/passports
//@Access >>>> public(For Admins)
var createPassport = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passport;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
        switch (_o.label) {
            case 0: return [4 /*yield*/, passportModel_1.default.create({
                    customer_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
                    customer_nationality: (_b = req.body) === null || _b === void 0 ? void 0 : _b.nationality,
                    passport_id: (_c = req.body) === null || _c === void 0 ? void 0 : _c.passportId,
                    state: (_d = req.body) === null || _d === void 0 ? void 0 : _d.state,
                    service: (_e = req.body) === null || _e === void 0 ? void 0 : _e.service,
                    service_price: (_f = req.body) === null || _f === void 0 ? void 0 : _f.servicePrice,
                    taxable: (_g = req.body) === null || _g === void 0 ? void 0 : _g.taxable,
                    tax_rate: (_h = req.body) === null || _h === void 0 ? void 0 : _h.taxRate,
                    total: (_j = req.body) === null || _j === void 0 ? void 0 : _j.total,
                    sales: (_k = req.body) === null || _k === void 0 ? void 0 : _k.sales,
                    profit: (_l = req.body) === null || _l === void 0 ? void 0 : _l.profit,
                    payment_date: (_m = req.body) === null || _m === void 0 ? void 0 : _m.paymentDate,
                })];
            case 1:
                passport = _o.sent();
                res.status(201).json(passport);
                return [2 /*return*/];
        }
    });
}); };
exports.createPassport = createPassport;
//@desc   >>>> UPDATE Passport
//@route  >>>> PUT /api/passports/:id
//@Access >>>> Public(for Admins)
var updatePassport = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passport, error, updatedPassport;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, passportModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                passport = _p.sent();
                if (!!passport) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Passport With New Values.
                passport.customer_name = (_b = req.body) === null || _b === void 0 ? void 0 : _b.name;
                passport.customer_nationality = (_c = req.body) === null || _c === void 0 ? void 0 : _c.nationality;
                passport.passport_id = (_d = req.body) === null || _d === void 0 ? void 0 : _d.passportId;
                passport.state = (_e = req.body) === null || _e === void 0 ? void 0 : _e.state;
                passport.service = (_f = req.body) === null || _f === void 0 ? void 0 : _f.service;
                passport.payment_date = (_g = req.body) === null || _g === void 0 ? void 0 : _g.paymentDate;
                passport.taxable = (_h = req.body) === null || _h === void 0 ? void 0 : _h.taxable;
                passport.tax_rate = (_j = req.body) === null || _j === void 0 ? void 0 : _j.taxRate;
                passport.service_price = (_k = req.body) === null || _k === void 0 ? void 0 : _k.servicePrice;
                passport.total = (_l = req.body) === null || _l === void 0 ? void 0 : _l.total;
                passport.sales = (_m = req.body) === null || _m === void 0 ? void 0 : _m.sales;
                passport.profit = (_o = req.body) === null || _o === void 0 ? void 0 : _o.profit;
                return [4 /*yield*/, passport.save()];
            case 3:
                updatedPassport = _p.sent();
                res.status(200).json(updatedPassport);
                _p.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePassport = updatePassport;
//@desc   >>>> Delete one Passport
//@route  >>>> DELETE /api/passports/:id
//@Access >>>> public(For Admins)
var deletePassport = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedPassport;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, passportModel_1.default.findByIdAndDelete((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                deletedPassport = _b.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedPassport === null || deletedPassport === void 0 ? void 0 : deletedPassport.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    res.status(200).json({ id: deletedPassport.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deletePassport = deletePassport;
