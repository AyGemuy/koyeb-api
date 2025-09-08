const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
async function twitImage(url) {
  try {
    const token = "CfDJ8E6ybIOHrjRCneZVgKPaXdGqCKr5L25xs9KsDN0eiVK87K4WdSQ9fyjIjQit7t6OCAjPMm7QqoyG9QetnZPVLyHx7yUlVfK5AMnqQz3OCvoPSK5z1mekNJcg-qIgxoMaK9dh3KbYz4Ctf8B03PExiN8";
    const cookie = ".AspNetCore.Antiforgery.cl57I6-xYTI=" + token;
    const res = await axios("https://snapvid.net/api/ajaxSearch", {
      method: "POST",
      data: qs.stringify({
        __RequestVerificationToken: token,
        q: url,
        w: ""
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: cookie,
        Origin: "https://snapvid.net",
        Referer: "https://snapvid.net/id/twitter-downloader",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const $ = cheerio.load(res.data.data);
    const a = $("a[class]");
    const image = a.attr("href");
    return {
      status: true,
      creator: "yudz",
      data: {
        image: image,
        source: url
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Failed to fetch image from tweet",
      error: error.message
    };
  }
}
module.exports = {
  name: "Ximage",
  desc: "Twitter/X Image Downloader via snapvid.net",
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
      const result = await twitImage(url);
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