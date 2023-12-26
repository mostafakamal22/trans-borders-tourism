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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ticketsChartsCalculations = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
//Calculate Tickets' Charts Needed Calcualtions
var ticketsChartsCalculations = function (tickets) {
    var _a;
    //Totals For Every Month
    var totalMonthValues = {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0,
        7: 0,
        8: 0,
        9: 0,
        10: 0,
        11: 0,
    };
    //Totals For Last 3 Years
    var totalLastThreeValues = (_a = {},
        _a[(0, dayjs_1.default)().year()] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
        },
        _a[(0, dayjs_1.default)().year() - 1] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
        },
        _a[(0, dayjs_1.default)().year() - 2] = {
            0: 0,
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
            6: 0,
            7: 0,
            8: 0,
            9: 0,
            10: 0,
            11: 0,
        },
        _a);
    // Totals For Tickets' Payment Methods
    var totalForEveryPaymentMethod = {
        bank: 0,
        cash: 0,
        credit: 0,
        later: 0,
    };
    //Count The Top Employees.
    var employeesCounter = {};
    //Count The Top Suppliers.
    var suppliersCounter = {};
    //Loop Through Tickets And Add All Values We Need Each To The Specific Object Defined.
    tickets.forEach(function (ticket) {
        var _a, _b, _c;
        var month = (_a = (0, dayjs_1.default)(ticket === null || ticket === void 0 ? void 0 : ticket.payment_date)) === null || _a === void 0 ? void 0 : _a.month();
        var year = (_b = (0, dayjs_1.default)(ticket === null || ticket === void 0 ? void 0 : ticket.payment_date)) === null || _b === void 0 ? void 0 : _b.year();
        var ticketProfit = isNaN(ticket === null || ticket === void 0 ? void 0 : ticket.profit) ? 0 : +(ticket === null || ticket === void 0 ? void 0 : ticket.profit);
        var ticketEmployee = ticket === null || ticket === void 0 ? void 0 : ticket.employee;
        var ticketSupplier = ticket === null || ticket === void 0 ? void 0 : ticket.supplier;
        var ticketPaymentMethod = ticket === null || ticket === void 0 ? void 0 : ticket.payment_method;
        //Month And Year Data
        if (month >= 0 && year) {
            totalMonthValues[month] += ticketProfit;
            if (((_c = totalLastThreeValues === null || totalLastThreeValues === void 0 ? void 0 : totalLastThreeValues[year]) === null || _c === void 0 ? void 0 : _c[month]) >= 0) {
                totalLastThreeValues[year][month] +=
                    ticketProfit;
            }
        }
        //Tickets Payment Methods
        if (ticketPaymentMethod) {
            totalForEveryPaymentMethod[ticketPaymentMethod] += 1;
        }
        //Top Employees
        if (ticketEmployee && employeesCounter.hasOwnProperty(ticketEmployee)) {
            employeesCounter[ticketEmployee] += 1;
        }
        else if (ticketEmployee) {
            employeesCounter[ticketEmployee] = 1;
        }
        //Top Suppliers
        if (ticketSupplier && suppliersCounter.hasOwnProperty(ticketSupplier)) {
            suppliersCounter[ticketSupplier] += 1;
        }
        else if (ticketSupplier) {
            suppliersCounter[ticketSupplier] = 1;
        }
    });
    return {
        totalMonthValues: Object.values(totalMonthValues),
        totalLastThreeValues: __assign({}, totalLastThreeValues),
        totalForEveryPaymentMethod: Object.values(totalForEveryPaymentMethod),
        topEmployees: Object.keys(employeesCounter)
            .map(function (key) { return [key, employeesCounter[key]]; })
            .sort(function (a, b) { return +b[1] - +a[1]; })
            .slice(0, 5),
        topSuppliers: Object.keys(suppliersCounter)
            .map(function (key) { return [key, suppliersCounter[key]]; })
            .sort(function (a, b) { return +b[1] - +a[1]; })
            .slice(0, 5),
    };
};
exports.ticketsChartsCalculations = ticketsChartsCalculations;
