import { Request, Response } from "express";
import Visa from "../models/visaModel";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All Visas That Match Query Object.
//@Route  >>>> POST /api/visas/query
//@Access >>>> Private(Admins Only)
const getVisas = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const customerName = query?.customerName ? query.customerName : "";
  const employee = query?.employee ? query.employee : "";
  const supplier = query?.supplier ? query.supplier : "";
  const sponsor = query?.sponsor ? query.sponsor : "";
  const type = query?.type ? query.type : "";
  const paymentMethod = query?.paymentMethod ? query.paymentMethod : [];

  //Prepare Queries for Mongoose Query.
  const queries = query
    ? {
        //Filter By Year, Month And Day.
        $expr: {
          $setEquals: [
            [
              query?.year && {
                $year: "$payment_date",
              },
              query?.month && {
                $month: "$payment_date",
              },
              query?.day && {
                $dayOfMonth: "$payment_date",
              },
            ],

            [
              query?.year && query?.year,
              query?.month && query?.month,
              query?.day && query?.day,
            ],
          ],
        },

        //Filter By Visa Type.
        type: new RegExp(`${type}`, "gi"),

        //Filter By Visa Provider.
        provider: new RegExp(`${supplier}`, "gi"),

        //Filter By Visa Sponsor.
        sponsor: new RegExp(`${sponsor}`, "gi"),

        //Filter By Visa Customer Name.
        customer_name: new RegExp(`${customerName}`, "gi"),

        //Filter By Visa Employee.
        employee: new RegExp(`${employee}`, "gi"),

        //Filter By Visa Payment Method.
        payment_method: new RegExp(`${paymentMethod.join("|")}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Visas Data That Match Query & Send it Back.
  const visas = await Visa.paginate(queries, options);
  res.status(200).json(visas);
};

//@Desc   >>>> Create Visa
//@Route  >>>> POST /api/visas/
//@Access >>>> Private(Admins Only)
const createVisa = async (req: Request, res: Response) => {
  //Create New Visa With Request Data & Send Created Visa Back.
  const visa = await Visa.create({
    customer_name: req.body?.name,
    passport_id: req.body?.passportId,
    provider: req.body?.provider,
    sponsor: req.body?.sponsor,
    type: req.body?.type,
    employee: req.body?.employee,
    net_fare: req.body?.netFare,
    sales: req.body?.sales,
    profit: req.body?.profit,
    payment_date: req.body?.paymentDate,
    paid_amount: req.body?.paidAmount,
    remaining_amount: req.body?.remainingAmount,
    payment_method: req.body?.paymentMethod,
  });
  res.status(201).json(visa);
};

//@Desc   >>>> UPDATE Visa
//@Route  >>>> PUT /api/visas/:id
//@Access >>>> Private(Admins Only)
const updateVisa = async (req: Request, res: Response) => {
  //Get Visa Wanted For Updating.
  const visa = await Visa.findById(req.params.id);

  //Check if Visa is not exist.
  if (!visa) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Visa With New Values.
    visa.customer_name = req.body?.name;
    visa.passport_id = req.body?.passportId;
    visa.provider = req.body?.provider;
    visa.type = req.body?.type;
    visa.employee = req.body?.employee;
    visa.sponsor = req.body?.sponsor;
    visa.net_fare = req.body?.netFare;
    visa.sales = req.body?.sales;
    visa.profit = req.body?.profit;
    visa.payment_date = req.body?.paymentDate;
    visa.paid_amount = req.body?.paidAmount;
    visa.remaining_amount = req.body?.remainingAmount;
    visa.payment_method = req.body?.paymentMethod;

    //Get Updated Visa info & Send it Back.
    const updatedVisa = await visa.save();
    res.status(200).json(updatedVisa);
  }
};

//@Desc   >>>> Delete one Visa
//@Route  >>>> DELETE /api/Visaa/:id
//@Access >>>> Private(Admins Only)
const deleteVisa = async (req: Request, res: Response) => {
  //Get Visa Wanted For Deleting.
  const deletedVisa = await Visa.findByIdAndDelete(req.params.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedVisa?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Visa id Back
    res.status(200).json({ id: deletedVisa.id });
  }
};

export { getVisas, deleteVisa, createVisa, updateVisa };
