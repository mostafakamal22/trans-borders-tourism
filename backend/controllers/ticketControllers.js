const Ticket = require("../models/ticketModel");

//@desc   >>>> Get All Tickets
//@route  >>>> GET /api/tickets
//@Access >>>> public(For Admins)
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Create Ticket
//@route  >>>> POST /api/tickets/
//@Access >>>> public(For Admins)
const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      customer_name: req.body?.name,
      employee: req.body?.employee,
      supplier: req.body?.supplier,
      type: req.body?.type,
      cost: req.body?.cost,
      sales: req.body?.sales,
      profit: req.body?.profit,
      payment_date: req.body?.paymentDate,
    });
    res.status(201).json(ticket);
  } catch (error) {
    if (
      error.message.match(
        /(customer_name|booking|payment_date|profit|sales|cost|type|supplier|employee)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }

    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> UPDATE Ticket
//@route  >>>> PUT /api/tickets/:id
//@Access >>>> Public(for Admins)
const updateTicket = async (req, res) => {
  try {
    //get Ticket
    const ticket = await Ticket.findById(req.params.id);

    //update Ticket with new values
    ticket.customer_name = req.body?.name;
    ticket.supplier = req.body?.supplier;
    ticket.employee = req.body?.employee;
    ticket.type = req.body?.type;
    ticket.cost = req.body?.cost;
    ticket.sales = req.body?.sales;
    ticket.profit = req.body?.profit;
    ticket.payment_date = req.body?.paymentDate;
    //get updated tickets info & send it back
    const updatedTicket = await ticket.save();

    res.status(200).json(updatedTicket);
  } catch (error) {
    if (
      error.message.match(
        /(customer_name|booking|payment_date|profit|sales|cost|type|supplier|employee)/gi
      )
    ) {
      return res.status(400).send(error.message);
    }
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

//@desc   >>>> Delete one Ticket
//@route  >>>> DELETE /api/tickets/:id
//@Access >>>> public(For Admins)
const deleteTicket = async (req, res) => {
  try {
    const deletedTicket = await Ticket.findByIdAndDelete(req.params.id);
    res.status(200).json({ id: deletedTicket.id });
  } catch (error) {
    res.status(500).send("Ooops!! Something Went Wrong, Try again...");
  }
};

module.exports = {
  getTickets,
  deleteTicket,
  createTicket,
  updateTicket,
};
