const axios = require("axios");
const base64EncodingUrl = (trackUrl, trackName, artistName) => {
  const data = `__/:${trackUrl}:${trackName}:${artistName}`;
  return Buffer.from(data).toString("base64");
};
const headers = {
  "Content-Type": "application/json",
  "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Mobile Safari/537.36",
  Referer: "https://spotify-down.com/"
};
module.exports = {
  name: "Spotify V2",
  desc: "Download lagu dari Spotify (spotify-down.com)",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const {
      url
    } = req.query;
    if (!url || !url.includes("open.spotify.com")) return res.status(400).json({
      status: false,
      error: "Masukkan URL dari Spotify!"
    });
    try {
      const metaRes = await axios.post("https://spotify-down.com/api/metadata", null, {
        params: {
          link: url
        },
        headers: headers
      });
      const meta = metaRes.data?.data;
      if (!meta?.link) throw new Error("Gagal ambil metadata");
      const encoded = base64EncodingUrl(meta.link, meta.title, meta.artists);
      const downloadRes = await axios.get("https://spotify-down.com/api/download", {
        params: {
          link: meta.link,
          n: meta.title,
          a: meta.artists,
          t: encoded
        },
        headers: headers
      });
      const downloadUrl = downloadRes.data?.data?.link;
      if (!downloadUrl) throw new Error("Gagal ambil link download");
      res.json({
        status: true,
        metadata: meta,
        download: downloadUrl
      });
    } catch (e) {
      res.status(500).json({
        status: false,
        error: e.message || "Gagal memproses request"
      });
    }
  }
};