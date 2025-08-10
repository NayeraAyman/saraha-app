import { User } from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import { verifyToken } from "../../utils/token/index.js";
export const deleteAccount = async (req, res, next) => {
  try {
    //get data from req >> token >> header
    const token = req.headers.authorization.split(" ")[1];
    const payload = jwt.verify(token, "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE");
    const { id, name } = payload;
    //delete user
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error("user not found", { cause: 404 });
    }
    //send response
    return res
      .status(200)
      .json({ message: "user deleted successfully", success: true });
  } catch (error) {
    return res
      .status(error.cause || 500)
      .json({ message: error.message, success: false });
  }
};

export const uploadProfilePicture = async (req, res, next) => {
  const token = req.headers.authorization;
  const { id } = verifyToken(token);

  const userExist = await User.findByIdAndUpdate(
    id,
    { profilePicture: req.file.path },
    { new: true }
  );
  if (!userExist) {
    throw new Error("user not found", { cause: 404 });
  }
  return res
    .status(200)
    .json({ message: "profile picture uploaded successfully", success: true });
};
