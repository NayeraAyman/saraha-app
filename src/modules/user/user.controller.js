import { Router } from "express";
import * as usreServices from "./user.service.js";
import { fileUpload } from "../../utils/multer/index.js";
const router = Router();

router.delete("/", usreServices.deleteAccount);
router.post(
  "/upload-profile-picture",
  fileUpload().single("profilePicture"),
  usreServices.uploadProfilePicture
);
export default router;
