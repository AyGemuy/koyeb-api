const axios = require("axios");
module.exports = {
  name: "YTmp3 v3",
  desc: "Download YouTube MP3 via savetube.me API",
  category: "Downloader",
  params: ["url"],
  async run(req, res) {
    const url = req.query.url;
    if (!url) return res.status(400).json({
      status: false,
      error: "Parameter url dibutuhkan"
    });
    try {
      const baseUrl = "https://cdn54.savetube.me/info?url=";
      const infoRes = await axios.get(baseUrl + encodeURIComponent(url));
      if (!infoRes.data.status) return res.status(404).json({
        status: false,
        error: "Video tidak ditemukan"
      });
      const data = infoRes.data.data;
      const {
        status,
        title,
        thumbnail,
        durationLabel,
        id,
        duration,
        key
      } = data;
      const ytRes = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyBn0jhzuq0C48igfxbIzhKEjMKYQwvK3_o`);
      const snippet = ytRes.data.items[0]?.snippet || {};
      const desk = snippet.description || "No description.";
      const time = snippet.publishedAt || new Date().toISOString();
      const up = formatTime(time);
      const downloadRes = await axios.get("https://cdn54.savetube.me/download/audio/128/" + key);
      const mp3Url = downloadRes.data.data?.downloadUrl;
      if (!mp3Url) return res.status(500).json({
        status: false,
        error: "Gagal mendapatkan link download MP3"
      });
      const result = {
        status: true,
        creator: "yudz",
        data: {
          title: title,
          thumbnail: thumbnail,
          description: desk,
          upload: up,
          duration: formatSecond(duration),
          mp3: mp3Url
        }
      };
      return res.json(result);
    } catch (e) {
      console.error(e);
      return res.status(500).json({
        status: false,
        error: e.message || "Terjadi kesalahan"
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

function formatSecond(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
}