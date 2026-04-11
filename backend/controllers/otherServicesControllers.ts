import { Request, Response } from "express";
import Bill from "../models/billModel";

//@Desc   >>>> Get All OtherServies That Match Query Object.
//@Route  >>>> POST /api/otherServies/query
//@Access >>>> Private(Admins Only)
const getOtherServices = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  //Prepare Queries for Mongoose Query.
  const queries = {
    //Filter By Products Type "Other" and optionally by description
    details: {
      $elemMatch: {
        type: "Other",
        // ...(query?.desc && {
        //   desc: new RegExp(`${query?.desc}`, "gi"),
        // }),
      },
    },
    ...(query?.name && {
      //Filter By customer name
      "customer.name": new RegExp(`${query?.name}`, "gi"),
    }),
  };

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { createdAt: "desc" },
    ...option,
  };

  //Get All Other ervies Data That Match Query & Send it Back.
  const bills = await Bill.paginate(queries, options);

  // Flatten and extract only "Other" type services from bills
  if (bills.docs && bills.docs.length > 0) {
    const otherServices = bills.docs.flatMap((bill: any) =>
      bill.details
        .filter((detail: any) => detail.type === "Other")
        .map((service: any) => ({
          id: service._id,
          type: service.type,
          desc: service.desc,
          price: service.price,
          quantity: service.quantity,
          date: bill.date,
          bill_id: bill.ID,
          bill_customer_name: bill.customer?.name || null,
          data: service.data,
        })),
    );

    bills.docs = otherServices;
  }

  res.status(200).json(bills);
};

export { getOtherServices };
