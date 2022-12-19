import mongoose from "mongoose";

const { connection, connect, set } = mongoose;

//For Warning:- the `strictQuery` option will be switched back to `false` by default
set("strictQuery", false);

export const connectToMongoose = async () => {
  //Connecting State
  connection.on("connecting", () => {
    console.log("Connecting To MongoDb");
  });

  //Connected State
  connection.on("connected", () => {
    console.log("Connected To MongoDb");
  });

  //Disconnecting State
  connection.on("disconnecting", () => {
    console.log("Disconnecting MongoDb");
  });

  //Disconnected State
  connection.on("disconnected", () => {
    console.log("MongoDb is Disconnected");
  });

  //Reconnected State
  connection.on("reconnected", () => {
    console.log("MongoDb is Reconnected");
  });

  //Error After First inialize State
  connection.on("error", () => {
    console.log("MongoDB Connection Error!");
  });

  //Open Connection to MongoDB
  await connect(process.env.MONGO_URI!, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
  });
};
