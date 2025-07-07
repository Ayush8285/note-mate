import React, { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendSignupOtp, verifyOtp, googleAuthLogin } from "../api/auth";
import OTPInput from "../components/Auth/OTPInput";
import { useGoogleLogin } from "@react-oauth/google";

const FloatingLabelInput = ({
  label,
  type,
  name,
  value,
  onChange,
}: {
  label: string;
  type: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
            animate={{ opacity: 1, y: -4 }}
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
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={showLabel ? "" : label}
        className="w-full bg-white border border-gray-300 rounded px-4 py-3 text-sm 
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
      />
    </div>
  );
};

const DateInput = forwardRef<HTMLInputElement, any>(
  ({ value, onClick, onFocus, onBlur }, ref) => (
    <input
      type="text"
      ref={ref}
      onClick={onClick}
      onFocus={onFocus}
      onBlur={onBlur}
      value={value}
      placeholder="Date of Birth"
      readOnly
      className="w-full border border-gray-300 rounded px-4 py-3 text-sm pl-10 
      focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
  )
);

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    email: "",
    otp: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDateFocused, setIsDateFocused] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(true); // or false, as default

  const validateForm = () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.dob.trim()) return toast.error("Date of Birth is required");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim()))
      return toast.error("Please enter a valid email address");
    return true;
  };

  const handleGetOtp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      await sendSignupOtp(formData);
      toast.success("OTP sent successfully");
      setOtpSent(true);
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!formData.otp.trim()) return toast.error("OTP is required");
    setLoading(true);
    try {
      const res = await verifyOtp({ email: formData.email, otp: formData.otp });
      localStorage.setItem("token", res.token);
      toast.success("Signup successful");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
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
    <div className="min-h-screen flex flex-col md:flex-row bg-white text-gray-800 py-1 px-2">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="w-full md:w-[40%] flex flex-col items-center md:items-start px-4 md:px-20 py-3 text-center md:text-left">
        <div className="flex items-center justify-center md:justify-start space-x-2 mb-6">
          <img
            src="/assets/logo1.jpg"
            alt="Note Logo"
            className="w-6 h-6 rounded"
          />
          <h1 className="text-xl font-bold">Note Mate</h1>
        </div>

        <div className="flex-1 flex flex-col justify-center w-full">
          <div className="w-full md:max-w-[380px] space-y-6 mx-auto md:mx-0">
            <h2 className="text-3xl font-semibold">Sign up</h2>
            <p className="text-sm text-gray-500">
              Sign up to enjoy the features
            </p>

            <FloatingLabelInput
              label="Your Name"
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />

            <div className="relative w-full mb-6">
              <AnimatePresence>
                {(selectedDate || isDateFocused) && (
                  <motion.label
                    htmlFor="dob"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: -4 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-3 px-1 text-xs ${
                      isDateFocused ? "text-blue-600" : "text-gray-500"
                    } bg-white z-10`}
                  >
                    Date of Birth
                  </motion.label>
                )}
              </AnimatePresence>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 pointer-events-none z-10">
                  <Calendar size={18} />
                </div>
                <DatePicker
                  selected={selectedDate}
                  onChange={(date: Date | null) => {
                    setSelectedDate(date);
                    if (date) {
                      const formatted = format(date, "dd MMMM yyyy");
                      setFormData({ ...formData, dob: formatted });
                    }
                  }}
                  onFocus={() => setIsDateFocused(true)}
                  onBlur={() => setIsDateFocused(false)}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Date of Birth"
                  customInput={<DateInput />}
                />
              </div>
            </div>

            <FloatingLabelInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            {otpSent && (
              <OTPInput
                value={formData.otp}
                onChange={(val) => setFormData({ ...formData, otp: val })}
              />
            )}

            <button
              onClick={otpSent ? handleVerify : handleGetOtp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-medium transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
              ) : otpSent ? (
                "Sign up"
              ) : (
                "Get OTP"
              )}
            </button>

            <div className="flex items-center my-5">
              <hr className="flex-grow border-gray-300" />
              <span className="px-4 text-gray-500 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <button
              onClick={() => googleLogin()}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-100 transition"
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

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <a href="/login" className="text-blue-600 underline font-medium">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden md:flex w-[60%] items-center justify-center bg-white">
        <img
          src="/assets/signup.jpeg"
          alt="Signup Visual"
          className="max-w-full h-auto object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default SignupPage;
