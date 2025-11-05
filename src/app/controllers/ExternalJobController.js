// src/app/controllers/ExternalJobController.js
const { fetchExternalJobs } = require('../services/ExternalJobService');

module.exports = {
  async list(req, res) {
    const { page = 1, limit = 10 } = req.query;
    try {
      const jobs = await fetchExternalJobs(page, limit);
      return res.json(jobs);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
};
