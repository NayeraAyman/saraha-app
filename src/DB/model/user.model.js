import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: function () {
        // || function return value
        if (this.phoneNumber) {
          return false;
        }
        return true;
      },
      // unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function () {
        if (this.userAgent === "google") {
          return false;
        }
        return true;
      },
    },
    phoneNumber: {
      type: String,
      required: function () {
        if (this.email) {
          return false;
        }
        return true;
      },
      // unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    dob: {
      type: Date,
    },
    otp: {
      type: Number,
    },
    otpExpire: {
      type: Date,
    },
    userAgent: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    profilePicture: {
      secure_url: String,
      public_id: String,
    },
    refreshToken: {
      type: String,
    },
    failedOtpAttempts: {
      type: Number,
      default: 0,
    },
    bannedUntil: {
      type: Date,
      default: null,
    },
    
  },
  { timestamps: true, toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});
userSchema.virtual("fullName").set(function (value) {
  const [firstName, lastName] = value.split(" ");
  this.firstName = firstName;
  this.lastName = lastName;
});
userSchema.virtual("age").get(function () {
  return new Date().getFullYear() - new Date(this.dob).getFullYear();
});

export const User = model("User", userSchema);
