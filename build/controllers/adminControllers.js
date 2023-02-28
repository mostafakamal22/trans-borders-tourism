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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminLogout = exports.adminRefreshToken = exports.adminLogin = exports.getOneAdmin = exports.createAdmin = exports.updateAdmin = void 0;
var adminModel_1 = __importDefault(require("../models/adminModel"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var generateAdminsToken_1 = require("../helpers/generateAdminsToken");
var cookiesOptions_1 = require("../config/cookiesOptions");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//@Desc   >>>> Get Admins Info
//@Route  >>>> GET /api/admins/:id
//@Access >>>> Private(Admin)
var getOneAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, adminModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                admin = _b.sent();
                if (admin) {
                    res.status(200).json({
                        name: admin.admin_name,
                        email: admin.email,
                    });
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getOneAdmin = getOneAdmin;
//@Desc   >>>> Admins Login
//@Route  >>>> GET /api/admins/login
//@Access >>>> Private(Admins)
var adminLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, _a, email, password, admin, isCorrectPassword, id, role, _b, accessToken, newRefreshToken, newRefreshTokenArray, refreshToken, foundToken;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                cookies = req.cookies;
                _a = req.body, email = _a.email, password = _a.password;
                //Check If the password is Not Presenetd in the body Object.
                if (!password) {
                    throw new Error("Please provide the password!");
                }
                return [4 /*yield*/, adminModel_1.default.findOne({ email: email }).exec()];
            case 1:
                admin = _c.sent();
                //Check The Admin With That Email is Actualy Existed.
                if (!admin) {
                    throw new Error("Wrong Email");
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password)];
            case 2:
                isCorrectPassword = _c.sent();
                if (!isCorrectPassword) return [3 /*break*/, 6];
                id = admin.id, role = admin.role;
                _b = (0, generateAdminsToken_1.generateAdminsToken)(id, role), accessToken = _b.accessToken, newRefreshToken = _b.refreshToken;
                newRefreshTokenArray = !(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)
                    ? admin.refreshToken
                    : admin.refreshToken.filter(function (rt) { return rt !== cookies.jwt; });
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt)) return [3 /*break*/, 4];
                refreshToken = cookies.jwt;
                return [4 /*yield*/, adminModel_1.default.findOne({ refreshToken: refreshToken }).exec()];
            case 3:
                foundToken = _c.sent();
                // Detected refresh token reuse!
                if (!foundToken) {
                    // clear out ALL previous refresh tokens
                    newRefreshTokenArray = [];
                }
                res.clearCookie("jwt", process.env.NODE_ENV === "production"
                    ? cookiesOptions_1.cookiesProClearOptions
                    : cookiesOptions_1.cookiesDevClearOptions);
                _c.label = 4;
            case 4:
                // Saving refreshToken with current Admin
                admin.refreshToken = __spreadArray(__spreadArray([], newRefreshTokenArray, true), [newRefreshToken], false);
                return [4 /*yield*/, admin.save()];
            case 5:
                _c.sent();
                // Creates Secure Cookie with refresh token
                res.cookie("jwt", newRefreshToken, process.env.NODE_ENV === "production"
                    ? cookiesOptions_1.cookiesProOptions
                    : cookiesOptions_1.cookiesDevOptions);
                //Send Admin's Access Token.
                res.status(200).json({ accessToken: accessToken });
                return [3 /*break*/, 7];
            case 6: 
            //Else The password is Wrong Password.
            throw new Error("Wrong Password");
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.adminLogin = adminLogin;
//@Desc   >>>> Create New Admins' (Access + Refresh) Tokens When Access Token Expires.
//@Route  >>>> Get /api/admins/refresh
//@Access >>>> Privete(Admins)
var adminRefreshToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, admin, decoded, hackedAdmin, decoded, role, id, accessToken;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.sendStatus(401)];
                refreshToken = cookies.jwt;
                return [4 /*yield*/, adminModel_1.default.findOne({ refreshToken: refreshToken }).exec()];
            case 1:
                admin = _a.sent();
                if (!!admin) return [3 /*break*/, 5];
                decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                return [4 /*yield*/, adminModel_1.default.findById(decoded === null || decoded === void 0 ? void 0 : decoded.id)];
            case 2:
                hackedAdmin = _a.sent();
                if (!hackedAdmin) return [3 /*break*/, 4];
                hackedAdmin.refreshToken = [];
                return [4 /*yield*/, hackedAdmin.save()];
            case 3:
                _a.sent();
                return [2 /*return*/, res.sendStatus(403)]; //Forbidden
            case 4: return [3 /*break*/, 6];
            case 5:
                decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
                if (!decoded) {
                    // admin.refreshToken = [...newRefreshTokenArray];
                    // await admin.save();
                    return [2 /*return*/, res.sendStatus(401)];
                }
                if (admin.id !== (decoded === null || decoded === void 0 ? void 0 : decoded.id))
                    return [2 /*return*/, res.sendStatus(403)];
                role = admin.role, id = admin.id;
                accessToken = (0, generateAdminsToken_1.generateAdminsToken)(id, role).accessToken;
                // Saving refreshToken with current Admin
                // admin.refreshToken = [...newRefreshTokenArray, newRefreshToken];
                // await admin.save();
                // Creates Secure Cookie with refresh token
                // res.cookie(
                //   "jwt",
                //   newRefreshToken,
                //   process.env.NODE_ENV === "production"
                //     ? cookiesProOptions
                //     : cookiesDevOptions
                // );
                res.json({ accessToken: accessToken });
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.adminRefreshToken = adminRefreshToken;
//@Desc   >>>> Create admin
//@Route  >>>> POST /api/admins/
//@Access >>>> Privete(Owner Only)
var createAdmin = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        //For Testing Purpose Only
        if (true) {
            return [2 /*return*/, res.sendStatus(204)];
        }
        return [2 /*return*/];
    });
}); };
exports.createAdmin = createAdmin;
//@Desc   >>>> UPDATE Admin
//@Route  >>>> PUT /api/admins/:id
//@Access >>>> Private(All Admins for their accounts)
var updateAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, admin, error, updatedAdmin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, adminModel_1.default.findById(req.params.id)];
            case 2:
                admin = _a.sent();
                if (!!admin) return [3 /*break*/, 3];
                error = new Error();
                error.name = "CastError";
                error.path = "_id";
                throw error;
            case 3:
                //Update Admin with new values
                admin.email = req.body.email;
                admin.markModified("email");
                admin.password = hashedPassword;
                return [4 /*yield*/, admin.save()];
            case 4:
                updatedAdmin = _a.sent();
                res.status(200).json({
                    name: updatedAdmin.admin_name,
                    email: updatedAdmin.email,
                });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAdmin = updateAdmin;
