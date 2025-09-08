const axios = require("axios");
module.exports = {
  name: "Instagram Audio",
  desc: "Download audio MP3 dari video Instagram menggunakan social.ioconvert.com",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url || req.body.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url wajib diisi!"
    });
    const headers = {
      Accept: "application/json, text/javascript, */*; q=0.01",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://f2mp.com",
      Referer: "https://f2mp.com/",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    };
    try {
      const info = await axios("https://social.ioconvert.com/video/info", {
        method: "POST",
        data: new URLSearchParams({
          type: "INSTAGRAM",
          url: url
        }).toString(),
        headers: headers
      });
      const key = info.data?.data?.key;
      if (!key) throw new Error("Gagal mendapatkan key video");
      const convert = await axios("https://social.ioconvert.com/audio/convert", {
        method: "POST",
        data: new URLSearchParams({
          id: key,
          quality: "128",
          format: "mp3",
          prefix: "F2mp"
        }).toString(),
        headers: headers
      });
      if (convert.data?.message !== "OK") throw new Error("Gagal convert audio");
      const mp3Url = `https://social.ioconvert.com/audio/download?id=${key}&quality=128&format=mp3&prefix=F2mp`;
      res.json({
        status: true,
        creator: "yudz",
        mp3: mp3Url
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        error: error.message || error.toString()
      });
    }
  }
};