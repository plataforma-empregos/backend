const Job = require('../models/Job');

class JobController {
  async index(req, res) {
    const jobs = await Job.findAll();
    return res.json(jobs);
  }

  async store(req, res) {
    const job = await Job.create(req.body);
    return res.json(job);
  }
}

module.exports = new JobController();
