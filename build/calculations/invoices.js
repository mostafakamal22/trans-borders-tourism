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
exports.invoicesChartsCalculations = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
//Calculate Invoices' Charts Needed Calcualtions
var invoicesChartsCalculations = function (invoices) {
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
    invoices.forEach(function (invoice) {
        var _a, _b, _c, _d, _e;
        var month = (_a = (0, dayjs_1.default)(invoice === null || invoice === void 0 ? void 0 : invoice.date)) === null || _a === void 0 ? void 0 : _a.month();
        var year = (_b = (0, dayjs_1.default)(invoice === null || invoice === void 0 ? void 0 : invoice.date)) === null || _b === void 0 ? void 0 : _b.year();
        var invoiceTotal = (invoice === null || invoice === void 0 ? void 0 : invoice.total)
            ? invoice.total
            : (_d = (_c = invoice === null || invoice === void 0 ? void 0 : invoice.details) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.price;
        if (month >= 0 && year) {
            totalMonthValues[month] += invoiceTotal;
            if (((_e = totalLastThreeValues === null || totalLastThreeValues === void 0 ? void 0 : totalLastThreeValues[year]) === null || _e === void 0 ? void 0 : _e[month]) >= 0) {
                totalLastThreeValues[year][month] +=
                    invoiceTotal;
            }
        }
    });
    return {
        totalMonthValues: Object.values(totalMonthValues),
        totalLastThreeValues: __assign({}, totalLastThreeValues),
    };
};
exports.invoicesChartsCalculations = invoicesChartsCalculations;
