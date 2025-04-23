const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  secure: true,
  secureConnection: false,
  tls: {
    ciphers: "SSLv3",
  },
  requireTLS: true,
  port: 465,
  debug: true,
  auth: {
    user: "info@nangalbycycle.com",
    pass: "NBC@2023-2025",
  },
});

const transporter2 = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    secure: true, 
    auth: {
      user: "nangalbycycle@gmail.com",
      pass: "jlgh gtcg guue pzxq",
    },
  });

module.exports = {transporter, transporter2};