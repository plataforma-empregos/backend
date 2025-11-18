const Newsletter = require("../models/Newsletter");
const { sendNewsletterWelcomeEmail } = require("../services/mailService");

exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "E-mail inválido." });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.status(409).json({
        message: "Este e-mail já está inscrito na Newsletter.",
      });
    }

    await Newsletter.create({ email });

    // Envia email automático
    await sendNewsletterWelcomeEmail(email);

    return res.status(201).json({
      message: "Inscrição realizada com sucesso! Bem-vindo(a) à nossa newsletter! 🎉",
    });

  } catch (error) {
    console.error("Erro no Newsletter:", error);
    return res.status(500).json({
      message: "Erro interno ao processar inscrição.",
    });
  }
};
