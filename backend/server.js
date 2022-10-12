require("dotenv").config();
const path = require("path");
const express = require("express");
const cors = require("cors");

const app = express();

//connect to mongodb
const { connectToMongoose } = require("./config/dbConfig");
connectToMongoose();

//middlewares
//express json parser middleware
app.use(express.json());

//cors middleware

const { corsProOptions } = require("./config/corsConfig");
app.use(cors(corsProOptions));

// const { corsDevOptions } = require("./config/corsConfig");
// app.use(cors(corsDevOptions));

// Apply the rate limiting middleware to API calls only
// const {
//   apiLimiter,
// } = require("./middlewares/rateLimitMiddleware/rateLimitMiddleware");
// app.use("/api", apiLimiter);

//admins Router
const adminsRoute = require("./routes/adminRoutes");
app.use("/api/admins", adminsRoute);

//invoices Router
const invoicesRoute = require("./routes/invoiceRoutes");
app.use("/api/invoices", invoicesRoute);

//serve Frontend
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join("dist")));

  app.get("*", (req, res) => res.sendFile(path.resolve("dist", "index.html")));
}

app.listen(process.env.PORT || 5000, () => {
  console.log("server is running");
});
