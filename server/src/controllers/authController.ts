import axios from "axios";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { sendOtpEmail } from "../utils/sendOtp";

// ✅ Signup (Name, DOB, Email)
export const sendSignupOtp = async (req: any, res: any) => {
  const { email, name, dob } = req.body;
  if (!email || !name || !dob) {
    return res.status(400).json({ error: "Name, DOB, and Email are required" });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return res
      .status(400)
      .json({ error: "User already exists, please log in" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const newUser = new User({
    email,
    name,
    dob,
    otp,
    otpExpiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  await newUser.save();
  await sendOtpEmail(email, otp);

  return res.json({ message: "OTP sent to email" });
};

// ✅ Login (only Email)
export const sendLoginOtp = async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(404)
      .json({ error: "User not found. Please sign up first." });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otp);

  return res.json({ message: "OTP sent to email" });
};

export const verifyOtp = async (req: any, res: any) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email });

  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = undefined;
  user.otpExpiresAt = undefined;
  await user.save();

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
    expiresIn: "1h",
  });

  res.json({
    token,
    user: {
      email: user.email,
      name: user.name,
      dob: user.dob,
    },
  });
};

export const resendOtp = async (req: any, res: any) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await user.save();

  await sendOtpEmail(email, otp);
  return res.json({ message: "OTP resent successfully" });
};

export const googleLogin = async (req: any, res: any) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Missing Google token" });
  }

  try {
    // STEP 2: Fetch user info from Google
    const googleRes = await axios.get(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${token}`
    );

    const { email, name, picture } = googleRes.data;

    if (!email) {
      return res
        .status(400)
        .json({ error: "Failed to fetch Google user info" });
    }

    // STEP 4: Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        email,
        name,
        avatar: picture,
        isVerified: true,
        provider: "google",
      });
      await user.save();
    }

    // STEP 5: Generate JWT
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({
      token: jwtToken,
      user: {
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err: any) {
    res.status(500).json({ error: "Google login failed" });
  }
};
