import mongoose from "mongoose";
import Ticket from "../models/ticketModel";
import Bill from "../models/billModel";
import dotenv from "dotenv";
import { connectToMongoose } from "../config/dbConfig";

// Load environment variables from .env file
dotenv.config();

const attachBillIdToTickets = async () => {
  try {
    // Connect to the database
    await connectToMongoose();

    // Fetch all tickets
    const tickets = await Ticket.find({});

    // Loop through each ticket and update it with the bill ID
    for (const ticket of tickets) {
      const bill = await Bill.findOne({
        "details.ticket_ref": ticket.id,
      });

      // If a matching bill is found, update the ticket
      if (bill) {
        await Ticket.updateOne(
          { _id: ticket._id },
          { $set: { bill_id: bill.ID } }
        );
        console.log(
          `Updated ticket ID: ${ticket._id} with bill ID: ${bill.ID}`
        );
      }
    }

    console.log("All tickets updated with bill IDs");
  } catch (error) {
    console.error("Error attaching bill ID to tickets:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the function

attachBillIdToTickets();
