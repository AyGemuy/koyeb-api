const axios = require("axios");

function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}
async function openAIVision(prompt, image) {
  const apiKey = ["662413cf9b2e4a09b8175abf38853f1c", "e7956e69c5634672982005bde27e9223", "077cf44364ac4c32b8263482ef4371f1", "53f034d6af90448eb08b9fd57306ca15", "99fca1d1f66c49f19ff5d62a06c5469c", "ac21b13204694f70b66ba9241cbb1af1", "5cdd70a6fb774a598dec30f739aa7532", "002c22a49f5b44aa833a84d5953b48fe", "271124eea23d48608c5eabfee5b670ae", "662413cf9b2e4a09b8175abf38853f1c"];
  try {
    const response = await axios.post("https://api.aimlapi.com/chat/completions", {
      model: "gpt-4o",
      messages: [{
        role: "user",
        content: [{
          type: "text",
          text: prompt
        }, {
          type: "image_url",
          image_url: {
            url: image
          }
        }]
      }],
      max_tokens: 300
    }, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + pickRandom(apiKey)
      }
    });
    const mes = response.data.choices[0].message.content;
    return {
      status: true,
      creator: "yudz",
      message: mes
    };
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message);
    throw error;
  }
}
module.exports = {
  name: "openAIVision",
  desc: "Chat GPT-4o dengan input gambar dan prompt",
  category: "AI Image",
  params: ["prompt", "url"],
  async run(req, res) {
    const prompt = req.query.prompt || req.body.prompt;
    const url = req.query.url || req.body.url;
    if (!prompt || !url) return res.status(400).json({
      status: false,
      error: "Parameter prompt dan url wajib diisi!"
    });
    try {
      const result = await openAIVision(prompt, url);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        status: false,
        error: error.message || "Terjadi kesalahan"
      });
    }
  }
};