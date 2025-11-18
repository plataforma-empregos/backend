const {
  fetchExternalJobs,
  fetchJobDetails,
} = require("../services/ExternalJobService");

module.exports = {
  async list(req, res) {
    try {
      const { page = 1, limit = 10, keyword = "", location = "" } = req.query;

      if (!keyword.trim()) {
        return res.json({
          total: 0,
          page: Number(page),
          limit: Number(limit),
          data: [],
        });
      }

      const jobs = await fetchExternalJobs(page, limit, keyword, location);

      return res.json(jobs);
    } catch (error) {
      console.error("Erro ao buscar vagas externas:", error.message);
      return res.status(500).json({
        error: "Erro ao buscar vagas externas. Tente novamente mais tarde.",
      });
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: "ID da vaga é obrigatório." });
      }

      const job = await fetchJobDetails(id);

      return res.json(job);
    } catch (error) {
      console.error("Erro ao buscar detalhes da vaga externa:", error.message);
      return res.status(500).json({
        error: "Erro ao buscar detalhes da vaga externa.",
      });
    }
  },
};
