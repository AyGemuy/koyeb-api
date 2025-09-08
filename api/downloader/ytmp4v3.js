const axios = require("axios");
module.exports = {
  name: "YTmp4 v3",
  desc: "Download YouTube MP4 via x2download + cv76.ytcdn.app",
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
      const resYt = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyBn0jhzuq0C48igfxbIzhKEjMKYQwvK3_o`);
      const items = resYt.data.items;
      if (!items || items.length === 0) {
        return res.status(400).json({
          status: false,
          error: "Video tidak ditemukan di YouTube"
        });
      }
      const snippet = items[0].snippet;
      let desk = snippet.description || "Nothing.";
      let up = formatTime(snippet.publishedAt);
      const data = {
        v_id: id,
        ftype: "mp4",
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
              mp4: responseConvert.data.result,
              deskripsi: desk,
              upload: up,
              channel: snippet.channelTitle,
              resolusi: "360p"
            }
          };
          return res.json(result);
        } else if (responseConvert.data.result === "Converting") {
          await new Promise(resolve => setTimeout(resolve, 3e3));
        } else {
          return res.status(500).json({
            status: false,
            error: "Gagal konversi video"
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

function formatTime(time) {
  const date = new Date(time);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZoneName: "short"
  });
}