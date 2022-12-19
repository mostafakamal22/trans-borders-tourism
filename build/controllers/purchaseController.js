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
exports.deletePurchase = exports.updatePurchase = exports.createPurchase = exports.getPurchases = void 0;
var purchaseModel_1 = __importDefault(require("../models/purchaseModel"));
//@desc   >>>> Get All Purchases
//@route  >>>> GET /api/Purchases
//@Access >>>> public(For Admins)
var getPurchases = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var Purchases;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, purchaseModel_1.default.find()];
            case 1:
                Purchases = _a.sent();
                res.status(200).json(Purchases);
                return [2 /*return*/];
        }
    });
}); };
exports.getPurchases = getPurchases;
//@desc   >>>> Create Purchase
//@route  >>>> POST /api/Purchases/
//@Access >>>> public(For Admins)
var createPurchase = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var purchase;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, purchaseModel_1.default.create({
                    purchase_types: (_a = req.body) === null || _a === void 0 ? void 0 : _a.purchaseTypes,
                    total: (_b = req.body) === null || _b === void 0 ? void 0 : _b.total,
                    date: (_c = req.body) === null || _c === void 0 ? void 0 : _c.purchaseDate,
                })];
            case 1:
                purchase = _d.sent();
                res.status(201).json(purchase);
                return [2 /*return*/];
        }
    });
}); };
exports.createPurchase = createPurchase;
//@desc   >>>> UPDATE Purchase
//@route  >>>> PUT /api/Purchases/:id
//@Access >>>> Public(for Admins)
var updatePurchase = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var purchase, error, updatedPurchase;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, purchaseModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                purchase = _b.sent();
                if (!!purchase) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Purchase With New Values.
                purchase.total = req.body.total;
                purchase.purchase_types = req.body.purchaseTypes;
                purchase.date = req.body.purchaseDate;
                return [4 /*yield*/, purchase.save()];
            case 3:
                updatedPurchase = _b.sent();
                res.status(200).json(updatedPurchase);
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updatePurchase = updatePurchase;
//@desc   >>>> Delete one Purchase
//@route  >>>> DELETE /api/Purchases/:id
//@Access >>>> public(For Admins)
var deletePurchase = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedPurchase;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, purchaseModel_1.default.findByIdAndDelete((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                deletedPurchase = _b.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedPurchase === null || deletedPurchase === void 0 ? void 0 : deletedPurchase.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    res.status(200).json({ id: deletedPurchase.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deletePurchase = deletePurchase;
