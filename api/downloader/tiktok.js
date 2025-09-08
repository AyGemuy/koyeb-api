const axios = require("axios");
async function scrapeTikwm(videoUrl) {
  try {
    const response = await axios.get(`https://www.tikwm.com/api/`, {
      params: {
        url: videoUrl
      },
      headers: {
        "User-Agent": "Mozilla/5.0",
        Accept: "application/json"
      }
    });
    const data = response.data;
    return data;
  } catch (err) {
    return {
      status: false,
      error: err.message
    };
  }
}
module.exports = {
  name: "Tiktok",
  desc: "Download video TikTok via Tikwm",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    const result = await scrapeTikwm(url);
    res.setHeader("Content-Type", "application/json");
    return res.end(JSON.stringify(result));
  }
};