import mongoose from "mongoose";
import Passport from "../models/passportModel";
import Bill from "../models/billModel";
import dotenv from "dotenv";
import { connectToMongoose } from "../config/dbConfig";

// Load environment variables from .env file
dotenv.config();

const attachBillIdToPassports = async () => {
  try {
    // Connect to the database
    await connectToMongoose();

    // Fetch all passports
    const passports = await Passport.find({});

    // Loop through each passport and update it with the bill ID
    for (const passport of passports) {
      const bill = await Bill.findOne({
        "details.passport_ref": passport.id,
      });

      // If a matching bill is found, update the passport
      if (bill) {
        await Passport.updateOne(
          { _id: passport._id },
          { $set: { bill_id: bill.ID } }
        );
        console.log(
          `Updated passport ID: ${passport._id} with bill ID: ${bill.ID}`
        );
      }
    }

    console.log("All passports updated with bill IDs");
  } catch (error) {
    console.error("Error attaching bill ID to passports:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the function

attachBillIdToPassports();
