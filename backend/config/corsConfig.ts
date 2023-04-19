import { CorsOptions } from "cors";

/* CORS Domains Configuration */

//Devlopement CORS Configurations
const devWhitelist = ["http://localhost:5173"];

export const corsDevOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || devWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

//Production CORS Configurations
const domainsFromEnv = process.env.CORS_DOMAINS || "";

const productionWhitelist = domainsFromEnv
  .split(",")
  .map((item) => item.trim());

export const corsProOptions: CorsOptions = {
  origin: function (origin, callback) {
    if (!origin || productionWhitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};
