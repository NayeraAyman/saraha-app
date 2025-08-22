import { Router } from "express";
import * as usreServices from "./user.service.js";
import { fileUpload } from "../../utils/multer/multer.local.js";
import { fileUpload as fileUploadCloud } from "../../utils/multer/multer.cloud.js";
import { fileValidationMiddleware } from "../../middleware/file-validation.middleware.js";
import { isAuthenticated } from "../../middleware/auth.middleware.js";
const router = Router();

router.delete("/", isAuthenticated, usreServices.deleteAccount);
router.post(
  "/upload-profile-picture",
  isAuthenticated,
  fileUpload({ folder: "profile-pictures" }).single("profilePic"),
  fileValidationMiddleware(["image/jpeg", "image/png", "image/webp"]),
  usreServices.uploadProfilePicture
);
router.post(
  "/upload-profile-cloud",
  isAuthenticated,
  fileUploadCloud().single("profilePicture"),
  usreServices.uploadProfilePictureCloud
);
export default router;
