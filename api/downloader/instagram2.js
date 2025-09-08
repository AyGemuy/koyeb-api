const axios = require("axios");
const cheerio = require("cheerio");
async function igDown(url) {
  try {
    const res = await axios(`https://igdownloader.app/id?url=${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
        Referer: "https://igdownloader.app/id",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }
    });
    const $ = cheerio.load(res.data);
    const videoUrl = $("a[download]").attr("href") || "";
    const title = $("title").text() || "";
    if (!videoUrl) throw new Error("Video URL tidak ditemukan");
    return {
      status: true,
      creator: "yudz",
      data: {
        title: title,
        videoUrl: videoUrl
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Gagal mengambil video dari Instagram",
      error: error.message
    };
  }
}
module.exports = {
  name: "Instagram v2",
  desc: "Instagram Video Downloader",
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
      const result = await igDown(url);
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