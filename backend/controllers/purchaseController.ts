import { Request, Response } from "express";
import Purchase from "../models/purchaseModel";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All Purchases That Match Query Object.
//@Route  >>>> POST /api/purchases/query
//@Access >>>> Private(Admins Only)
const getPurchases = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const supplier = query?.supplier ? query.supplier : "";
  const type = query?.type ? query.type : "";

  //Prepare Queries for Mongoose Query.
  const queries = query
    ? {
        //Filter By Year, Month And Day.
        $expr: {
          $setEquals: [
            [
              query?.year && {
                $year: "$date",
              },
              query?.month && {
                $month: "$date",
              },
              query?.day && {
                $dayOfMonth: "$date",
              },
            ],

            [
              query?.year && query?.year,
              query?.month && query?.month,
              query?.day && query?.day,
            ],
          ],
        },

        //Filter By Purchase Type.
        "purchase_types.name": new RegExp(`${type}`, "gi"),

        //Filter By Purchase Supplier.
        "purchase_types.supplier": new RegExp(`${supplier}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Purchases Data That Match Query & Send it Back.
  const purchases = await Purchase.paginate(queries, options);
  res.status(200).json(purchases);
};

//@Desc   >>>> Create Purchase
//@Route  >>>> POST /api/Purchases/
//@Access >>>> Private(Admins Only)
const createPurchase = async (req: Request, res: Response) => {
  //Create New Purchase With Request Data & Send Created Purchase Back.
  const purchase = await Purchase.create({
    purchase_types: req.body?.purchaseTypes,
    total: req.body?.total,
    date: req.body?.purchaseDate,
  });
  res.status(201).json(purchase);
};

//@Desc   >>>> UPDATE Purchase
//@Route  >>>> PUT /api/Purchases/:id
//@Access >>>> Private(Admins Only)
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
    purchase.total = req.body?.total;
    purchase.purchase_types = req.body?.purchaseTypes;
    purchase.date = req.body?.purchaseDate;

    //Get Updated Purchase info & Send it Back.
    const updatedPurchase = await purchase.save();
    res.status(200).json(updatedPurchase);
  }
};

//@Desc   >>>> Delete one Purchase
//@Route  >>>> DELETE /api/Purchases/:id
//@Access >>>> Private(Admins Only)
const deletePurchase = async (req: Request, res: Response) => {
  //Get Purchase Wanted For Deleting.
  const deletedPurchase = await Purchase.findByIdAndDelete(req.params?.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedPurchase?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Purchase id Back
    res.status(200).json({ id: deletedPurchase.id });
  }
};

export { getPurchases, createPurchase, updatePurchase, deletePurchase };
