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
exports.updateBank = exports.createBank = exports.deleteBank = exports.getBanks = void 0;
var bankModel_1 = __importDefault(require("../models/bankModel"));
//@desc   >>>> Get All Bank
//@route  >>>> GET /api/banks
//@Access >>>> public(For Admins)
var getBanks = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var banks;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bankModel_1.default.find()];
            case 1:
                banks = _a.sent();
                res.status(200).json(banks);
                return [2 /*return*/];
        }
    });
}); };
exports.getBanks = getBanks;
//@desc   >>>> Create Bank
//@route  >>>> POST /api/banks/
//@Access >>>> public(For Admins)
var createBank = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bank;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4 /*yield*/, bankModel_1.default.create({
                    customer_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
                    account_id: (_b = req.body) === null || _b === void 0 ? void 0 : _b.accountId,
                    process_no: (_c = req.body) === null || _c === void 0 ? void 0 : _c.processNo,
                    total: (_d = req.body) === null || _d === void 0 ? void 0 : _d.total,
                    type: (_e = req.body) === null || _e === void 0 ? void 0 : _e.type,
                    payment_date: (_f = req.body) === null || _f === void 0 ? void 0 : _f.paymentDate,
                })];
            case 1:
                bank = _g.sent();
                res.status(201).json(bank);
                return [2 /*return*/];
        }
    });
}); };
exports.createBank = createBank;
//@desc   >>>> UPDATE Bank
//@route  >>>> PUT /api/banks/:id
//@Access >>>> Public(for Admins)
var updateBank = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var bank, error, updatedBank;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0: return [4 /*yield*/, bankModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                bank = _h.sent();
                if (!!bank) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Bank with new values
                bank.customer_name = (_b = req.body) === null || _b === void 0 ? void 0 : _b.name;
                bank.account_id = (_c = req.body) === null || _c === void 0 ? void 0 : _c.accountId;
                bank.process_no = (_d = req.body) === null || _d === void 0 ? void 0 : _d.processNo;
                bank.total = (_e = req.body) === null || _e === void 0 ? void 0 : _e.total;
                bank.type = (_f = req.body) === null || _f === void 0 ? void 0 : _f.type;
                bank.payment_date = (_g = req.body) === null || _g === void 0 ? void 0 : _g.paymentDate;
                return [4 /*yield*/, bank.save()];
            case 3:
                updatedBank = _h.sent();
                res.status(200).json(updatedBank);
                _h.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateBank = updateBank;
//@desc   >>>> Delete one Bank
//@route  >>>> DELETE /api/bank/:id
//@Access >>>> public(For Admins)
var deleteBank = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedBank;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, bankModel_1.default.findByIdAndDelete((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                deletedBank = _b.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedBank === null || deletedBank === void 0 ? void 0 : deletedBank.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    res.status(200).json({ id: deletedBank === null || deletedBank === void 0 ? void 0 : deletedBank.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteBank = deleteBank;
