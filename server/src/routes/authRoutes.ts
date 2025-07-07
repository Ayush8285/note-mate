import express from 'express';
import { sendLoginOtp,sendSignupOtp, verifyOtp, resendOtp } from '../controllers/authController';

const router = express.Router();

router.post('/signup/send-otp', sendSignupOtp);  // new user
router.post('/login/send-otp', sendLoginOtp);    // existing user
router.post('/verify-otp', verifyOtp);           // same as before
router.post('/resend-otp', resendOtp); // new route



export default router;
