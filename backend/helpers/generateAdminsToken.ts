import jwt from "jsonwebtoken";

export const generateAdminsToken = (
  id: string,
  role: string
): { accessToken: string; refreshToken: string } => {
  //Create Access Token
  const accessToken = jwt.sign(
    {
      AdminInfo: {
        id,
        role,
      },
    },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: process.env.NODE_ENV === "production" ? "15m" : "5m" }
  );

  //Create Refresh Token
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: process.env.NODE_ENV === "production" ? "1d" : "20m",
  });

  return { accessToken, refreshToken };
};
