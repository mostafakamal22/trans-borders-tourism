import jwt from "jsonwebtoken";

export const generateAdminsToken = (
  id: string,
  email: string,
  role: string
) => {
  return jwt.sign({ id, email, role }, process.env.JWT_SECRET!);
};
