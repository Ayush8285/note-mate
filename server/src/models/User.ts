import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  dob: Date,
  email: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  otp: String,
  otpExpiresAt: Date,
});


export default mongoose.model("User", userSchema);