//@Desc   >>>> Admins' Logout
//@Route  >>>> GET /api/admins/logout
//@Access >>>> Private(Admins)
var AdminLogout = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var cookies, refreshToken, admin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cookies = req.cookies;
                if (!(cookies === null || cookies === void 0 ? void 0 : cookies.jwt))
                    return [2 /*return*/, res.sendStatus(204)]; //No content
                refreshToken = cookies.jwt;
                return [4 /*yield*/, adminModel_1.default.findOne({ refreshToken: refreshToken }).exec()];
            case 1:
                admin = _a.sent();
                if (!admin) {
                    res.clearCookie("jwt", process.env.NODE_ENV === "production"
                        ? cookiesOptions_1.cookiesProClearOptions
                        : cookiesOptions_1.cookiesDevClearOptions);
                    return [2 /*return*/, res.sendStatus(204)];
                }
                // Delete refreshToken in db
                admin.refreshToken = admin.refreshToken.filter(function (rt) { return rt !== refreshToken; });
                return [4 /*yield*/, admin.save()];
            case 2:
                _a.sent();
                res.clearCookie("jwt", process.env.NODE_ENV === "production"
                    ? cookiesOptions_1.cookiesProClearOptions
                    : cookiesOptions_1.cookiesDevClearOptions);
                res.sendStatus(204);
                return [2 /*return*/];
        }
    });
}); };
exports.AdminLogout = AdminLogout;
