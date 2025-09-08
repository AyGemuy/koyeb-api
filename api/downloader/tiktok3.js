const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
async function ttDown(url) {
  try {
    const res = await axios("https://tiksave.io/api/ajaxSearch", {
      method: "POST",
      data: qs.stringify({
        q: url,
        lang: "id"
      }),
      headers: {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://tiksave.io",
        Referer: "https://tiksave.io/id/download-tiktok-mp3",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }
    });
    const html = res.data?.data;
    if (!html) return {
      status: false,
      message: "Tidak ada data dikembalikan."
    };
    const $ = cheerio.load(html);
    const title = $("h3").text();
    const author = $("p span").first().text();
    const onclick = $("a[onclick]");
    const links = [];
    onclick.each((_, el) => {
      const link = $(el).attr("href");
      if (link) links.push(link);
    });
    return {
      status: true,
      creator: "NuyyOfc",
      data: {
        title: title,
        author: author,
        vid1: links[0] || null,
        vid2: links[1] || null,
        vid_Hd: links[2] || null,
        audio: links[3] || null
      }
    };
  } catch (e) {
    return {
      status: false,
      message: "Terjadi kesalahan saat memproses.",
      error: e.message
    };
  }
}
module.exports = {
  name: "Tiktok v3",
  desc: "TikTok Downloader v3 via tiksave.io",
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