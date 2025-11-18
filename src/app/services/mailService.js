const nodemailer = require("nodemailer");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

const SMTP_DISABLED = String(process.env.SMTP_DISABLED).toLowerCase() === "true";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.EMAIL_SECURE) === "true", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function checkTransport() {
  if (SMTP_DISABLED) {
    console.log("📧 SMTP está desabilitado (SMTP_DISABLED=true) — não haverá envio.");
    return;
  }
  try {
    await transporter.verify();
    console.log("✅ SMTP conectado com sucesso. Pronto para enviar e-mails.");
  } catch (err) {
    console.error("❌ Falha ao verificar transporte SMTP:", err);
    throw err;
  }
}

exports.sendNewsletterWelcomeEmail = async (email) => {
  if (SMTP_DISABLED) {
    console.log(`✉️ [DEV] Inscrição de ${email} salva, envio de e-mail pulado por SMTP_DISABLED.`);
    return { skipped: true };
  }

  // Verifica o transporte antes de enviar
  await checkTransport();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Bem-vindo(a) à Newsletter do TrampoMatch!",
    html: `
      <h2>🎉 Obrigado por se inscrever!</h2>
      <p>Agora você receberá novidades sobre empregos e conteúdos exclusivos do TrampoMatch diretamente no seu e-mail.</p>
      <p>Estamos felizes em ter você conosco! 💙</p>
      <hr/>
      <small>Se não quiser mais receber, ignore este e-mail.</small>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ E-mail enviado para ${email}. messageId=${info.messageId}`);

    if (info?.response) console.log("response:", info.response);
    if (info?.accepted) console.log("accepted:", info.accepted);
    return { sent: true, info };
  } catch (err) {
    console.error("❌ Erro ao enviar e-mail de boas-vindas:", err);
    throw err;
  }
};
