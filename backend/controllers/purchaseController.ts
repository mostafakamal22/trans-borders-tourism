import { Request, Response } from "express";
import Purchase from "../models/purchaseModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Purchases
//@route  >>>> GET /api/Purchases
//@Access >>>> public(For Admins)
const getPurchases = async (_req: Request, res: Response) => {
  //Get All Purchases Data & Send it Back.
  const Purchases = await Purchase.find();
  res.status(200).json(Purchases);
};

//@desc   >>>> Create Purchase
//@route  >>>> POST /api/Purchases/
//@Access >>>> public(For Admins)
const createPurchase = async (req: Request, res: Response) => {
  //Create New Purchase With Request Data & Send Created Purchase Back.
  const purchase = await Purchase.create({
    purchase_types: req.body?.purchaseTypes,
    total: req.body?.total,
    date: req.body?.purchaseDate,
  });
  res.status(201).json(purchase);
};

//@desc   >>>> UPDATE Purchase
//@route  >>>> PUT /api/Purchases/:id
//@Access >>>> Public(for Admins)
const updatePurchase = async (req: Request, res: Response) => {
  //Get Purchase Wanted For Updating.
  const purchase = await Purchase.findById(req.params?.id);

  //Check if Purchase is not exist.
  if (!purchase) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Purchase With New Values.
    purchase.total = req.body.total;
    purchase.purchase_types = req.body.purchaseTypes;
    purchase.date = req.body.purchaseDate;

    //Get Updated Purchase info & Send it Back.
    const updatedPurchase = await purchase.save();
    res.status(200).json(updatedPurchase);
  }
};

//@desc   >>>> Delete one Purchase
//@route  >>>> DELETE /api/Purchases/:id
//@Access >>>> public(For Admins)
const deletePurchase = async (req: Request, res: Response) => {
  //Get Purchase Wanted For Deleting & Send Deleted Purchase id Back.
  const deletedPurchase = await Purchase.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPurchase?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedPurchase.id });
  }
};

export { getPurchases, createPurchase, updatePurchase, deletePurchase };
