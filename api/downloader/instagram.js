const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
module.exports = {
  name: "Instagram",
  desc: "Instagram Downloader via DownloadGram",
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
    const data = qs.stringify({
      url: url,
      v: "3",
      lang: "en"
    });
    const config = {
      method: "POST",
      url: "https://api.downloadgram.org/media",
      headers: {
        "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
        "Content-Type": "application/x-www-form-urlencoded",
        "accept-language": "id-ID",
        referer: "https://downloadgram.org/",
        origin: "https://downloadgram.org",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        priority: "u=0",
        te: "trailers"
      },
      data: data
    };
    try {
      const response = await axios(config);
      const $ = cheerio.load(response.data);
      let mediaInfo = {};
      if ($("video").length) {
        mediaInfo.videoUrl = $("video source").attr("src");
        mediaInfo.downloadUrl = $("a[download]").attr("href");
        mediaInfo.posterUrl = $("video").attr("poster");
      } else if ($("img").length) {
        mediaInfo.imageUrl = $("img").attr("src");
        mediaInfo.downloadUrl = $("a[download]").attr("href");
      }
      for (let key in mediaInfo) {
        if (mediaInfo.hasOwnProperty(key)) {
          mediaInfo[key] = mediaInfo[key].replace(/\\\\"/g, "").replace(/\\"/g, "");
        }
      }
      if (!mediaInfo.downloadUrl) return res.status(404).json({
        status: false,
        message: "Media tidak ditemukan."
      });
      res.json({
        status: true,
        ...mediaInfo
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        message: "Gagal memproses permintaan.",
        error: err.message
      });
    }
  }
};