require("dotenv").config();
const transporter = require("./app/config/mailer");

(async () => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM, // envia pra si mesmo
      subject: "🔍 Teste de envio TrampoMatch",
      text: "Se você recebeu este email, o servidor SMTP está funcionando!",
    });
    console.log("Email enviado:", info.messageId);
  } catch (err) {
    console.error("Erro ao enviar email:", err.message);
  }
})();
