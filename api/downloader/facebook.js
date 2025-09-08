const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");
async function getToken() {
  const res = await axios.get("https://fdown.net", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "id-ID",
      "Upgrade-Insecure-Requests": "1"
    }
  });
  const $ = cheerio.load(res.data);
  return {
    token_v: $('input[name="token_v"]').val(),
    token_c: $('input[name="token_c"]').val(),
    token_h: $('input[name="token_h"]').val()
  };
}
async function request(url) {
  const {
    token_v,
    token_c,
    token_h
  } = await getToken();
  const data = qs.stringify({
    URLz: url,
    token_v: token_v,
    token_c: token_c,
    token_h: token_h
  });
  const res = await axios.post("https://fdown.net/download.php", data, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Android 10; Mobile; rv:131.0) Gecko/131.0 Firefox/131.0",
      "Content-Type": "application/x-www-form-urlencoded",
      "Accept-Language": "id-ID",
      Referer: "https://fdown.net/"
    }
  });
  return res.data;
}
async function download(url) {
  const html = await request(url);
  const $ = cheerio.load(html);
  const result = {
    normal: $("#sdlink").attr("href") || null,
    hd: $("#hdlink").attr("href") || null
  };
  return result;
}
module.exports = {
  name: "Facebook",
  desc: "Facebook Video Downloader via FDown.net",
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
      const result = await download(url);
      if (!result.normal && !result.hd) {
        return res.status(404).json({
          status: false,
          message: "Gagal mendapatkan link video."
        });
      }
      res.json({
        status: true,
        ...result
      });
    } catch (e) {
      res.status(500).json({
        status: false,
        message: "Gagal memproses video.",
        error: e.message
      });
    }
  }
};