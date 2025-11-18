const nodemailer = require("nodemailer");
const path = require("path");

// ==============================
//  Load .env (outside /src)
// ==============================
require("dotenv").config({
  path: path.resolve(__dirname, "../../../.env"),
});

// ==============================
//  SMTP Disabled flag
// ==============================
const SMTP_DISABLED =
  String(process.env.SMTP_DISABLED).toLowerCase() === "true";

// ==============================
//  Configure transporter
// ==============================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: String(process.env.EMAIL_SECURE).toLowerCase() === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ==============================
//  Verify SMTP before sending
// ==============================
async function checkTransport() {
  if (SMTP_DISABLED) {
    console.log("📧 SMTP desabilitado — nenhum e-mail será enviado.");
    return;
  }

  try {
    await transporter.verify();
    console.log("✅ SMTP conectado. Pronto para enviar.");
  } catch (err) {
    console.error("❌ Falha ao conectar SMTP:", err);
    throw err;
  }
}

// ==============================
//  NEWSLETTER EMAIL
// ==============================
exports.sendNewsletterWelcomeEmail = async (email) => {
  if (SMTP_DISABLED) {
    console.log(
      `✉️ [DEV] Boas-vindas ignorada (SMTP_DISABLED). E-mail: ${email}`
    );
    return { skipped: true };
  }

  await checkTransport();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: email,
    subject: "Bem-vindo(a) à Newsletter do TrampoMatch!",
    html: `
      <h2>🎉 Obrigado por se inscrever!</h2>
      <p>Você receberá novidades e conteúdos exclusivos do TrampoMatch.</p>
      <br/>
      <small>Se não reconhece este e-mail, ignore-o.</small>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`📨 Newsletter enviada para ${email}.`);
    return { sent: true, info };
  } catch (err) {
    console.error("❌ Erro ao enviar newsletter:", err);
    throw err;
  }
};

// ==============================
//  CONTACT FORM EMAIL
// ==============================
exports.sendContactEmail = async ({ name, email, subject, message }) => {
  if (SMTP_DISABLED) {
    console.log(
      `✉️ [DEV] Contato ignorado (SMTP_DISABLED). De: ${email}`
    );
    return { skipped: true };
  }

  await checkTransport();

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: process.env.EMAIL_FROM || process.env.SMTP_USER, // Vai para o admin
    replyTo: email,
    subject: `📬 Novo contato — ${subject}`,
    html: `
      <h2>📩 Nova mensagem de contato</h2>

      <p><strong>Nome:</strong> ${name}</p>
      <p><strong>E-mail:</strong> ${email}</p>
      <p><strong>Assunto:</strong> ${subject}</p>

      <p><strong>Mensagem:</strong><br>${message.replace(/\n/g, "<br/>")}</p>
      <hr/>
      <small>Mensagem enviada automaticamente pelo site TrampoMatch.</small>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("📨 Contato enviado com sucesso.");
    return { sent: true, info };
  } catch (err) {
    console.error("❌ Erro ao enviar contato:", err);
    throw err;
  }
};
