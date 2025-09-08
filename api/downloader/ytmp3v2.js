const axios = require("axios");
module.exports = {
  name: "YTmp3 v2",
  desc: "Download YouTube MP3 via x2download + cv76.ytcdn.app",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url dibutuhkan"
    });
    const baseUrl = "https://cv76.ytcdn.app/api/json/convert";
    try {
      const resSearch = await axios("https://x2download.app/api/ajaxSearch", {
        method: "POST",
        data: new URLSearchParams({
          q: url,
          vt: "home"
        }).toString(),
        headers: {
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          Origin: "https://x2download.app",
          Referer: "https://x2download.app/id40/download-youtube-to-mp3",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36",
          "X-Requested-With": "XMLHttpRequest"
        }
      });
      const {
        vid: id,
        token,
        timeExpires: timeExpire,
        fn: fname,
        title
      } = resSearch.data;
      const data = {
        v_id: id,
        ftype: "mp3",
        fquality: "360p",
        fname: fname,
        token: token,
        timeExpire: timeExpire
      };
      const headers = {
        Accept: "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: "https://x2download.app",
        Referer: "https://x2download.app/",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"
      };
      let code = 300;
      let responseConvert;
      while (code !== 200) {
        responseConvert = await axios.post(baseUrl, new URLSearchParams(data).toString(), {
          headers: headers
        });
        code = responseConvert.data.statusCode;
        if (code === 200) {
          const result = {
            status: true,
            creator: "yudz",
            data: {
              title: title,
              thumbnail: `https://i.ytimg.com/vi/${id}/mqdefault.jpg`,
              mp3: responseConvert.data.result
            }
          };
          return res.json(result);
        } else if (responseConvert.data.result === "Converting") {
          await new Promise(resolve => setTimeout(resolve, 3e3));
        } else {
          return res.status(500).json({
            status: false,
            error: "Gagal konversi audio"
          });
        }
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        error: error.message || "Terjadi kesalahan"
      });
    }
  }
};