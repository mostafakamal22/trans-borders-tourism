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
exports.getTicketsStatistics = exports.updateTicket = exports.createTicket = exports.deleteTicket = exports.getOneTicket = exports.getTickets = void 0;
var ticketModel_1 = __importDefault(require("../models/ticketModel"));
var node_cache_1 = __importDefault(require("../lib/node-cache"));
var tickets_1 = require("../calculations/tickets");
//@Desc   >>>> Get All Tickets That Match Query Object.
//@Route  >>>> POST /api/tickets/query
//@Access >>>> Private(Admins Only)
var getTickets = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, query, option, customerName, employee, supplier, type, paymentMethod, queries, options, tickets;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, query = _a.query, option = _a.option;
                customerName = (query === null || query === void 0 ? void 0 : query.customerName) ? query.customerName : "";
                employee = (query === null || query === void 0 ? void 0 : query.employee) ? query.employee : "";
                supplier = (query === null || query === void 0 ? void 0 : query.supplier) ? query.supplier : "";
                type = (query === null || query === void 0 ? void 0 : query.type) ? query.type : "";
                paymentMethod = (query === null || query === void 0 ? void 0 : query.paymentMethod) ? query.paymentMethod : [];
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
                        //Filter By Ticket Type.
                        type: new RegExp("".concat(type), "gi"),
                        //Filter By Ticket Supplier.
                        supplier: new RegExp("".concat(supplier), "gi"),
                        //Filter By Ticket Customer Name.
                        customer_name: new RegExp("".concat(customerName), "gi"),
                        //Filter By Ticket Employee.
                        employee: new RegExp("".concat(employee), "gi"),
                        //Filter By Ticket Payment Method.
                        payment_method: new RegExp("".concat(paymentMethod.join("|")), "gi"),
                    }
                    : {};
                options = __assign({ pagination: query ? true : false, sort: { payment_date: "desc", createdAt: "desc" } }, option);
                return [4 /*yield*/, ticketModel_1.default.paginate(queries, options)];
            case 1:
                tickets = _b.sent();
                // Send the response
                res.status(200).json(__assign({}, tickets));
                return [2 /*return*/];
        }
    });
}); };
exports.getTickets = getTickets;
//@Desc   >>>> GET ONE Ticket
//@Route  >>>> GET /api/tickets/:id
//@Access >>>> Private(Admins Only)
var getOneTicket = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var ticket, error;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, ticketModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                ticket = _b.sent();
                //Check if Ticket is not exist.
                if (!ticket) {
                    error = new Error();
                    error.name = "CastError";
                    error.path = "_id";
                    throw error;
                }
                else {
                    //Send Ticket.
                    res.status(200).json(ticket);
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOneTicket = getOneTicket;
//@Desc   >>>> Create Ticket
//@Route  >>>> POST /api/tickets/
//@Access >>>> private(For Admins)
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
//@Desc   >>>> UPDATE Ticket
//@Route  >>>> PUT /api/tickets/:id
//@Access >>>> Private(for Admins)
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
//@Desc   >>>> Delete one Ticket
//@Route  >>>> DELETE /api/tickets/:id
//@Access >>>> private(For Admins)
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
                    //Send Deleted Ticket id Back
                    res.status(200).json({ id: deletedTicket.id });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.deleteTicket = deleteTicket;
//@Desc   >>>> Get Tickets Statistics.
//@Route  >>>> GET /api/tickets/statistics
//@Access >>>> Private(Admins Only)
var getTicketsStatistics = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedStatistics, tickets, statistics;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedStatistics = node_cache_1.default.get("tickets-statistics");
                if (!cachedStatistics) return [3 /*break*/, 1];
                // If statistics are cached, return them
                res.status(200).json(cachedStatistics);
                return [3 /*break*/, 3];
            case 1: return [4 /*yield*/, ticketModel_1.default.find({})];
            case 2:
                tickets = _a.sent();
                statistics = (0, tickets_1.ticketsChartsCalculations)(tickets);
                // Cache the statistics with an expiration time (e.g., one day)
                node_cache_1.default.set("tickets-statistics", statistics, 86400); // 86400 seconds = 1 day
                // Send the response with the calculated statistics
                res.status(200).json(statistics);
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getTicketsStatistics = getTicketsStatistics;
