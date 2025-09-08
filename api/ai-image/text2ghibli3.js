const axios = require("axios");
module.exports = {
  name: "Text2Ghibli v3",
  desc: "Generate gambar bergaya Studio Ghibli dari teks",
  category: "AI Image",
  params: ["prompt"],
  async run(req, res) {
    const {
      prompt
    } = req.query;
    if (!prompt) return res.status(400).json({
      status: false,
      error: "Parameter prompt wajib diisi!"
    });
    const endpoints = ["https://api.nekorinn.my.id/ai-img/text2ghibli-v3?text="];
    for (const base of endpoints) {
      try {
        const url = base + encodeURIComponent(prompt);
        const response = await axios.get(url, {
          responseType: "arraybuffer"
        });
        res.setHeader("Content-Type", response.headers["content-type"]);
        return res.end(response.data);
      } catch (err) {
        continue;
      }
    }
    res.status(500).json({
      status: false,
      error: "Semua API gagal merespons."
    });
  }
};