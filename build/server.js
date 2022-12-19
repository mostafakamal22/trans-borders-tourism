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
var corsConfig_js_1 = require("./config/corsConfig.js");
var errorHandling_js_1 = __importDefault(require("./utils/errorHandling.js"));
var adminErrorHandling_js_1 = __importDefault(require("./utils/adminErrorHandling.js"));
var adminApiLimiter_js_1 = require("./middlewares/adminMiddlewares/adminApiLimiter.js");
var app = (0, express_1.default)();
//connect to mongodb
var dbConfig_js_1 = require("./config/dbConfig.js");
(0, dbConfig_js_1.connectToMongoose)();
//middlewares
//express json parser middleware
app.use(express_1.default.json());
//cors middleware
if (process.env.NODE_ENV === "production") {
    app.use((0, cors_1.default)(corsConfig_js_1.corsProOptions));
}
else {
    app.use((0, cors_1.default)(corsConfig_js_1.corsDevOptions));
}
//admins Router && Error Handler && API Limiter For Admins Requests.
var adminRoutes_js_1 = __importDefault(require("./routes/adminRoutes.js"));
app.use("/api/admins", adminApiLimiter_js_1.adminApiLimiter, adminRoutes_js_1.default, adminErrorHandling_js_1.default);
//invoices Router
var invoiceRoutes_js_1 = __importDefault(require("./routes/invoiceRoutes.js"));
app.use("/api/invoices", invoiceRoutes_js_1.default);
//passports Router
var passportRoutes_js_1 = __importDefault(require("./routes/passportRoutes.js"));
app.use("/api/passports", passportRoutes_js_1.default);
//visas Router
var visaRoutes_js_1 = __importDefault(require("./routes/visaRoutes.js"));
app.use("/api/visas", visaRoutes_js_1.default);
//payments Router
var paymentRoutes_js_1 = __importDefault(require("./routes/paymentRoutes.js"));
app.use("/api/payments", paymentRoutes_js_1.default);
//Tickets Router
var ticketRoutes_js_1 = __importDefault(require("./routes/ticketRoutes.js"));
app.use("/api/tickets", ticketRoutes_js_1.default);
//Purchase Router
var purchaseRoutes_js_1 = __importDefault(require("./routes/purchaseRoutes.js"));
app.use("/api/purchases", purchaseRoutes_js_1.default);
//Bank Router
var bankRoutes_js_1 = __importDefault(require("./routes/bankRoutes.js"));
app.use("/api/banks", bankRoutes_js_1.default);
//serve Frontend
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static((0, path_1.join)(__dirname, "../frontend/dist")));
    app.get("*", function (_req, res) {
        return res.sendFile((0, path_1.resolve)(__dirname, "../", "frontend", "dist", "index.html"));
    });
}
//Main Errors Handler
app.use(errorHandling_js_1.default);
app.listen(process.env.PORT || 5000, function () {
    console.log("server is running");
});
