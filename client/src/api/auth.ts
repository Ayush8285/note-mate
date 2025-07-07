import axios from "axios";

const API = "http://localhost:5000/api/auth";

export const sendSignupOtp = (data: { name: string; dob: string; email: string }) =>
  axios.post(`${API}/signup/send-otp`, data).then((res) => res.data);

export const sendLoginOtp = (data: { email: string }) =>
  axios.post(`${API}/login/send-otp`, data).then((res) => res.data);

export const resendOtp = (data: { email: string }) =>
  axios.post(`${API}/resend-otp`, data).then((res) => res.data);

export const verifyOtp = (data: { email: string; otp: string }) =>
  axios.post(`${API}/verify-otp`, data).then((res) => res.data);

// ✅ NEW: Google Login
export const googleAuthLogin = (data: { token: string }) =>
  axios.post(`${API}/google-login`, data).then((res) => res.data);
