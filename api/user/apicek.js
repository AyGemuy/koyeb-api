const fetch = require("node-fetch");
module.exports = {
  name: "cekapikey",
  desc: "Cek status API key dengan mengambil data dari endpoint /apikey/status",
  category: "User",
  async run(req, res) {
    const {
      apikey
    } = req.query;
    if (!apikey) return res.status(400).json({
      status: false,
      error: "API key is required"
    });
    try {
      const url = `${req.protocol}://${req.get("host")}/apikey/status`;
      const response = await fetch(url);
      const data = await response.json();
      if (!data.status) {
        return res.status(403).json({
          status: false,
          error: data.message || "API key invalid"
        });
      }
      const {
        key,
        monthlyUsage,
        monthlyLimit,
        remaining,
        resetDate,
        rateLimit
      } = data;
      res.json({
        status: true,
        result: {
          key: key,
          monthlyUsage: monthlyUsage,
          monthlyLimit: monthlyLimit,
          remaining: remaining,
          resetDate: resetDate,
          rateLimit: rateLimit
        }
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: "Failed to fetch status: " + err.message
      });
    }
  }
};