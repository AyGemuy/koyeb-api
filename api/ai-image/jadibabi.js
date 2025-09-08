const fs = require("fs");
const {
  GoogleGenerativeAI
} = require("@google/generative-ai");
const axios = require("axios");
const prompt = "Transform the face of the character in the image into a pig-like appearance. Replace the mouth and nose with a realistic pig's snout. Slightly adjust the skin tone to a soft brown shade. Maintain the original style and quality of the image, but ensure the facial features distinctly resemble a pig while keeping the rest of the body and setting unchanged.";
module.exports = {
  name: "Jadibabi",
  desc: "Ubah wajah jadi babi dengan AI",
  category: "AI Image",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const response = await axios.get(url, {
        responseType: "arraybuffer"
      });
      const buffer = Buffer.from(response.data);
      const mime = response.headers["content-type"];
      const apiKeys = atob("QUl6YVN5Qklkb3UzYUY4dGM4cUJWZmZUSGpPZkhtQTd6OFFqNm1RfEFJemFTeUJ5UkxjXzJqWVhXUS1MbS1VT2xlMHBoY2VCakFiZnNDTXxBSXphU3lBeGQzYlhvaDBNbnd1ZnFWMUIzdnRFRlNNV0JQRFR1bkV8QUl6YVN5Q3htajU1WFlpekxaMmxPUHZHYzRLcUlWSUFlVEdsM25NfEFJemFTeUFTMGdTeWt5dXpYZG5MRHZnUGRMR1A2X3BkdmlLM2wxNHxBSXphU3lBYTg5WE9IM3RGd3lSNi1lTU04MTJ1Xzg4NDBZZXh1SEE")?.split("|");
      const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length)];
      const genAI = new GoogleGenerativeAI(apiKey);
      const result = await genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
          responseModalities: ["Text", "Image"]
        }
      }).generateContent([{
        text: prompt
      }, {
        inlineData: {
          mimeType: mime,
          data: buffer.toString("base64")
        }
      }]);
      const part = result.response.candidates[0].content.parts.find(p => p.inlineData);
      if (!part) throw new Error("Gagal mendapatkan gambar hasil.");
      const finalBuffer = Buffer.from(part.inlineData.data, "base64");
      res.setHeader("Content-Type", "image/png");
      res.end(finalBuffer);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};