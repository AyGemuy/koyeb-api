const fs = require("fs");
const {
  GoogleGenerativeAI: GenerativeModel
} = require("@google/generative-ai");
const axios = require("axios");
const HIJAB_PROMPT = "Modify the character to wear a traditional white hijab as commonly worn by Indonesian Muslim women. Ensure the hijab fully covers the hair, neck, and ears, leaving no hair visible at all. The hijab should appear natural, well-wrapped, and modest, with no part of the original hairstyle showing. Maintain the original face, clothing, and background—only add the fully covering white hijab.";
module.exports = {
  name: "Berhijab/Custom",
  desc: "Ubah karakter menjadi berhijab/custom dengan AI",
  category: "AI Image",
  params: ["url"],
  async run(req, res) {
    const {
      url: imageUrl,
      prompt = HIJAB_PROMPT
    } = req.query;
    if (!imageUrl) {
      return res.status(400).json({
        status: false,
        error: "Parameter url wajib diisi!"
      });
    }
    try {
      const imageResponse = await axios.get(imageUrl, {
        responseType: "arraybuffer"
      });
      const imageBuffer = Buffer.from(imageResponse.data);
      const contentType = imageResponse.headers["content-type"];
      const API_KEYS = atob("QUl6YVN5Qklkb3UzYUY4dGM4cUJWZmZUSGpPZkhtQTd6OFFqNm1RfEFJemFTeUJ5UkxjXzJqWVhXUS1MbS1VT2xlMHBoY2VCakFiZnNDTXxBSXphU3lBeGQzYlhvaDBNbnd1ZnFWMUIzdnRFRlNNV0JQRFR1bkV8QUl6YVN5Q3htajU1WFlpekxaMmxPUHZHYzRLcUlWSUFlVEdsM25NfEFJemFTeUFTMGdTeWt5dXpYZG5MRHZnUGRMR1A2X3BkdmlLM2wxNHxBSXphU3lBYTg5WE9IM3RGd3lSNi1lTU04MTJ1Xzg4NDBZZXh1SEE")?.split("|");
      const randomApiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)];
      const genAI = new GenerativeModel(randomApiKey);
      const modelConfig = {
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {}
      };
      modelConfig.generationConfig.responseModalities = ["Text", "Image"];
      const promptContent = {
        text: prompt
      };
      const result = await genAI.getGenerativeModel(modelConfig).generateContent([promptContent, {
        inlineData: {
          mimeType: contentType,
          data: imageBuffer.toString("base64")
        }
      }]);
      const imagePart = result.response.candidates[0].content.parts.find(part => part.inlineData);
      if (!imagePart) {
        throw new Error("Gagal mendapatkan gambar hasil.");
      }
      const outputImageBuffer = Buffer.from(imagePart.inlineData.data, "base64");
      res.setHeader("Content-Type", "image/png");
      res.end(outputImageBuffer);
    } catch (error) {
      console.error(error);
      const errorResponse = {
        status: false,
        error: error.message
      };
      res.status(500).json(errorResponse);
    }
  }
};