import { IAdmin } from "./models/adminModel";

export {};

declare global {
  namespace Express {
    interface Request {
      admin: IAdmin;
    }
  }
}
