const Bank = require("../models/bankModel");

//@desc   >>>> Get All Bank
//@route  >>>> GET /api/banks
//@Access >>>> public(For Admins)
const getBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Bank
//@route  >>>> POST /api/banks/
//@Access >>>> public(For Admins)
const createBank = async (req, res) => {
  try {
    const bank = await Bank.create({
      customer_name: req.body.name,
      account_id: req.body.accountId,
      process_no: req.body.processNo,
      total: req.body.total,
      type: req.body.type,
      payment_date: req.body.paymentDate,
    });
    res.status(201).json(bank);
  } catch (error) {
    if (
      error.message.match(
        /(account_id|customer_name|type|process_no|payment_date|total)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Bank
//@route  >>>> PUT /api/banks/:id
//@Access >>>> Public(for Admins)
const updateBank = async (req, res) => {
  try {
    //get Bank
    const bank = await Bank.findById(req.params.id);

    //update Bank with new values
    bank.customer_name = req.body.name;
    bank.account_id = req.body.accountId;
    bank.process_no = req.body.processNo;
    bank.total = req.body.total;
    bank.type = req.body.type;
    bank.payment_date = req.body.paymentDate;

    //get updated Bank info & send it back
    const updatedBank = await bank.save();
    res.status(200).json(updatedBank);
  } catch (error) {
    if (
      error.message.match(
        /(account_id|customer_name|type|process_no|payment_date|total)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Bank
//@route  >>>> DELETE /api/bank/:id
//@Access >>>> public(For Admins)
const deleteBank = async (req, res) => {
  try {
    const deletedBank = await Bank.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedBank.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getBanks,
  deleteBank,
  createBank,
  updateBank,
};
