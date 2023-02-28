"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("express-async-errors");
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var path_1 = require("path");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var corsConfig_1 = require("./config/corsConfig");
var errorHandling_1 = __importDefault(require("./utils/errorHandling"));
var adminErrorHandling_1 = __importDefault(require("./utils/adminErrorHandling"));
var adminApiLimiter_1 = require("./middlewares/adminMiddlewares/adminApiLimiter");
var app = (0, express_1.default)();
//Connect to mongodb
var dbConfig_1 = require("./config/dbConfig");
(0, dbConfig_1.connectToMongoose)();
//Middlewares
//Express json parser middleware
app.use(express_1.default.json());
//Cors middleware
if (process.env.NODE_ENV === "production") {
    app.use((0, cors_1.default)(corsConfig_1.corsProOptions));
}
else {
    app.use((0, cors_1.default)(corsConfig_1.corsDevOptions));
}
//Middleware for cookies
app.use((0, cookie_parser_1.default)());
//Admins Router && Error Handler && API Limiter For Admins Requests.
var adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
app.use("/api/admins", adminApiLimiter_1.adminApiLimiter, adminRoutes_1.default, adminErrorHandling_1.default);
//Invoices Router
var invoiceRoutes_1 = __importDefault(require("./routes/invoiceRoutes"));
app.use("/api/invoices", invoiceRoutes_1.default);
//Passports Router
var passportRoutes_1 = __importDefault(require("./routes/passportRoutes"));
app.use("/api/passports", passportRoutes_1.default);
//Visas Router
var visaRoutes_1 = __importDefault(require("./routes/visaRoutes"));
app.use("/api/visas", visaRoutes_1.default);
//Payments Router
var paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
app.use("/api/payments", paymentRoutes_1.default);
//Tickets Router
var ticketRoutes_1 = __importDefault(require("./routes/ticketRoutes"));
app.use("/api/tickets", ticketRoutes_1.default);
//Purchase Router
var purchaseRoutes_1 = __importDefault(require("./routes/purchaseRoutes"));
app.use("/api/purchases", purchaseRoutes_1.default);
//Bank Router
var bankRoutes_1 = __importDefault(require("./routes/bankRoutes"));
app.use("/api/banks", bankRoutes_1.default);
//serve Frontend
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static((0, path_1.join)(__dirname, "../frontend/dist")));
    app.get("*", function (_req, res) {
        return res.sendFile((0, path_1.resolve)(__dirname, "../", "frontend", "dist", "index.html"));
    });
}
//Main Errors Handler
app.use(errorHandling_1.default);
app.listen(process.env.PORT || 5000, function () {
    console.log("server is running");
});
