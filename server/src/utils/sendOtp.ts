import nodemailer from "nodemailer";

export const sendOtpEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASS!,
    },
  });

  await transporter.sendMail({
    from: `"Note App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP for Note App Login",
    html: `<p>Your OTP is <b>${otp}</b>. It is valid for 5 minutes.</p>`,
  });
};
