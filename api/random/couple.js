const couple = require("../../lib/couple.json");
const axios = require("axios");
module.exports = {
  name: "Couple",
  desc: "Random couple image",
  category: "Random",
  async run(req, res) {
    try {
      const pick = couple[Math.floor(Math.random() * couple.length)];
      if (!pick) return res.status(404).json({
        status: false,
        message: "Tidak ditemukan"
      });
      const imageType = req.query.gender?.toLowerCase() === "cewe" ? "cewe" : "cowo";
      const imgUrl = pick[imageType];
      const response = await axios.get(imgUrl, {
        responseType: "arraybuffer"
      });
      const buffer = Buffer.from(response.data);
      res.writeHead(200, {
        "Content-Type": "image/jpeg",
        "Content-Length": buffer.length
      });
      res.end(buffer);
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};