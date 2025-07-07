import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String },
    dob: { type: Date },
    email: { type: String, required: true, unique: true },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpiresAt: { type: Date },
    avatar: { type: String }, // ✅ for Google profile image
    provider: { type: String, default: "local" }, // ✅ 'local' or 'google'
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
