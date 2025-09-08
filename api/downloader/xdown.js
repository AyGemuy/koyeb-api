const axios = require("axios");
const cheerio = require("cheerio");
async function twitDown(url) {
  try {
    const res = await axios(`https://twitsave.com/info?url=${encodeURIComponent(url)}`, {
      method: "GET",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8",
        Cookie: "XSRF-TOKEN=your_token_here; twitsave_session=your_session_here",
        Referer: "https://twitsave.com/info?url",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      }
    });
    const $ = cheerio.load(res.data);
    const links = $("a[target]");
    const infoList = [];
    links.each((i, el) => {
      if (i < 2) {
        infoList.push({
          info: $(el).text(),
          url: $(el).attr("href")
        });
      }
    });
    const authorUrl = infoList[0]?.url || "";
    const username = "@" + (authorUrl.split("/")[4] || "unknown");
    const upload = infoList[1]?.info || "";
    const title = $("p.m-2").text() || "";
    const videoUrl = $("video[class]").attr("src");
    return {
      status: true,
      creator: "yudz",
      data: {
        title: title,
        username: username,
        url_author: authorUrl,
        upload: upload,
        video: videoUrl
      }
    };
  } catch (error) {
    return {
      status: false,
      creator: "yudz",
      message: "Gagal mengambil data video dari twitsave",
      error: error.message
    };
  }
}
module.exports = {
  name: "Xdown",
  desc: "Twitter/X Video Downloader via twitsave.com",
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
      const result = await twitDown(url);
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