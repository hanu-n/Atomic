import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,       // your Gmail
    pass: process.env.EMAIL_PASS,       // app password
  },
});

/**
 * Send email verification link
 * @param {String} email - recipient email
 * @param {String} subject - email subject
 * @param {String} htmlContent - email HTML content
 */
export const sendVerificationEmail = async (email, subject, htmlContent) => {
  const mailOptions = {
    from: `"Atomic MAS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: subject || "Verify Your Email - Atomic MAS",
    html: htmlContent || `
      <h2>Welcome to Atomic MAS 🎉</h2>
      <p>Click below to verify your email:</p>
      <a href="${process.env.CLIENT_URL}/verify-email" target="_blank"
        style="display:inline-block;background:#28a745;color:#fff;
        padding:10px 20px;text-decoration:none;border-radius:5px">
        Verify Email
      </a>
      <p>This link will expire in 1 hour.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
  } catch (err) {
    console.error("❌ Error sending email:", err);
    throw new Error("Email not sent");
  }
};
