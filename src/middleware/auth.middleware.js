import { verifyToken } from "../utils/token/index.js";
import { User } from "../DB/model/user.model.js";
export const isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) throw new Error("token is required", { cause: 401 });
  const payload = verifyToken(token);
  const userExist = await User.findById(payload.id);
  if (!userExist) throw new Error("user not found", { cause: 404 });
  req.user = userExist;
  return next();
};
 