"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsProOptions = exports.corsDevOptions = void 0;
/* CORS Domains Configuration */
//Devlopement CORS Configurations
var devWhitelist = ["http://127.0.0.1:5173"];
exports.corsDevOptions = {
    origin: function (origin, callback) {
        if (!origin || devWhitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
//Production CORS Configurations
var domainsFromEnv = process.env.CORS_DOMAINS || "";
var productionWhitelist = domainsFromEnv
    .split(",")
    .map(function (item) { return item.trim(); });
exports.corsProOptions = {
    origin: function (origin, callback) {
        if (!origin || productionWhitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};
