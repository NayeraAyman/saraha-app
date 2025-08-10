import jwt from "jsonwebtoken";
export const verifyToken = (
  token,
  secretKey = "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE"
) => {
  return jwt.verify(token, secretKey);
};
