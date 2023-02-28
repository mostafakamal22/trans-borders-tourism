import "express-async-errors";
import dotenv from "dotenv";
dotenv.config();
import { join, resolve } from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { corsDevOptions, corsProOptions } from "./config/corsConfig";
import errorHandler from "./utils/errorHandling";
import adminErrorHandler from "./utils/adminErrorHandling";
import { adminApiLimiter } from "./middlewares/adminMiddlewares/adminApiLimiter";

const app = express();

//Connect to mongodb
import { connectToMongoose } from "./config/dbConfig";
connectToMongoose();

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

//serve Frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(join(__dirname, "../frontend/dist")));

  app.get("*", (_req, res) =>
    res.sendFile(resolve(__dirname, "../", "frontend", "dist", "index.html"))
  );
}

//Main Errors Handler
app.use(errorHandler);

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
