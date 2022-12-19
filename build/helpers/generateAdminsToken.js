"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminsToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateAdminsToken = function (id, email, role) {
    return jsonwebtoken_1.default.sign({ id: id, email: email, role: role }, process.env.JWT_SECRET);
};
exports.generateAdminsToken = generateAdminsToken;
