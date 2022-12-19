"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Handle Admin's Email Duplication.
var handleDuplicateKeyError = function (err, res) {
    var field = Object.keys(err.keyValue);
    var code = 409;
    var error = "This ".concat(field, " is Already Used By Another Admin!");
    res.status(code).send(error);
};
//Handle field formatting, empty fields, mismatched passwords and Cast Errors.
var handleValidationError = function (err, res) {
    var errors = Object.values(err.errors).map(function (el) {
        //For Cast Errors.
        if (el.message.match(/cast/gi)) {
            return "You Provided a [".concat(el.valueType, "] For The [").concat(el.path, "] Property, Please Provide a [").concat(el.kind, "]!");
        }
        //For Default Validation Errors.
        return el.message;
    });
    var code = 400;
    if (errors.length > 1) {
        //For More Than One Error Message.
        var formattedErrors = errors.join("\n");
        res.status(code).send(formattedErrors);
    }
    else {
        //For Just One Error Message.
        res.status(code).send(errors.join(""));
    }
};
//Main Errors Handler function.
var MainErrorsHandler = function (err, _req, res, _next) {
    //MongoDB Servers Errors
    /*
      - MongooseServerSelectionError: connect ECONNREFUSED.
      - MongoTimeoutError: Server selection timed out after 30000 ms
      - MongooseError: Operation `X.insertOne()` buffering timed out after 10000ms >>> X.find() is a Model.method() call, and it has a timeout. It is timing out probably because you’re not connecting to the server, but mongoose throws no errors.
      -DisconnectedError: This connection timed out in trying to reconnect to MongoDB and will not successfully reconnect to MongoDB unless you explicitly reconnect.
     */
    if (err.name === "MongooseServerSelectionError" ||
        err.name === "MongoTimeoutError" ||
        err.name === "MongooseError" ||
        err.name === "MongoNetworkTimeoutError" ||
        err.name === "DisconnectedError") {
        console.log(err.name);
        return res
            .status(500)
            .send("Could't Connect To The Server, Try Refreshing The Page!");
    }
    //Parallel Save Errors
    //Thrown when you call save() on a document when the same document instance is already saving.
    if (err.name === "ParallelSaveError") {
        return res
            .status(400)
            .send("You are tyring to modify a document that's already being modified, Try again later!");
    }
    //Cast Errors
    //1-CastError: Cast to ObjectId failed for value "value" (type string) at path "_id" for model "X".
    if (err.name === "CastError" && err.path === "_id") {
        return res.status(404).send("That Document does not exist!");
    }
    //Schema Validation Errors
    //ValidationError: X validation failed.
    //CastError: Cast to Number failed for value string at path x.
    if (err.name === "ValidationError" || err.name === "CastError") {
        return handleValidationError(err, res);
    }
    //Schema Duplicate Keys Errors
    //E11000 duplicate key error collection
    if (err.name === "MongoServerError" && err.code && err.code == 11000) {
        return handleDuplicateKeyError(err, res);
    }
    //JWT Errors
    //TokenExpiredError OR JsonWebTokenError OR NotBeforeError
    if (err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError" ||
        err.name === "NotBeforeError") {
        return res
            .status(401)
            .send("Not Authorized with token Error:-  ".concat(err.message));
    }
    //Document Deletion Error
    //When You Try To delete a Docuement That's Already been Deleted.
    if (err.message === "This Document Has Been Already Deleted!") {
        return res.status(410).send(err.message);
    }
    //Admins Requests With (NO Tokens OR Invalid Tokens)
    if (err.message === "Not Authorized without token" ||
        err.message === "Not Authorized with invalid token") {
        return res.status(401).send(err.message);
    }
    //Unknown Errors
    console.log(err);
    res.status(500).send("An unknown error occurred.");
};
exports.default = MainErrorsHandler;
