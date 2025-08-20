import jwt from "jsonwebtoken";
export const verifyToken = (
  token,
  secretKey = process.env.JWT_SECRET
) => {
  return jwt.verify(token, secretKey);
};
