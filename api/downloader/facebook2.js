const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
module.exports = {
  name: "Facebook v2",
  desc: "Download video Facebook via fdownloader.net",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url || req.body.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    const data = qs.stringify({
      k_exp: "1719382502",
      k_token: "caff0706549d24c12d4e8a6ba2f350b3785d3cff2864c26b25007513146eb455",
      q: url,
      lang: "id",
      web: "fdownloader.net",
      v: "v2",
      w: ""
    });
    try {
      const response = await axios.post("https://v3.fdownloader.net/api/ajaxSearch?lang=id", data, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Origin: "https://fdownloader.net",
          Referer: "https://fdownloader.net/",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
        }
      });
      const $ = cheerio.load(response.data.data);
      const links = [];
      $(".download-link-fb").each((i, el) => {
        links.push({
          url: $(el).attr("href"),
          resolution: $(el).attr("title")
        });
      });
      const duration = $("p").text();
      res.json({
        status: true,
        creator: "yudz",
        video_HD: links[0] || null,
        video_SD: links[1] || null,
        duration: duration
      });
    } catch (err) {
      res.status(500).json({
        status: false,
        error: err.message
      });
    }
  }
};