import { User } from "../../DB/model/user.model.js";
import jwt from "jsonwebtoken";
import fs from "node:fs";
export const deleteAccount = async (req, res, next) => {
  //get data from req >> token >> header
  const token = req.headers.authorization.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);
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
};

export const uploadProfilePicture = async (req, res, next) => {
  if (req.user.profilePicture) {
    fs.unlinkSync(req.user.profilePicture);
  }

  const userExist = await User.findByIdAndUpdate(
    req.user._id,
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
