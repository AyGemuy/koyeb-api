const axios = require("axios");
async function pinDown(url) {
  try {
    const response = await axios("https://pintodown.com/wp-admin/admin-ajax.php", {
      method: "POST",
      data: new URLSearchParams({
        action: "pinterest_action",
        pinterest: `is_private_video=&pinterest_video_url=${url}`
      }).toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        Origin: "https://pintodown.com",
        Referer: "https://pintodown.com/"
      }
    });
    const data = response.data;
    if (!data || !data.data || !data.data.video) throw new Error("Data video tidak ditemukan");
    return {
      status: true,
      creator: "yudz",
      data: {
        image: data.data.poster || null,
        video: data.data.video
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Gagal mengambil video dari Pinterest",
      error: error.message
    };
  }
}
module.exports = {
  name: "pinterest v2",
  desc: "Pinterest Video Downloader via pintodown.com",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      message: 'Parameter "url" tidak ditemukan.'
    });
    try {
      const result = await pinDown(url);
      res.json(result);
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Internal Server Error",
        error: err.message
      });
    }
  }
};