const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: "info@nangalbycycle.com",
    pass: "NBC@2023-2025",
  },
  tls: {
    rejectUnauthorized: false,
  },
  debug: true,
});

const transporter2 = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: "nangalbycycle@gmail.com",
    pass: "jlgh gtcg guue pzxq", // App password
  },
});

module.exports = { transporter, transporter2 };
