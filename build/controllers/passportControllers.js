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
exports.getPassportsStatistics = exports.deletePassport = exports.updatePassport = exports.createPassport = exports.getOnePassport = exports.getPassports = void 0;
var passportModel_1 = __importDefault(require("../models/passportModel"));
var node_cache_1 = __importDefault(require("../lib/node-cache"));
var billModel_1 = __importDefault(require("../models/billModel"));
var passports_1 = require("../calculations/passports");
//@Desc   >>>> Get All Passports That Match Query Object.
//@Route  >>>> POST /api/passports/query
//@Access >>>> Private(Admins Only)
var getPassports = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, option, queries, options, passports, passportsWithBillId;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, query = _a.query, option = _a.option;
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
                        //Filter By Customer Nationality.
                        customer_nationality: new RegExp("".concat(query === null || query === void 0 ? void 0 : query.nationality), "gi"),
                        //Filter By Passport State.
                        state: new RegExp("".concat(query === null || query === void 0 ? void 0 : query.state.join("|"))),
                        //Filter By Passport Service.
                        service: new RegExp("".concat(query === null || query === void 0 ? void 0 : query.service.join("|"))),
                    }
                    : {};
                options = __assign({ pagination: query ? true : false, sort: { payment_date: "desc", createdAt: "desc" } }, option);
                return [4 /*yield*/, passportModel_1.default.paginate(queries, options)];
            case 1:
                passports = _b.sent();
                return [4 /*yield*/, Promise.all(passports.docs.map(function (passport) { return __awaiter(void 0, void 0, void 0, function () {
                        var bill;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, billModel_1.default.findOne({
                                        "details.passport_ref": passport.id,
                                    })];
                                case 1:
                                    bill = _a.sent();
                                    return [2 /*return*/, __assign(__assign({}, passport), { bill_id: bill ? bill.ID : null })];
                            }
                        });
                    }); }))];
            case 2:
                passportsWithBillId = _b.sent();
                // Send the response
                res.status(200).json(__assign(__assign({}, passports), { docs: passportsWithBillId }));
                return [2 /*return*/];
        }
    });
}); };
exports.getPassports = getPassports;
//@Desc   >>>> GET ONE Passport
//@Route  >>>> GET /api/passports/:id
//@Access >>>> Private(Admins Only)
var getOnePassport = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var passport, error;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, passportModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                passport = _b.sent();
                //Check if Passport is not exist.
                if (!passport) {
                    error = new Error();
                    error.name = "CastError";
                    error.path = "_id";
                    throw error;
                }
                else {
                    //Send Passport.
                    res.status(200).json(passport);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOnePassport = getOnePassport;
//@Desc   >>>> Create Passport
//@Route  >>>> POST /api/passports
//@Access >>>> Private(Admins Only)
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
//@Desc   >>>> UPDATE Passport
//@Route  >>>> PUT /api/passports/:id
//@Access >>>> Private(Admins Only)
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
//@Desc   >>>> Delete one Passport
//@Route  >>>> DELETE /api/passports/:id
//@Access >>>> Private(Admins Only)
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
                    //Send Deleted Passport id Back.
                    res.status(200).json({ id: deletedPassport.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deletePassport = deletePassport;
//@Desc   >>>> Get Passports Statistics.
//@Route  >>>> GET /api/passports/statistics
//@Access >>>> Private(Admins Only)
var getPassportsStatistics = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedStatistics, passports, statistics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedStatistics = node_cache_1.default.get("passports-statistics");
                if (!cachedStatistics) return [3 /*break*/, 1];
                // If statistics are cached, return them
                res.status(200).json(cachedStatistics);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, passportModel_1.default.find({})];
            case 2:
                passports = _a.sent();
                statistics = (0, passports_1.passportsChartsCalculations)(passports);
                // Cache the statistics with an expiration time (e.g., one day)
                node_cache_1.default.set("passports-statistics", statistics, 86400); // 86400 seconds = 1 day
                // Send the response with the calculated statistics
                res.status(200).json(statistics);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getPassportsStatistics = getPassportsStatistics;
