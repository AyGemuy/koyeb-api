const axios = require("axios");
const {
  translate
} = require("bing-translate-api");
module.exports = {
  name: "Flux",
  desc: "Generate AI Image menggunakan FluxAI",
  category: "AI Image",
  params: ["prompt"],
  async run(req, res) {
    const {
      prompt
    } = req.query;
    if (!prompt) return res.status(400).json({
      status: false,
      error: 'Parameter "prompt" wajib diisi.'
    });
    try {
      const translated = (await translate(prompt, null, "en").catch(() => ({})))?.translation || prompt;
      const {
        data
      } = await axios.post("https://fluxai.pro/api/tools/fast", {
        prompt: translated
      }, {
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "Mozilla/5.0 (compatible; FluxAI-Client/1.0)",
          Accept: "application/json"
        }
      });
      if (!data?.ok || !data.data?.imageUrl) throw new Error("Gagal mendapatkan gambar dari fluxai.pro");
      const imageUrl = data.data.imageUrl;
      const contentType = imageUrl.endsWith(".gif") ? "image/gif" : imageUrl.endsWith(".mp4") ? "video/mp4" : "image/jpeg";
      const file = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });
      res.setHeader("Content-Type", contentType);
      res.send(file.data);
    } catch (e) {
      res.status(500).json({
        status: false,
        error: e.message
      });
    }
  }
};