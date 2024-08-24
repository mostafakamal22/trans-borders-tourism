import Ticket from "../models/ticketModel";
import cache from "../lib/node-cache";
import Bill from "../models/billModel";
import { ticketsChartsCalculations } from "../calculations/tickets";
import { Request, Response } from "express";
import { ErrnoException } from "./adminControllers";

//@Desc   >>>> Get All Tickets That Match Query Object.
//@Route  >>>> POST /api/tickets/query
//@Access >>>> Private(Admins Only)
const getTickets = async (req: Request, res: Response) => {
  //Get Query & Option Objects From Req.
  const { query, option } = req.body;

  const customerName = query?.customerName ? query.customerName : "";
  const employee = query?.employee ? query.employee : "";
  const supplier = query?.supplier ? query.supplier : "";
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

        //Filter By Ticket Type.
        type: new RegExp(`${type}`, "gi"),

        //Filter By Ticket Supplier.
        supplier: new RegExp(`${supplier}`, "gi"),

        //Filter By Ticket Customer Name.
        customer_name: new RegExp(`${customerName}`, "gi"),

        //Filter By Ticket Employee.
        employee: new RegExp(`${employee}`, "gi"),

        //Filter By Ticket Payment Method.
        payment_method: new RegExp(`${paymentMethod.join("|")}`, "gi"),
      }
    : {};

  //Define Query Option
  const options = {
    pagination: query ? true : false,
    sort: { payment_date: "desc", createdAt: "desc" },
    ...option,
  };

  //Get All Tickets Data That Match Query.
  const tickets = await Ticket.paginate(queries, options);

  // Add bill_id to each ticket
  const ticketsWithBillId = await Promise.all(
    tickets.docs.map(async (ticket) => {
      const bill = await Bill.findOne({
        "details.ticket_ref": ticket.id,
      });
      return {
        ...ticket,
        bill_id: bill ? bill.ID : null,
      };
    })
  );

  // Send the response
  res.status(200).json({
    ...tickets,
    docs: ticketsWithBillId,
  });
};

//@Desc   >>>> GET ONE Ticket
//@Route  >>>> GET /api/tickets/:id
//@Access >>>> Private(Admins Only)
const getOneTicket = async (req: Request, res: Response) => {
  const ticket = await Ticket.findById(req.params?.id);

  //Check if Ticket is not exist.
  if (!ticket) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Send Ticket.
    res.status(200).json(ticket);
  }
};

//@Desc   >>>> Create Ticket
//@Route  >>>> POST /api/tickets/
//@Access >>>> private(For Admins)
const createTicket = async (req: Request, res: Response) => {
  //Create New Ticket With Request Data & Send Created Ticket Back.
  const ticket = await Ticket.create({
    customer_name: req.body?.name,
    employee: req.body?.employee,
    supplier: req.body?.supplier,
    type: req.body?.type,
    cost: req.body?.cost,
    sales: req.body?.sales,
    profit: req.body?.profit,
    payment_date: req.body?.paymentDate,
    paid_amount: req.body?.paidAmount,
    remaining_amount: req.body?.remainingAmount,
    payment_method: req.body?.paymentMethod,
  });
  res.status(201).json(ticket);
};

//@Desc   >>>> UPDATE Ticket
//@Route  >>>> PUT /api/tickets/:id
//@Access >>>> Private(for Admins)
const updateTicket = async (req: Request, res: Response) => {
  //Get Ticket Wanted For Updating.
  const ticket = await Ticket.findById(req.params.id);

  //Check if Ticket is not exist.
  if (!ticket) {
    const error: ErrnoException = new Error();
    error.name = "CastError";
    error.path = "_id";
    throw error;
  } else {
    //Update Ticket With New Values.
    ticket.customer_name = req.body?.name;
    ticket.supplier = req.body?.supplier;
    ticket.employee = req.body?.employee;
    ticket.type = req.body?.type;
    ticket.cost = req.body?.cost;
    ticket.sales = req.body?.sales;
    ticket.profit = req.body?.profit;
    ticket.payment_date = req.body?.paymentDate;
    ticket.paid_amount = req.body?.paidAmount;
    ticket.remaining_amount = req.body?.remainingAmount;
    ticket.payment_method = req.body?.paymentMethod;

    //Get Updated Ticket info & Send it Back.
    const updatedTicket = await ticket.save();
    res.status(200).json(updatedTicket);
  }
};

//@Desc   >>>> Delete one Ticket
//@Route  >>>> DELETE /api/tickets/:id
//@Access >>>> private(For Admins)
const deleteTicket = async (req: Request, res: Response) => {
  //Get Ticket Wanted For Deleting.
  const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedTicket?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    //Send Deleted Ticket id Back
    res.status(200).json({ id: deletedTicket.id });
  }
};

//@Desc   >>>> Get Tickets Statistics.
//@Route  >>>> GET /api/tickets/statistics
//@Access >>>> Private(Admins Only)
const getTicketsStatistics = async (_req: Request, res: Response) => {
  // Try to get statistics from cache
  const cachedStatistics = cache.get("tickets-statistics");

  if (cachedStatistics) {
    // If statistics are cached, return them
    res.status(200).json(cachedStatistics);
  } else {
    // If not cached, fetch tickets data from the database
    const tickets = await Ticket.find({});

    // Perform calculations on tickets data
    const statistics = ticketsChartsCalculations(tickets);

    // Cache the statistics with an expiration time (e.g., one day)
    cache.set("tickets-statistics", statistics, 86400); // 86400 seconds = 1 day

    // Send the response with the calculated statistics
    res.status(200).json(statistics);
  }
};

export {
  getTickets,
  getOneTicket,
  deleteTicket,
  createTicket,
  updateTicket,
  getTicketsStatistics,
};
