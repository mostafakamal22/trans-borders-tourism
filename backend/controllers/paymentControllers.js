const Payment = require("../models/paymentsModel");

//@desc   >>>> Get All Payment
//@route  >>>> GET /api/payments
//@Access >>>> public(For Admins)
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    res.status(200).json(payments);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Payment
//@route  >>>> POST /api/payments/
//@Access >>>> public(For Admins)
const createPayment = async (req, res) => {
  try {
    const payment = await Payment.create({
      payment_types: req.body.paymentTypes,
      total: req.body.total,
      date: req.body.paymentDate,
    });
    res.status(201).json(payment);
  } catch (error) {
    if (error.message.match(/(name|total|payment_types|date)/gi)) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Payment
//@route  >>>> PUT /api/payments/:id
//@Access >>>> Public(for Admins)
const updatePayment = async (req, res) => {
  try {
    //get payment
    const payment = await Payment.findById(req.params.id);

    //update Payment with new values
    payment.total = req.body.total;
    payment.payment_types = req.body.paymentTypes;
    payment.date = req.body.paymentDate;
    //get updated Payment info & send it back
    const updatedPayment = await payment.save();

    res.status(200).json(updatedPayment);
  } catch (error) {
    if (error.message.match(/(name|total|payment_types|date)/gi)) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Payment
//@route  >>>> DELETE /api/payments/:id
//@Access >>>> public(For Admins)
const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedPayment.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getPayments,
  deletePayment,
  createPayment,
  updatePayment,
};
