import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/errorHandling";
import adminErrorHandler from "./utils/adminErrorHandling";
import { join, resolve } from "path";
import { adminApiLimiter } from "./middlewares/adminMiddlewares/adminApiLimiter";
import { connectToMongoose } from "./config/dbConfig";
import { corsDevOptions, corsProOptions } from "./config/corsConfig";

const app = express();

//Enable Express to trust the headers set by the reverse proxy (e.g., Nginx, Apache).
app.set("trust proxy", true);

//Middlewares
//Express json parser middleware
app.use(express.json());

//Cors middleware
if (process.env.NODE_ENV === "production") {
  app.use(cors(corsProOptions));
} else {
  app.use(cors(corsDevOptions));
}

//Middleware for cookies
app.use(cookieParser());

//Admins Router && Error Handler && API Limiter For Admins Requests.
import adminsRoute from "./routes/adminRoutes";
app.use("/api/admins", adminApiLimiter, adminsRoute, adminErrorHandler);

//Invoices Router
import invoicesRoute from "./routes/invoiceRoutes";
app.use("/api/invoices", invoicesRoute);

//Passports Router
import passportsRoute from "./routes/passportRoutes";
app.use("/api/passports", passportsRoute);

//Visas Router
import visasRoute from "./routes/visaRoutes";
app.use("/api/visas", visasRoute);

//Payments Router
import paymentsRoute from "./routes/paymentRoutes";
app.use("/api/payments", paymentsRoute);

//Tickets Router
import ticketsRoute from "./routes/ticketRoutes";
app.use("/api/tickets", ticketsRoute);

//Purchase Router
import purchasesRoute from "./routes/purchaseRoutes";
app.use("/api/purchases", purchasesRoute);

//Bank Router
import banksRoute from "./routes/bankRoutes";
app.use("/api/banks", banksRoute);

//Bill Router
import billsRoute from "./routes/billRoutes";
app.use("/api/bills", billsRoute);

//Receipt Voucher Router
import receiptVouchersRoute from "./routes/receiptVoucherRoutes";
app.use("/api/receiptVouchers", receiptVouchersRoute);

//Payment Voucher Router
import paymentVouchersRoute from "./routes/paymentVoucherRoutes";
app.use("/api/paymentVouchers", paymentVouchersRoute);

//serve Frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../frontend/dist")));

  app.get("*", (_req, res) =>
    res.sendFile(resolve(__dirname, "../", "frontend", "dist", "index.html"))
  );
}

//Main Errors Handler
app.use(errorHandler);

//Connect to mongodb
connectToMongoose().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("server is running");
  });
});
