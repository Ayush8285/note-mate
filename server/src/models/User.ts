// models/User.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name?: string;
  dob?: Date;
  email: string;
  isVerified: boolean;
  otp?: string;
  otpExpiresAt?: Date;
  avatar?: string;
  provider: "local" | "google";
}

const userSchema = new Schema<IUser>(
  {
    name: String,
    dob: Date,
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpiresAt: Date,
    avatar: String,
    provider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);
export default User;
