import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();  // Load environment variables from.env file.

const transport = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASS,
  },
});

function send(to,msg) {
    const message = `You requested to reset your password. Please click the link below to reset it:\n\n${msg}\n\nIf you did not request this, please ignore this email.`
  transport.sendMail({
    to: to,
    subject: "Password reset request for ChitChatty.",
    text: message,
  });
}

export default send; 