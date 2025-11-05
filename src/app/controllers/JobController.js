const Job = require("../models/Job");
const SearchHistory = require("../models/SearchHistory");

module.exports = {
  async create(req, res) {
    const data = req.body;
    data.owner = req.userId;
    const job = await Job.create(data);
    return res.json(job);
  },

  async list(req, res) {
    const { page = 1, limit = 10, q, tags, minSalary, maxSalary } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (tags) filter.tags = { $in: String(tags).split(",") };
    if (minSalary)
      filter.salary = { ...(filter.salary || {}), $gte: Number(minSalary) };
    if (maxSalary)
      filter.salary = { ...(filter.salary || {}), $lte: Number(maxSalary) };
    const skip = (page - 1) * limit;
    const docs = await Job.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .populate("owner", "name email")
      .lean();
    const total = await Job.countDocuments(filter);
    return res.json({
      data: docs,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  },

  async get(req, res) {
    const job = await Job.findById(req.params.id)
      .populate("owner", "name email")
      .lean();
    if (!job) return res.status(404).json({ error: "not found" });
    const countSame = await Job.countDocuments({ company: job.company });
    return res.json({ ...job, metrics: { countSameCompany: countSame } });
  },

  async update(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "not found" });
    if (String(job.owner) !== String(req.userId))
      return res.status(403).json({ error: "not allowed" });
    Object.assign(job, req.body);
    await job.save();
    return res.json(job);
  },

  async remove(req, res) {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "not found" });
    if (String(job.owner) !== String(req.userId))
      return res.status(403).json({ error: "not allowed" });
    await job.deleteOne({ _id: job._id });
    return res.json({ ok: true });
  },

  async search(req, res) {
    const { q, page = 1, limit = 10 } = req.query;
    if (!q) return res.status(400).json({ error: "query required" });
    if (req.userId) await SearchHistory.create({ user: req.userId, query: q });
    const filter = { $text: { $search: q } };
    const docs = await Job.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .lean();
    return res.json({
      data: docs,
      meta: { page: Number(page), limit: Number(limit) },
    });
  },

  async searchHistory(req, res) {
    const hist = await SearchHistory.find({ user: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    return res.json(hist);
  },
};
