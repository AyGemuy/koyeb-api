const axios = require("axios");
module.exports = {
  name: "Instagram Image",
  desc: "Download gambar dari Instagram menggunakan social.ioconvert.com",
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
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Origin: "https://f2mp.com",
      Referer: "https://f2mp.com/",
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
    };
    try {
      const resData = await axios("https://social.ioconvert.com/video/info", {
        method: "POST",
        data: new URLSearchParams({
          type: "INSTAGRAM",
          url: url
        }).toString(),
        headers: headers
      });
      const data = resData.data?.data;
      if (!data || !data.images || !data.key) throw new Error("Gagal mendapatkan data gambar");
      const images = data.images;
      const key = data.key;
      const media = images.map(img => ({
        link: `https://social.ioconvert.com/download?obj=photo&key=${key}&type=images&id=${img.id}&download=&file_prefix=f2mp`
      }));
      res.json({
        status: true,
        creator: "yudz",
        media: media
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