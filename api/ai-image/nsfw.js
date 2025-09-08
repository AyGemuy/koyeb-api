const axios = require("axios");
module.exports = {
  name: "Nsfw",
  desc: "Generate gambar NSFW dari prompt (AI)",
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
    const url = `https://fastrestapis.fasturl.cloud/aiimage/nsfw?prompt=${encodeURIComponent(prompt)}`;
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", response.headers["content-type"]);
      res.end(response.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};