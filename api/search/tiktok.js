const axios = require("axios");
module.exports = {
  name: "Tiktok",
  desc: "Cari video TikTok berdasarkan kata kunci",
  category: "Search",
  params: ["query", "count"],
  async run(req, res) {
    const {
      query,
      count
    } = req.query;
    if (!query) return res.status(400).json({
      status: false,
      error: "Parameter query wajib diisi!"
    });
    try {
      const response = await axios.get(`https://www.tikwm.com/api/feed/search`, {
        params: {
          keywords: query,
          count: count || 10
        },
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json"
        }
      });
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(response.data));
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};