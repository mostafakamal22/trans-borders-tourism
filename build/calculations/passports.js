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
exports.passportsChartsCalculations = void 0;
var dayjs_1 = __importDefault(require("dayjs"));
//Calculate Passports' Charts Needed Calcualtions
var passportsChartsCalculations = function (passports) {
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
    //Totals For Passports' Services
    var totalForEveryService = {
        "30days": 0,
        "60days": 0,
        "90days": 0,
        extend_permission: 0,
        cancel_permission: 0,
        report_request: 0,
        renew_resedency: 0,
        cancel_resedency: 0,
        temp_shutdown_with_escape: 0,
        change_situation: 0,
    };
    //Count The Customers' Top Countries
    var nationalitiesCounter = {};
    //Loop Through Passports And Add All Values We Need Each To The Specific Object Defined.
    passports.forEach(function (passport) {
        var _a, _b, _c;
        var month = (_a = (0, dayjs_1.default)(passport === null || passport === void 0 ? void 0 : passport.payment_date)) === null || _a === void 0 ? void 0 : _a.month();
        var year = (_b = (0, dayjs_1.default)(passport === null || passport === void 0 ? void 0 : passport.payment_date)) === null || _b === void 0 ? void 0 : _b.year();
        var passportProfit = isNaN(passport === null || passport === void 0 ? void 0 : passport.profit) ? 0 : +(passport === null || passport === void 0 ? void 0 : passport.profit);
        var passportService = passport === null || passport === void 0 ? void 0 : passport.service;
        //Month And Year Data
        if (month >= 0 && year) {
            totalMonthValues[month] += passportProfit;
            if (((_c = totalLastThreeValues === null || totalLastThreeValues === void 0 ? void 0 : totalLastThreeValues[year]) === null || _c === void 0 ? void 0 : _c[month]) >= 0) {
                totalLastThreeValues[year][month] +=
                    passportProfit;
            }
        }
        //Passport Service Data
        if (passportService) {
            totalForEveryService[passportService] += 1;
        }
        //Customer Nationality Data
        if ((passport === null || passport === void 0 ? void 0 : passport.customer_nationality) &&
            nationalitiesCounter.hasOwnProperty(passport.customer_nationality)) {
            nationalitiesCounter[passport.customer_nationality] += 1;
        }
        else if (passport === null || passport === void 0 ? void 0 : passport.customer_nationality) {
            nationalitiesCounter[passport.customer_nationality] = 1;
        }
    });
    return {
        totalMonthValues: Object.values(totalMonthValues),
        totalLastThreeValues: __assign({}, totalLastThreeValues),
        totalForEveryService: Object.values(totalForEveryService),
        topNationalities: Object.keys(nationalitiesCounter)
            .map(function (key) { return [key, nationalitiesCounter[key]]; })
            .sort(function (a, b) { return +b[1] - +a[1]; })
            .slice(0, 5),
    };
};
exports.passportsChartsCalculations = passportsChartsCalculations;
