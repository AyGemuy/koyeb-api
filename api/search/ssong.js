const axios = require("axios");
const searchThatSong = {
  detect: async function(lyric) {
    try {
      const response = await axios.post("https://searchthatsong.com/", {
        data: lyric
      }, {
        headers: {
          "Content-Type": "text/plain",
          origin: "https://searchthatsong.com",
          referer: "https://searchthatsong.com/"
        }
      });
      return response.data;
    } catch (error) {
      console.error("Terjadi kesalahan saat mencari lagu:", error);
      throw "Gagal mencari lagu. Coba lagi nanti.";
    }
  }
};
module.exports = {
  name: "searchsong",
  desc: "Deteksi lagu dari lirik",
  category: "Search",
  params: ["q"],
  async run(req, res) {
    const {
      q
    } = req.query;
    if (!q) return res.status(400).json({
      status: false,
      message: 'Parameter "q" wajib diisi.'
    });
    try {
      const result = await searchThatSong.detect(q);
      res.json({
        status: true,
        creator: "yudz",
        data: result
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Gagal mencari lagu.",
        error: err.toString()
      });
    }
  }
};