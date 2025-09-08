const axios = require("axios");
module.exports = {
  name: "Text2Image",
  desc: "Text to Image (Prodia API)",
  category: "AI Image",
  params: ["prompt"],
  async run(req, res) {
    const prompt = req.query.prompt || req.body.prompt;
    if (!prompt) return res.status(400).json({
      status: false,
      error: "Parameter prompt wajib diisi!"
    });
    const apiKeys = ["76247d83-eed7-41e2-9187-9e741c05a6b9", "d323e5fb-d11a-47c9-b4cb-316d62817bb9", "a428d6c5-36a1-4af0-9b1a-2cdef0326434", "1c022783-22a7-4c0e-af37-1387e9fdee23", "520890eb-17db-4085-a24b-09566d51d28f"];

    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)];
    }
    const key = pickRandom(apiKeys);
    try {
      const generate = await axios({
        method: "POST",
        url: "https://api.prodia.com/v1/sd/generate",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          "X-Prodia-Key": key
        },
        data: {
          model: "absolutereality_v181.safetensors [3d9d4d2b]",
          negative_prompt: "Super Realistic, Super Smooth 8K HD",
          prompt: prompt,
          width: 512,
          height: 512,
          steps: 20,
          style_preset: "enhance",
          cfg_scale: 7,
          seed: -1,
          upscale: false,
          sampler: "DPM++ 2M Karras"
        }
      });
      const job = generate.data.job;
      let resultImage;
      for (let i = 0; i < 3; i++) {
        await new Promise(resolve => setTimeout(resolve, 5e3));
        const status = await axios({
          method: "GET",
          url: `https://api.prodia.com/v1/job/${job}`,
          headers: {
            accept: "application/json",
            "X-Prodia-Key": key
          }
        });
        if (status.data.status === "succeeded") {
          resultImage = status.data.imageUrl;
          break;
        }
      }
      if (!resultImage) return res.status(408).json({
        status: false,
        error: "Image generation timeout!"
      });
      return res.json({
        status: true,
        creator: "yudz",
        image: resultImage
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        status: false,
        error: err.message || err.toString()
      });
    }
  }
};