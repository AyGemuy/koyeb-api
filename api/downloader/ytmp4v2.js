const axios = require("axios");
module.exports = {
  name: "YTmp4 v2",
  desc: "Download video YouTube MP4 via savetube",
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
    try {
      const baseUrl = "https://cdn54.savetube.me/info?url=";
      const resInfo = await axios.get(baseUrl + url);
      if (resInfo.data.status !== true) {
        return res.status(400).json({
          status: false,
          error: "Gagal mengambil data video"
        });
      }
      const data = resInfo.data.data;
      const {
        key,
        status,
        title,
        thumbnail,
        durationLabel,
        id,
        duration
      } = data;
      const dataYt = await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${id}&key=AIzaSyBn0jhzuq0C48igfxbIzhKEjMKYQwvK3_o`);
      const items = dataYt.data.items;
      if (!items || items.length === 0) {
        return res.status(400).json({
          status: false,
          error: "Video tidak ditemukan di YouTube"
        });
      }
      const snippet = items[0].snippet;
      const durasi = formatSecond(duration);
      const desk = snippet.description;
      const time = snippet.publishedAt;
      const up = formatTime(time);
      const resDownload = await axios.get("https://cdn54.savetube.me/download/video/360/" + key);
      const result = {
        status: true,
        creator: "yudz",
        data: {
          title: title,
          thumbnail: thumbnail,
          mp4: resDownload.data.data.downloadUrl,
          upload: up,
          deskripsi: desk,
          channel: snippet.channelTitle,
          resolusi: "360p"
        }
      };
      res.json(result);
    } catch (e) {
      res.status(500).json({
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
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
}