"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var adminSchema = new mongoose_1.Schema({
    admin_name: {
        type: String,
        required: [true, "Please Type your Name!"],
        validate: {
            validator: function (v) {
                var regex = new RegExp("^(?=[a-zA-Z0-9._ ]{10,35}$)(?!.*[_.]{2})[^_.].*[^_.]$"
                /*  no >>> _ or . at the beginning
                  no >>>__ or _. or ._ or .. inside
                  no >>> _ or . at the end
                  [a-zA-Z0-9._] >> allowed characters
                  username is {10-} characters long
                  */
                );
                return regex.test(v);
            },
            message: "Please Enter A Valid Name!",
        },
    },
    email: {
        type: String,
        required: [true, "Please Type An Email!"],
        unique: true,
        validate: {
            validator: function (v) {
                var regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
                return regex.test(v);
            },
            message: "Please Enter A Valid Email!",
        },
    },
    password: {
        type: String,
        required: [true, "Please Type A Strong Password!"],
    },
    role: {
        type: String,
        required: [true, "Please Set The Admin Role!"],
        enum: {
            values: ["admin", "owner"],
            message: "{VALUE} is not supported as a Role",
        },
    },
}, {
    timestamps: true,
    collection: "Admins",
});
//Define Admin Model
var Admin = (0, mongoose_1.model)("Admin", adminSchema);
exports.default = Admin;
