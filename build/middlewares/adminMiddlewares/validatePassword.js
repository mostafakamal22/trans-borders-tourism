"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
//Validate Password before Hashing it.
//@useCase:- when admin registers/updates an admin account.
var validatePassword = function (req, _res, next) {
    var _a;
    var regex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{12,})");
    /*
        (?=.*[a-z])>>The string must contain at least 1 lowercase alphabetical character
        (?=.*[A-Z])>>The string must contain at least 1 uppercase alphabetical character
        (?=.*[0-9])>>The string must contain at least 1 numeric character
        (?=.*[!@#$%^&*])>>The string must contain at least one special character,
        but we are escaping reserved RegEx characters to avoid conflict
        (?=.{8,})>>The string must be eight characters or longer */
    //invalid password (weak password)
    if (!regex.test((_a = req === null || req === void 0 ? void 0 : req.body) === null || _a === void 0 ? void 0 : _a.password)) {
        throw new Error("Please provide a strong password!");
    }
    //Okay Valid Password => Go To Next Middleware
    next();
};
exports.validatePassword = validatePassword;
