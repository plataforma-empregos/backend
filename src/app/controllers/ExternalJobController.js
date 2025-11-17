const {
  fetchExternalJobs,
  fetchJobDetails,
} = require("../services/ExternalJobService");

module.exports = {
  async list(req, res) {
    const { page = 1, limit = 10, keyword, location } = req.query;

    if (!keyword) {
      return res.json({ total: 0, page: 1, limit: 10, data: [] });
    }

    try {
      const jobs = await fetchExternalJobs(page, limit, keyword, location);
      return res.json(jobs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },

  async get(req, res) {
    const { id } = req.params;

    try {
      const job = await fetchJobDetails(id);
      return res.json(job);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  },
};
