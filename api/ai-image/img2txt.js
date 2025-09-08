const axios = require("axios");
module.exports = {
  name: "image2Text",
  desc: "Mengubah gambar menjadi deskripsi/prompt teks menggunakan cococlip.ai",
  category: "AI Image",
  params: ["url"],
  async run(req, res) {
    const image = req.query.url || req.body.url;
    if (!image) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    try {
      const response = await axios.get("https://cococlip.ai/api/v1/image_script_generate?image=" + encodeURIComponent(image), {
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          Cookie: "__Host-authjs.csrf-token=4c1bc2bd995a2877efd7ad66297d87a9f1d041314ac7ee9b6bfd2ab87c5fad31%7C7a64b87d215858a5ed780e5e6f6bc297236d1f20911e813e3ea1d351882ae6a3; __Secure-authjs.callback-url=https%3A%2F%2Fcococlip.ai",
          Referer: "https://cococlip.ai/features/image-to-prompt",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        }
      });
      if (!response.data || !response.data.prompt) throw new Error("Gagal mendapatkan prompt dari API");
      res.json({
        status: true,
        creator: "yudz",
        prompt: response.data.prompt
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error: error.message
      });
    }
  }
};