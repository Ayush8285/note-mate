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
    subject: "🔐 Your OTP for Note Mate App Login",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 8px; border: 1px solid #e0e0e0; background-color: #f9f9f9;">
        <h2 style="color: #2b6cb0;">🔐 One-Time Password (OTP)</h2>
        <p>Hello there,</p>
        <p>Use the following OTP to complete your login to <strong>Note App</strong>:</p>
        <div style="font-size: 24px; font-weight: bold; background-color: #e0f2fe; color: #2b6cb0; padding: 12px 20px; text-align: center; border-radius: 6px; letter-spacing: 2px; margin: 20px 0;">
          ${otp}
        </div>
        <p>This OTP is valid for <strong>5 minutes</strong>. Please do not share it with anyone.</p>
        <p style="margin-top: 30px;">If you did not request this, you can safely ignore this email.</p>
        <hr style="margin-top: 30px;" />
        <p style="font-size: 12px; color: #888;">© ${new Date().getFullYear()} Note App. All rights reserved.</p>
      </div>
    `,
  });
  
};
