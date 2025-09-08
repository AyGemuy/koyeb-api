const axios = require("axios");
const BASE_URL = "https://chat-gpt.pictures";
const GENERATE_URL = "/api/generateImage";
const LIST_MODEL = ["sdxl", "default", "protogen-3.4", "realistic-vision-v13", "dream-shaper-8797", "midjourney"];

function payload(prompt, modelIndex) {
  return {
    captionInput: prompt,
    captionModel: LIST_MODEL[modelIndex]
  };
}
module.exports = {
  name: "TextToImg",
  desc: "Generate AI image based on prompt",
  category: "AI Image",
  params: ["prompt", "model"],
  async run(req, res) {
    const prompt = req.query.prompt || req.body.prompt;
    const model = parseInt(req.query.model || req.body.model || 0);
    if (!prompt) return res.status(400).json({
      status: false,
      error: "Parameter prompt wajib diisi!"
    });
    if (isNaN(model) || model < 0 || model >= LIST_MODEL.length) {
      return res.status(400).json({
        status: false,
        error: `Model tidak valid. Pilih salah satu: ${LIST_MODEL.map((m, i) => `${i} = ${m}`).join(", ")}`
      });
    }
    try {
      const {
        data
      } = await axios.post(BASE_URL + GENERATE_URL, payload(prompt, model), {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0",
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
          Connection: "keep-alive"
        }
      });
      return res.json({
        status: true,
        creator: "yudz",
        model: LIST_MODEL[model],
        prompt: prompt,
        result: data
      });
    } catch (e) {
      return res.status(500).json({
        status: false,
        error: e.message || e.toString()
      });
    }
  }
};