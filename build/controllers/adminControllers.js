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
exports.adminLogin = exports.getOneAdmin = exports.createAdmin = exports.updateAdmin = void 0;
var adminModel_js_1 = __importDefault(require("../models/adminModel.js"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var generateAdminsToken_js_1 = require("../helpers/generateAdminsToken.js");
//@desc   >>>> Get one admin
//@route  >>>> GET /api/admin/:id
//@Access >>>> Public(admins)
var getOneAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var admin;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, adminModel_js_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id)];
            case 1:
                admin = _b.sent();
                res.status(200).json({
                    id: admin.id,
                    name: admin.admin_name,
                    email: admin.email,
                    role: admin.role,
                    token: (0, generateAdminsToken_js_1.generateAdminsToken)(admin.id, admin.email, admin.role),
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getOneAdmin = getOneAdmin;
//@desc   >>>> admin login
//@route  >>>> GET /api/admins/login
//@Access >>>> Public(admins)
var adminLogin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, email, password, admin, isCorrectPassword;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, email = _a.email, password = _a.password;
                //Check If the password is Not Presenetd in the body Object.
                if (!password) {
                    throw new Error("Please provide the password!");
                }
                return [4 /*yield*/, adminModel_js_1.default.findOne({ email: email })];
            case 1:
                admin = _b.sent();
                //Check The Admin With That Email is Actualy Existed.
                if (!admin) {
                    throw new Error("Wrong Email");
                }
                return [4 /*yield*/, bcryptjs_1.default.compare(password, admin.password)];
            case 2:
                isCorrectPassword = _b.sent();
                //If the password is Correct => Send Admin Infos Back.
                if (isCorrectPassword) {
                    res.status(200).json({
                        id: admin.id,
                        name: admin.admin_name,
                        email: admin.email,
                        role: admin.role,
                        token: (0, generateAdminsToken_js_1.generateAdminsToken)(admin.id, admin.email, admin.role),
                    });
                }
                else {
                    //Else The password is Wrong Password.
                    throw new Error("Wrong Password");
                }
                return [2 /*return*/];
        }
    });
}); };
exports.adminLogin = adminLogin;
//@desc   >>>> Create admin
//@route  >>>> POST /api/admins/
//@Access >>>> privete(Owner Only)
var createAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, admin;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.hash((_a = req.body) === null || _a === void 0 ? void 0 : _a.password, 10)];
            case 1:
                hashedPassword = _b.sent();
                return [4 /*yield*/, adminModel_js_1.default.create({
                        admin_name: req.body.name,
                        email: req.body.email,
                        password: hashedPassword,
                        role: req.body.role,
                    })];
            case 2:
                admin = _b.sent();
                //send Back Created Admin Data
                res.status(201).json({
                    id: admin.id,
                    admin_name: admin.admin_name,
                    email: admin.email,
                    role: admin.role,
                });
                return [2 /*return*/];
        }
    });
}); };
exports.createAdmin = createAdmin;
//@desc   >>>> UPDATE Admin
//@route  >>>> PUT /api/admins/:id
//@Access >>>> private(all Admin for their accounts)
var updateAdmin = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var hashedPassword, admin, error, updatedAdmin;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, bcryptjs_1.default.hash(req.body.password, 10)];
            case 1:
                hashedPassword = _a.sent();
                return [4 /*yield*/, adminModel_js_1.default.findById(req.params.id)];
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
                    id: updatedAdmin.id,
                    name: updatedAdmin.admin_name,
                    email: updatedAdmin.email,
                    role: updatedAdmin.role,
                    token: (0, generateAdminsToken_js_1.generateAdminsToken)(admin.id, admin.email, admin.role),
                });
                _a.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateAdmin = updateAdmin;
