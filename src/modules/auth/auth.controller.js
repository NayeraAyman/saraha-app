import { Router } from "express";
import * as authServices from "./auth.service.js";
import { isValid } from "../../middleware/validation.middleware.js";
import { registerSchema } from "./auth.validation.js";

const router = Router();

router.post("/register", isValid(registerSchema), authServices.register);
router.post("/login", authServices.login);
router.post("/verify-account", authServices.verifyAccount);
router.post("/resend-otp", authServices.resendOtp);
router.post("/google-login", authServices.googleLogin);
router.post("/reset-password", authServices.resetPassword);
router.post("/refresh-token", authServices.refreshAccessToken);
export default router;
