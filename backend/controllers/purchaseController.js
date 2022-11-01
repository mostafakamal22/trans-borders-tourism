const Purchase = require("../models/purchaseModel");

//@desc   >>>> Get All Purchase
//@route  >>>> GET /api/Purchases
//@Access >>>> public(For Admins)
const getPurchases = async (req, res) => {
  try {
    const Purchases = await Purchase.find();
    res.status(200).json(Purchases);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Purchase
//@route  >>>> POST /api/Purchases/
//@Access >>>> public(For Admins)
const createPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.create({
      purchase_types: req.body.purchaseTypes,
      total: req.body.total,
      date: req.body.purchaseDate,
    });
    res.status(201).json(purchase);
  } catch (error) {
    if (error.message.match(/(name|total|cost|tax|payment_types|date)/gi)) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Payment
//@route  >>>> PUT /api/Purchases/:id
//@Access >>>> Public(for Admins)
const updatePurchase = async (req, res) => {
  try {
    //get purchase
    const purchase = await Purchase.findById(req.params.id);

    //update purchase with new values
    purchase.total = req.body.total;
    purchase.purchase_types = req.body.purchaseTypes;
    purchase.date = req.body.purchaseDate;
    //get updated Purchase info & send it back
    const updatedPurchase = await purchase.save();

    res.status(200).json(updatedPurchase);
  } catch (error) {
    if (error.message.match(/(name|total|cost|tax|payment_types|date)/gi)) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Payment
//@route  >>>> DELETE /api/Purchases/:id
//@Access >>>> public(For Admins)
const deletePurchase = async (req, res) => {
  try {
    const deletedPurchase = await Purchase.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedPurchase.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getPurchases,
  createPurchase,
  updatePurchase,
  deletePurchase,
};
