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
exports.updateTicket = exports.createTicket = exports.deleteTicket = exports.getTickets = void 0;
var ticketModel_1 = __importDefault(require("../models/ticketModel"));
//@desc   >>>> Get All Tickets
//@route  >>>> GET /api/tickets
//@Access >>>> public(For Admins)
var getTickets = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var tickets;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ticketModel_1.default.find()];
            case 1:
                tickets = _a.sent();
                res.status(200).json(tickets);
                return [2 /*return*/];
        }
    });
}); };
exports.getTickets = getTickets;
//@desc   >>>> Create Ticket
//@route  >>>> POST /api/tickets/
//@Access >>>> public(For Admins)
var createTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, ticketModel_1.default.create({
                    customer_name: (_a = req.body) === null || _a === void 0 ? void 0 : _a.name,
                    employee: (_b = req.body) === null || _b === void 0 ? void 0 : _b.employee,
                    supplier: (_c = req.body) === null || _c === void 0 ? void 0 : _c.supplier,
                    type: (_d = req.body) === null || _d === void 0 ? void 0 : _d.type,
                    cost: (_e = req.body) === null || _e === void 0 ? void 0 : _e.cost,
                    sales: (_f = req.body) === null || _f === void 0 ? void 0 : _f.sales,
                    profit: (_g = req.body) === null || _g === void 0 ? void 0 : _g.profit,
                    payment_date: (_h = req.body) === null || _h === void 0 ? void 0 : _h.paymentDate,
                    paid_amount: (_j = req.body) === null || _j === void 0 ? void 0 : _j.paidAmount,
                    remaining_amount: (_k = req.body) === null || _k === void 0 ? void 0 : _k.remainingAmount,
                    payment_method: (_l = req.body) === null || _l === void 0 ? void 0 : _l.paymentMethod,
                })];
            case 1:
                ticket = _m.sent();
                res.status(201).json(ticket);
                return [2 /*return*/];
        }
    });
}); };
exports.createTicket = createTicket;
//@desc   >>>> UPDATE Ticket
//@route  >>>> PUT /api/tickets/:id
//@Access >>>> Public(for Admins)
var updateTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, error, updatedTicket;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0: return [4 /*yield*/, ticketModel_1.default.findById(req.params.id)];
            case 1:
                ticket = _m.sent();
                if (!!ticket) return [3 /*break*/, 2];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 2:
                //Update Ticket With New Values.
                ticket.customer_name = (_a = req.body) === null || _a === void 0 ? void 0 : _a.name;
                ticket.supplier = (_b = req.body) === null || _b === void 0 ? void 0 : _b.supplier;
                ticket.employee = (_c = req.body) === null || _c === void 0 ? void 0 : _c.employee;
                ticket.type = (_d = req.body) === null || _d === void 0 ? void 0 : _d.type;
                ticket.cost = (_e = req.body) === null || _e === void 0 ? void 0 : _e.cost;
                ticket.sales = (_f = req.body) === null || _f === void 0 ? void 0 : _f.sales;
                ticket.profit = (_g = req.body) === null || _g === void 0 ? void 0 : _g.profit;
                ticket.payment_date = (_h = req.body) === null || _h === void 0 ? void 0 : _h.paymentDate;
                ticket.paid_amount = (_j = req.body) === null || _j === void 0 ? void 0 : _j.paidAmount;
                ticket.remaining_amount = (_k = req.body) === null || _k === void 0 ? void 0 : _k.remainingAmount;
                ticket.payment_method = (_l = req.body) === null || _l === void 0 ? void 0 : _l.paymentMethod;
                return [4 /*yield*/, ticket.save()];
            case 3:
                updatedTicket = _m.sent();
                res.status(200).json(updatedTicket);
                _m.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.updateTicket = updateTicket;
//@desc   >>>> Delete one Ticket
//@route  >>>> DELETE /api/tickets/:id
//@Access >>>> public(For Admins)
var deleteTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var deletedTicket;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, ticketModel_1.default.findByIdAndDelete(req.params.id)];
            case 1:
                deletedTicket = _a.sent();
                //Check If the Document is Already Deleted Or Not.
                if (!(deletedTicket === null || deletedTicket === void 0 ? void 0 : deletedTicket.id)) {
                    throw new Error("This Document Has Been Already Deleted!");
                }
                else {
                    res.status(200).json({ id: deletedTicket.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteTicket = deleteTicket;
