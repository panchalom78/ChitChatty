import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  secure: true,
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: "chitchatty78@gmail.com",
    pass: "hvlvmbfhnonqetcs",
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