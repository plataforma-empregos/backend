const User = require("../models/User");
const Job = require("../models/Job");

module.exports = {
  async list(req, res) {
    const { page = 1, limit = 10, q } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    const skip = (page - 1) * limit;
    const docs = await User.find(filter)
      .skip(Number(skip))
      .limit(Number(limit))
      .select("-password -refreshTokens")
      .lean();
    const total = await User.countDocuments(filter);
    return res.json({
      data: docs,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  },

  async get(req, res) {
    const user = await User.findById(req.params.id)
      .select("-password -refreshTokens")
      .lean();
    if (!user) return res.status(404).json({ error: "not found" });
    return res.json(user);
  },

  async update(req, res) {
    const updates = req.body;
    delete updates.password;
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).select("-password -refreshTokens");
    if (!user) return res.status(404).json({ error: "not found" });
    return res.json(user);
  },

  async remove(req, res) {
    await User.findByIdAndDelete(req.params.id);
    return res.json({ ok: true });
  },

  async me(req, res) {
    const user = await User.findById(req.userId)
      .select("-password -refreshTokens")
      .lean();
    return res.json(user);
  },

  async getProfile(req, res) {
    const user = await User.findById(req.userId).select("profile").lean();
    return res.json(user ? user.profile : null);
  },

  async updateProfile(req, res) {
    const body = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "not found" });
    user.profile = Object.assign(user.profile || {}, body);
    await user.save();
    return res.json(user.profile);
  },
};
