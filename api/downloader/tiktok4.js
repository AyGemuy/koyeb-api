const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
async function ttDown(url) {
  try {
    const res = await axios("https://savetik.co/api/ajaxSearch", {
      method: "POST",
      data: qs.stringify({
        q: url,
        lang: "en"
      }),
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://savetik.co",
        Pragma: "no-cache",
        Referer: "https://savetik.co/en2",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
        "X-Requested-With": "XMLHttpRequest"
      }
    });
    const html = res.data?.data;
    if (!html) {
      return {
        status: false,
        creator: "yudz",
        message: "No response data found."
      };
    }
    const $ = cheerio.load(html);
    const title = $("h3").text();
    const onclick = $("a[onclick]");
    const file = [];
    onclick.each((_, el) => {
      const link = $(el).attr("href");
      if (link) file.push(link);
    });
    return {
      status: true,
      creator: "yudz",
      data: {
        title: title,
        mp4: file[0] || null,
        hd: file[2] || null,
        mp3: file[3] || null
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Error occurred",
      error: error.message
    };
  }
}
module.exports = {
  name: "Tiktok v4",
  desc: "TikTok Downloader v4 via savetik.co",
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
      const result = await ttDown(url);
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