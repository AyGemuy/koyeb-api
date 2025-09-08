const fs = require("fs");
const {
  GoogleGenerativeAI
} = require("@google/generative-ai");
const axios = require("axios");
async function processImageWithGemini(buffer, mime, prompt) {
  const apiKeys = atob("QUl6YVN5Qklkb3UzYUY4dGM4cUJWZmZUSGpPZkhtQTd6OFFqNm1RfEFJemFTeUJ5UkxjXzJqWVhXUS1MbS1VT2xlMHBoY2VCakFiZnNDTXxBSXphU3lBeGQzYlhvaDBNbnd1ZnFWMUIzdnRFRlNNV0JQRFR1bkV8QUl6YVN5Q3htajU1WFlpekxaMmxPUHZHYzRLcUlWSUFlVEdsM25NfEFJemFTeUFTMGdTeWt5dXpYZG5MRHZnUGRMR1A2X3BkdmlLM2wxNHxBSXphU3lBYTg5WE9IM3RGd3lSNi1lTU04MTJ1Xzg4NDBZZXh1SEE")?.split("|");
  const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
  const genAI = new GoogleGenerativeAI(apiKey);
  const base64Image = buffer.toString("base64");
  const contents = [{
    text: prompt
  }, {
    inlineData: {
      mimeType: mime,
      data: base64Image
    }
  }];
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
      responseModalities: ["Text", "Image"]
    }
  });
  const response = await model.generateContent(contents);
  const part = response.response.candidates[0].content.parts.find(p => p.inlineData);
  if (!part) throw new Error("Gagal mendapatkan gambar hasil.");
  return Buffer.from(part.inlineData.data, "base64");
}
module.exports = {
  name: "Gemini Canvas",
  desc: "Edit gambar dengan AI (prompt manual)",
  category: "AI Image",
  params: ["url", "prompt"],
  async run(req, res) {
    const {
      url,
      prompt
    } = req.query;
    if (!url || !prompt) return res.status(400).json({
      status: false,
      error: "Parameter url dan prompt wajib diisi!"
    });
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer"
      });
      const buffer = Buffer.from(response.data);
      const mime = response.headers["content-type"];
      const result = await processImageWithGemini(buffer, mime, prompt);
      res.setHeader("Content-Type", mime || "image/png");
      res.end(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};