const { sendContactEmail } = require("../services/mailService");

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message, consent } = req.body;

    if (!name || !email || !subject || !message) {
      return res
        .status(400)
        .json({ message: "Preencha todos os campos obrigatórios." });
    }

    if (!consent) {
      return res.status(400).json({
        message: "É necessário autorizar o uso dos dados.",
      });
    }

    // Enviar e-mail
    await sendContactEmail({ name, email, subject, message });

    return res
      .status(200)
      .json({ message: "Mensagem enviada com sucesso!" });
  } catch (error) {
    console.error("Erro ao enviar contato:", error);
    return res
      .status(500)
      .json({ message: "Erro interno ao enviar contato." });
  }
};
