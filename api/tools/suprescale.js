const axios = require("axios");
module.exports = {
  name: "Superupscale",
  desc: "Upscale gambar dengan pilihan resize dan mode anime",
  category: "Tools",
  params: ["url", "resize", "anime"],
  async run(req, res) {
    const {
      url,
      resize,
      anime
    } = req.query;
    if (!url || !resize || !anime) return res.status(400).json({
      status: false,
      error: "Parameter url, resize, dan anime wajib diisi!"
    });
    const validResize = ["2", "4", "6", "8", "16"];
    const isAnime = anime === "true" || anime === "false";
    if (!validResize.includes(resize) || !isAnime) return res.status(400).json({
      status: false,
      error: "resize hanya boleh 2, 4, 6, 8, atau 16 dan anime harus true/false"
    });
    const apiURL = `https://fastrestapis.fasturl.cloud/aiimage/superscale?imageUrl=${encodeURIComponent(url)}&resize=${resize}&anime=${anime}`;
    try {
      const result = await axios.get(apiURL, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", result.headers["content-type"]);
      res.end(result.data);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};