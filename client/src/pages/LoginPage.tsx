import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  sendLoginOtp,
  verifyOtp,
  resendOtp,
  googleAuthLogin,
} from "../api/auth";
import { Eye, EyeOff } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import { useGoogleLogin } from "@react-oauth/google";

const FloatingLabelInput = ({
  label,
  type,
  name,
  value,
  onChange,
  toggleIcon,
  disabled = false,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  toggleIcon?: React.ReactNode;
  disabled?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const showLabel = isFocused || value;

  return (
    <div className="relative w-full mb-6">
      <AnimatePresence>
        {showLabel && (
          <motion.label
            htmlFor={name}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: -6 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className={`absolute left-3 px-1 text-xs ${
              isFocused ? "text-blue-600" : "text-gray-500"
            } bg-white z-10`}
          >
            {label}
          </motion.label>
        )}
      </AnimatePresence>
      <input
        type={type}
        name={name}
        id={name}
        value={value}
        disabled={disabled}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={showLabel ? "" : label}
        className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
      />
      {toggleIcon && (
        <span className="absolute right-3 top-3 cursor-pointer text-gray-500">
          {toggleIcon}
        </span>
      )}
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [remember, setRemember] = useState(false);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  const handleGetOtp = async () => {
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    try {
      setLoading(true);
      await sendLoginOtp({ email: formData.email });
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login error");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!formData.otp.trim()) {
      toast.error("OTP is required");
      return;
    }
    try {
      const res = await verifyOtp({ email: formData.email, otp: formData.otp });
      if (remember) localStorage.setItem("token", res.token);
      else sessionStorage.setItem("token", res.token);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "OTP error");
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendOtp({ email: formData.email });
      toast.success("OTP resent successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await googleAuthLogin({
          token: tokenResponse.access_token,
        });

        console.log("📦 Full backend response:", res);

        const token = res?.token;
        if (!token) {
          toast.error("Login failed: No token received");
          return;
        }

        // Optional: Save user data too
        const user = res.user;
        console.log("👤 Logged in user:", user);

        if (remember) localStorage.setItem("token", token);
        else sessionStorage.setItem("token", token);

        toast.success("Google login successful");
        navigate("/dashboard");
      } catch (err: any) {
        console.error("❌ Error during backend Google login:", err);
        toast.error(err.response?.data?.error || "Google login failed");
      }
    },
    onError: () => toast.error("Google login failed"),
  });

  return (
    <div className="min-h-screen flex bg-white text-gray-800 w-full py-4 px-2">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Left Panel */}
      <div className="w-full md:w-[40%] flex flex-col px-6 md:px-20 py-8 items-center md:items-start text-center md:text-left">
        {/* Logo */}
        <div className="flex items-center justify-center md:justify-start space-x-2 mb-8">
          <img src="/assets/logo1.jpg" alt="Logo" className="w-7 h-7 rounded" />
          <h1 className="text-xl font-bold">Note Mate</h1>
        </div>

        {/* Form */}
        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="w-full md:max-w-[380px] mx-auto md:mx-0">
            <h2 className="text-3xl font-semibold mb-2">Sign In</h2>
            <p className="text-sm text-gray-500 mb-6">
              Please login to continue to your account.
            </p>

            <FloatingLabelInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={otpSent}
            />

            <AnimatePresence>
              {otpSent && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <FloatingLabelInput
                    label="OTP"
                    type={otpVisible ? "text" : "password"}
                    name="otp"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    toggleIcon={
                      otpVisible ? (
                        <EyeOff
                          size={18}
                          onClick={() => setOtpVisible(false)}
                        />
                      ) : (
                        <Eye size={18} onClick={() => setOtpVisible(true)} />
                      )
                    }
                  />
                  <div className="flex items-center justify-between text-sm mb-2">
                    <button
                      onClick={handleResend}
                      disabled={resendLoading}
                      className="text-blue-600 hover:underline flex items-center gap-2"
                    >
                      {resendLoading && (
                        <svg
                          className="animate-spin h-4 w-4 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                          ></path>
                        </svg>
                      )}
                      {resendLoading ? "Sending..." : "Resend OTP"}
                    </button>

                    <label className="flex items-center gap-2 text-gray-600">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={() => setRemember(!remember)}
                      />
                      Keep me logged in
                    </label>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={otpSent ? handleVerify : handleGetOtp}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium transition flex items-center justify-center gap-2 cursor-pointer"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : otpSent ? (
                "Sign In"
              ) : (
                "Get OTP"
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center my-5">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            {/* Google Login Button */}
            <button
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-100 transition cursor-pointer"
            >
              <img
                src="/assets/google-logo.svg"
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-sm text-gray-700 font-medium">
                Continue with Google
              </span>
            </button>

            <p className="text-sm mt-4 text-center">
              Need an account?{" "}
              <Link to="/signup" className="text-blue-600 underline font-medium">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="hidden md:flex w-[60%] items-center justify-center bg-white">
        <img
          src="/assets/signin.jpeg"
          alt="Sign In Visual"
          className="max-w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default LoginPage;
