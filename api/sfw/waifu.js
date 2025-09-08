const axios = require("axios");
const path = require("path");
module.exports = {
  name: "waifu",
  desc: "Random waifu from waifu.pics",
  category: "SFW",
  async run(req, res) {
    try {
      const {
        data
      } = await axios.get("https://api.waifu.pics/sfw/waifu");
      const fileUrl = data?.url;
      if (!fileUrl) return res.status(500).json({
        status: false,
        error: "No media found"
      });
      const ext = path.extname(fileUrl).toLowerCase();
      const response = await axios.get(fileUrl, {
        responseType: "arraybuffer"
      });
      const contentType = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".mp4": "video/mp4"
      } [ext] || "application/octet-stream";
      res.setHeader("Content-Type", contentType);
      res.send(response.data);
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};