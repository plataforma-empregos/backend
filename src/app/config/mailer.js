// src/app/config/mailer.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: false, // TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.error("❌ Erro ao conectar no servidor SMTP:", error.message);
  } else {
    console.log("Conectado ao servidor SMTP. Pronto para enviar e-mails.");
  }
});

module.exports = transporter;
