"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAdminsToken = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var generateAdminsToken = function (id, role) {
    //Create Access Token
    var accessToken = jsonwebtoken_1.default.sign({
        AdminInfo: {
            id: id,
            role: role,
        },
    }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.NODE_ENV === "production" ? "15m" : "5m" });
    //Create Refresh Token
    var refreshToken = jsonwebtoken_1.default.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.NODE_ENV === "production" ? "1d" : "20m",
    });
    return { accessToken: accessToken, refreshToken: refreshToken };
};
exports.generateAdminsToken = generateAdminsToken;
