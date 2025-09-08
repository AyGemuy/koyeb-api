const axios = require("axios");
const {
  default: fetchJson
} = require("../../lib/fetcher");
module.exports = {
  name: "Pinterest",
  desc: "Pinterest Media Downloader",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter 'url' wajib diisi."
    });
    try {
      const fd = new URLSearchParams();
      fd.append("url", url);
      const sigma = await axios.post("https://sigmawire.net/pindown.php", fd, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36",
          Referer: "https://sigmawire.net/pinterest-downloader"
        }
      });
      if (sigma?.data?.media_url) {
        return res.json({
          status: true,
          result: {
            mediaUrl: sigma.data.media_url,
            title: sigma.data.title || "Pinterest Media",
            isVideo: sigma.data.media_url.endsWith(".mp4")
          }
        });
      }
    } catch (e) {
      console.warn("Sigmawire gagal, mencoba cadangan...");
    }
    try {
      const pinres = await pintod(url);
      if (pinres.error) throw new Error(pinres.error);
      return res.json({
        status: true,
        result: pinres
      });
    } catch (err2) {
      console.error("Downloader gagal:", err2);
      return res.status(500).json({
        status: false,
        error: "Gagal mengambil media dari Pinterest."
      });
    }
  }
};
async function pintod(url) {
  try {
    const apiUrl = `https://pinterestdownloader.io/id/frontendService/DownloaderService?url=${encodeURIComponent(url)}`;
    const headers = {
      "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36",
      Referer: "https://pinterestdownloader.io/id"
    };
    const response = await axios.get(apiUrl, {
      headers: headers
    });
    const data = response.data;
    const medias = data.medias || [];
    if (!medias.length) return {
      error: "Media tidak ditemukan"
    };
    const best = medias.sort((a, b) => b.size - a.size)[0];
    return {
      title: data.title || "Pinterest Media",
      mediaUrl: best.url,
      isVideo: best.extension === "mp4"
    };
  } catch (err) {
    return {
      error: err.message
    };
  }
}