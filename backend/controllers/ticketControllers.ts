import { Request, Response } from "express";
import Ticket from "../models/ticketModel";
import { ErrnoException } from "./adminControllers";

//@desc   >>>> Get All Tickets
//@route  >>>> GET /api/tickets
//@Access >>>> public(For Admins)
const getTickets = async (_req: Request, res: Response) => {
  //Get All Tickets Data & Send it Back.
  const tickets = await Ticket.find();
  res.status(200).json(tickets);
};

//@desc   >>>> Create Ticket
//@route  >>>> POST /api/tickets/
//@Access >>>> public(For Admins)
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

//@desc   >>>> UPDATE Ticket
//@route  >>>> PUT /api/tickets/:id
//@Access >>>> Public(for Admins)
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

//@desc   >>>> Delete one Ticket
//@route  >>>> DELETE /api/tickets/:id
//@Access >>>> public(For Admins)
const deleteTicket = async (req: Request, res: Response) => {
  //Get Ticket Wanted For Deleting & Send Deleted Ticket id Back.
  const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);

  //Check If the Document is Already Deleted Or Not.
  if (!deletedTicket?.id) {
    throw new Error("This Document Has Been Already Deleted!");
  } else {
    res.status(200).json({ id: deletedTicket.id });
  }
};

export { getTickets, deleteTicket, createTicket, updateTicket };
