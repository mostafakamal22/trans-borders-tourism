const Visa = require("../models/visaModel");

//@desc   >>>> Get All Visa
//@route  >>>> GET /api/visas
//@Access >>>> public(For Admins)
const getVisas = async (req, res) => {
  try {
    const visas = await Visa.find();
    res.status(200).json(visas);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Visa
//@route  >>>> POST /api/visas/
//@Access >>>> public(For Admins)
const createVisa = async (req, res) => {
  try {
    const visa = await Visa.create({
      customer_name: req.body.name,
      passport_id: req.body.passportId,
      provider: req.body.provider,
      type: req.body.type,
      employee: req.body.employee,
      net_fare: req.body.netFare,
      sales: req.body.sales,
      profit: req.body.profit,
      payment_date: req.body.paymentDate,
      paid_amount: req.body?.paidAmount,
      remaining_amount: req.body?.remainingAmount,
      payment_method: req.body?.paymentMethod,
    });
    res.status(201).json(visa);
  } catch (error) {
    if (
      error.message.match(
        /(provider|passport_id|version|customer_name|customer_number|type|employee|net_fare|sales|profit|payment_date|paid_amount|remaining_amount|payment_method)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Visa
//@route  >>>> PUT /api/visas/:id
//@Access >>>> Public(for Admins)
const updateVisa = async (req, res) => {
  try {
    //get Visa
    const visa = await Visa.findById(req.params.id);

    //update Ticket with new values
    visa.customer_name = req.body.name;
    visa.passport_id = req.body.passportId;
    visa.provider = req.body.provider;
    visa.type = req.body.type;
    visa.employee = req.body.employee;
    visa.net_fare = req.body.netFare;
    visa.sales = req.body.sales;
    visa.profit = req.body.profit;
    visa.payment_date = req.body.paymentDate;
    visa.paid_amount = req.body?.paidAmount;
    visa.remaining_amount = req.body?.remainingAmount;
    visa.payment_method = req.body?.paymentMethod;
    //get updated Visa info & send it back
    const updatedVisa = await visa.save();

    res.status(200).json(updatedVisa);
  } catch (error) {
    if (
      error.message.match(
        /(provider|passport_id|version|customer_name|customer_number|type|employee|net_fare|sales|profit|payment_date|paid_amount|remaining_amount|payment_method)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Visa
//@route  >>>> DELETE /api/Visaa/:id
//@Access >>>> public(For Admins)
const deleteVisa = async (req, res) => {
  try {
    const deletedVisa = await Visa.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedVisa.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getVisas,
  deleteVisa,
  createVisa,
  updateVisa,
};
