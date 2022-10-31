const Passport = require("../models/passportModel");

//@desc   >>>> Get All Passports
//@route  >>>> GET /api/passports
//@Access >>>> public(For Admins)
const getPassports = async (req, res) => {
  try {
    const passports = await Passport.find();
    res.status(200).json(passports);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Passport
//@route  >>>> POST /api/passports/
//@Access >>>> public(For Admins)
const createPassport = async (req, res) => {
  try {
    const passport = await Passport.create({
      customer_name: req.body.name,
      customer_nationality: req.body.nationality,
      passport_id: req.body.passportId,
      state: req.body.state,
      service: req.body.service,
      service_price: req.body.servicePrice,
      taxable: req.body.taxable,
      tax_rate: req.body.taxRate,
      total: req.body.total,
      sales: req.body.sales,
      profit: req.body.profit,
      payment_date: req.body.paymentDate,
    });
    res.status(201).json(passport);
  } catch (error) {
    if (
      error.message.match(
        /(customer_name|customer_nationality|passport_id|state|service|total|payment_date|tax_rate|taxable|sales|profit|service_price)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Passport
//@route  >>>> PUT /api/passports/:id
//@Access >>>> Public(for Admins)
const updatePassport = async (req, res) => {
  // //check if new state is actually the old state
  // if (req.body.newState === req.body.oldState) {
  //   return res
  //     .status(400)
  //     .send("Please Specify New State For That Password Service");
  // }
  try {
    //get passport
    const passport = await Passport.findById(req.params.id);
    //update passport with new values
    passport.customer_name = req.body.name;
    passport.customer_nationality = req.body.nationality;
    passport.passport_id = req.body.passportId;
    passport.state = req.body.state;
    passport.service = req.body.service;
    passport.payment_date = req.body.paymentDate;
    passport.taxable = req.body.taxable;
    passport.tax_rate = req.body.taxRate;
    passport.service_price = req.body.servicePrice;
    passport.total = req.body.total;
    passport.sales = req.body.sales;
    passport.profit = req.body.profit;
    //get updated passport info & send it back
    const updatedPassport = await passport.save();

    res.status(200).json(updatedPassport);
  } catch (error) {
    if (
      error.message.match(
        /(customer_name|customer_nationality|passport_id|state|service|total|payment_date|tax_rate|taxable|sales|profit|service_price)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Passport
//@route  >>>> DELETE /api/passports/:id
//@Access >>>> public(For Admins)
const deletePassport = async (req, res) => {
  try {
    const deletedPassport = await Passport.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedPassport.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  updatePassport,
  createPassport,
  deletePassport,
  getPassports,
};
