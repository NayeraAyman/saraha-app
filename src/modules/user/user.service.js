import { User } from "../../DB/model/user.model.js";
import fs from "node:fs";
import cloudinary from "../../utils/cloud/cloudinary.config.js";
export const deleteAccount = async (req, res, next) => {
  //delete user folder from cloud
  if (req.user.profilePicture?.public_id) {
    await cloudinary.api.delete_resources_by_prefix(
      `saraha/users/${req.user._id}/`
    );
    await cloudinary.api.delete_folder(`saraha/users/${req.user._id}`);
  }
  //delete user
  await User.deleteOne({ _id: req.user._id });
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

export const uploadProfilePictureCloud = async (req, res, next) => {
  const user = req.user;
  const file = req.file;

  // await cloudinary.uploader.destroy(user.profilePicture.public_id);
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    file.path,
    {
      folder: `saraha/users/${user._id}/profile_picture`,
      public_id: user.profilePicture.public_id,
      overwrite: true,
    }
  );

  await User.updateOne(
    { _id: user._id },
    {
      $set: {
        profilePicture: { secure_url, public_id },
      },
    }
  );

  return res.status(200).json({
    message: "profile picture uploaded successfully",
    success: true,
    data: { secure_url, public_id },
  });
};
