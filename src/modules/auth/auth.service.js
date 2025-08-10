import { User } from "../../DB/model/user.model.js";
import bcrypt from "bcrypt";
import { sendMail } from "../../utils/email/index.js";
import { generateOtp } from "../../utils/otp/index.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import joi from "joi";

export const register = async (req, res, next) => {
  //get data from req
  const { fullName, email, password, phoneNumber, dob } = req.body;
  //validate data

  //check user existence
  const userExist = await User.findOne({
    $or: [
      {
        $and: [
          { email: { $ne: null } },
          { email: { $exists: true } },
          { email: email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $ne: null } },
          { phoneNumber: { $exists: true } },
          { phoneNumber: phoneNumber },
        ],
      },
    ],
  });
  if (userExist) {
    throw new Error("user already exist", { cause: 409 });
  }
  //prepare Data >> hash password - encrypt phoneNumber >> factory design pattern
  const user = new User({
    fullName,
    email,
    password: bcrypt.hashSync(password, 10),
    phoneNumber,
    dob,
  });
  //generate otp >> one time password
  const { otp, otpExpire } = generateOtp();
  user.otp = otp;
  user.otpExpire = otpExpire;
  //send email verify [otp - link]
  if (email)
    await sendMail({
      to: email,
      subject: "verify your account",
      html: `<p>your otp to verify your account is ${otp} </p>`,
    });
  //create user
  await user.save();

  //send response
  return res
    .status(201)
    .json({ message: "user created successfully", success: true });
};
export const verifyAccount = async (req, res, next) => {
  //get data from req
  const { otp, email } = req.body;
  //check user exist
  const userExist = await User.findOne({
    email,
    otp,
    otpExpire: { $gt: Date.now() },
  });
  if (!userExist) {
    throw new Error("invalid otp", { cause: 401 });
  }
  //update user
  userExist.isVerified = true;
  userExist.otp = undefined;
  userExist.otpExpire = undefined;
  await userExist.save();
  //send response
  return res
    .status(200)
    .json({ message: "user verified successfully", success: true });
};
export const googleLogin = async (req, res, next) => {
  //get data from req
  const { idToken } = req.body;
  //verify idToken
  const client = new OAuth2Client(
    "896886277689-nsn1k78rcgc6jpu7bciuf6thd51sdg7e.apps.googleusercontent.com"
  );
  const ticket = await client.verifyIdToken({ idToken });
  const payload = ticket.getPayload();
  //check user exist
  let userExist = await User.findOne({ email: payload.email });
  if (!userExist) {
    userExist = await User.create({
      email: payload.email,
      fullName: payload.name,
      phoneNumber: payload.phoneNumber,
      dob: payload.birthdate,
      isVerified: true,
      userAgent: "google",
    });
    //generate token
    const token = jwt.sign(
      { id: userExist._id, name: userExist.fullName },
      "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE",
      {
        expiresIn: "15m",
      }
    );
    //send response
    return res.status(200).json({
      message: "user created successfully",
      success: true,
      data: { token },
    });
  }
};
export const resendOtp = async (req, res, next) => {
  //get data from req
  const { email } = req.body;
  //generate otp
  const { otp, otpExpire } = generateOtp();
  //update user
  await User.updateOne({ email }, { otp, otpExpire });

  //send email
  await sendMail({
    to: email,
    subject: "resend otp to verify your account",
    html: `<p>your new otp to verify your account is ${otp} </p>`,
  });
  //send response
  return res
    .status(200)
    .json({ message: "otp resend successfully", success: true });
};
export const login = async (req, res, next) => {
  //get data from req
  const { email, phoneNumber, password } = req.body;
  //check user exixt
  const userExist = await User.findOne({
    isVerified: true,
    $or: [
      {
        $and: [
          { email: { $ne: null } },
          { email: { $exists: true } },
          { email: email },
        ],
      },
      {
        $and: [
          { phoneNumber: { $ne: null } },
          { phoneNumber: { $exists: true } },
          { phoneNumber: phoneNumber },
        ],
      },
    ],
  });
  if (!userExist) {
    throw new Error("invalid credentials", { cause: 401 });
  }
  if (userExist.isVerified === false) {
    throw new Error("user not verified", { cause: 401 });
  }
  //compare password
  const match = bcrypt.compareSync(password, userExist.password);
  if (!match) {
    throw new Error("invalid credentials", { cause: 401 });
  }
  //generate token
  const accessToken = jwt.sign(
    { id: userExist._id, name: userExist.fullName },
    "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE",
    {
      expiresIn: "15m",
    }
  );
  const refreshToken = jwt.sign(
    { id: userExist._id, name: userExist.fullName },
    "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE",
    {
      expiresIn: "7d",
    }
  );
  userExist.refreshToken = refreshToken;
  await userExist.save();
  //send response
  return res.status(200).json({
    message: "user logged in successfully",
    success: true,
    accessToken,
    refreshToken,
  });
};

export const resetPassword = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;
  const userExist = await User.findOne(
    {
      email,
      otp,
      otpExpire: { $gt: Date.now() + 5 * 60 * 1000 },
    },
    { isVerified: true }
  );

  if (!userExist) {
    throw new Error("Invalid or expired OTP", { cause: 400 });
  }

  userExist.password = bcrypt.hashSync(newPassword, 10);

  userExist.otp = undefined;
  userExist.otpExpire = undefined;

  await userExist.save();

  return res.status(200).json({
    message: "Password reset successfully",
    success: true,
  });
};

export const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error("Refresh token required", { cause: 401 });
  const payload = jwt.verify(refreshToken, "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE");

  const user = await User.findById(payload.id);
  if (!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token", { cause: 401 });
  }

  const newAccessToken = jwt.sign(
    { id: user._id, name: user.fullName },
    "kwWKBHEVFGVFRHQBHWFVGEVQWJBFE",
    { expiresIn: "15m" }
  );

  return res.status(200).json({
    message: "Access token refreshed successfully",
    accessToken: newAccessToken,
  });
};
