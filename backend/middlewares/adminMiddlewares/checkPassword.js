//check password that comes from request is the password that being saved into database
const Admin = require("../../models/adminModel");
const bycrpt = require("bcryptjs");

//@useCase:- when admin updating his info
const checkPassword = async (req, res, next) => {
  try {
    //get admin
    const admin = await Admin.findById(req.body.id);

    //compare password
    const isPassword = await bycrpt.compare(
      req.body.oldPassword,
      admin.password
    );

    if (isPassword) {
      //okay right password
      return next();
    } else {
      return res.status(400).send("Wrong old password");
    }
  } catch (error) {
    return res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  checkPassword,
};
