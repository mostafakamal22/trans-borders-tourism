"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = void 0;
//check password === repeated password
//@useCase:- when admin updating his info
var comparePassword = function (req, _res, next) {
    var _a = req.body, password = _a.password, repeatedPassword = _a.repeatedPassword;
    if (password !== repeatedPassword) {
        throw new Error("Password and Repeated Password Do NOT match");
    }
    else {
        next();
    }
};
exports.comparePassword = comparePassword;
