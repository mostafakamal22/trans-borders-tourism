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
    });
    res.status(201).json(visa);
  } catch (error) {
    if (
      error.message.match(
        /(provider|passport_id|version|customer_name|customer_number|type|state|net_fare|sales|profit|payment_date)/gi
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
};
