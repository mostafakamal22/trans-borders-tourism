import { Schema, model } from "mongoose";

export interface IAdmin {
  admin_name: string;
  email: string;
  password: string;
  role: string;
}

//Define Admin Schema
const adminSchema = new Schema<IAdmin>(
  {
    admin_name: {
      type: String,
      required: [true, "Please Type your Name!"],
      validate: {
        validator: function (v: string) {
          let regex = new RegExp(
            "^(?=[a-zA-Z0-9._ ]{10,35}$)(?!.*[_.]{2})[^_.].*[^_.]$"
            /*  no >>> _ or . at the beginning
              no >>>__ or _. or ._ or .. inside 
              no >>> _ or . at the end
              [a-zA-Z0-9._] >> allowed characters
              username is {10-} characters long
              */
          );
          return regex.test(v);
        },
        message: "Please Enter A Valid Name!",
      },
    },
    email: {
      type: String,
      required: [true, "Please Type An Email!"],
      unique: true,
      validate: {
        validator: function (v: string) {
          let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
          return regex.test(v);
        },
        message: "Please Enter A Valid Email!",
      },
    },
    password: {
      type: String,
      required: [true, "Please Type A Strong Password!"],
    },
    role: {
      type: String,
      required: [true, "Please Set The Admin Role!"],
      enum: {
        values: ["admin", "owner"],
        message: "{VALUE} is not supported as a Role",
      },
    },
  },
  {
    timestamps: true,
    collection: "Admins",
  }
);

//Define Admin Model
const Admin = model<IAdmin>("Admin", adminSchema);

export default Admin;
